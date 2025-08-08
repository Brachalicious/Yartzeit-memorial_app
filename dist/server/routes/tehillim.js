import express from 'express';
import { db } from '../database/connection.js';
import { SefariaService } from '../services/sefaria.js';
const router = express.Router();
// Get all completed Tehillim chapters
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all completed Tehillim chapters...');
        const chapters = await db
            .selectFrom('tehillim_chapters')
            .selectAll()
            .orderBy('date_completed', 'desc')
            .orderBy('chapter_number', 'asc')
            .execute();
        console.log(`Found ${chapters.length} completed Tehillim chapters`);
        res.json(chapters);
    }
    catch (error) {
        console.error('Error fetching Tehillim chapters:', error);
        res.status(500).json({ error: 'Failed to fetch Tehillim chapters' });
    }
});
// Get Tehillim chapter info from Sefaria
router.get('/chapter/:number/info', async (req, res) => {
    try {
        const chapterNumber = parseInt(req.params.number);
        if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 150) {
            res.status(400).json({ error: 'Invalid chapter number' });
            return;
        }
        console.log(`Fetching info for Tehillim chapter ${chapterNumber}`);
        const chapterInfo = await SefariaService.getTehillimInfo(chapterNumber);
        const commonNames = SefariaService.getCommonTehillimNames();
        const response = {
            chapterNumber,
            ...chapterInfo,
            commonName: commonNames[chapterNumber] || null
        };
        console.log(`Retrieved info for chapter ${chapterNumber}`);
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching chapter info:', error);
        res.status(500).json({ error: 'Failed to fetch chapter information' });
    }
});
// Get Tehillim chapters by date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching Tehillim chapters for date: ${date}`);
        const chapters = await db
            .selectFrom('tehillim_chapters')
            .selectAll()
            .where('date_completed', '=', date)
            .orderBy('chapter_number', 'asc')
            .execute();
        console.log(`Found ${chapters.length} Tehillim chapters for ${date}`);
        res.json(chapters);
    }
    catch (error) {
        console.error('Error fetching Tehillim chapters by date:', error);
        res.status(500).json({ error: 'Failed to fetch Tehillim chapters' });
    }
});
// Create new Tehillim chapter entry
router.post('/', async (req, res) => {
    try {
        const { chapter_number, chapter_name, date_completed, notes } = req.body;
        if (!chapter_number || !date_completed) {
            res.status(400).json({ error: 'Chapter number and date are required' });
            return;
        }
        if (chapter_number < 1 || chapter_number > 150) {
            res.status(400).json({ error: 'Chapter number must be between 1 and 150' });
            return;
        }
        console.log('Creating new Tehillim chapter entry:', { chapter_number, date_completed });
        // Try to get chapter info from Sefaria if no name provided
        let finalChapterName = chapter_name;
        if (!finalChapterName) {
            try {
                const chapterInfo = await SefariaService.getTehillimInfo(chapter_number);
                const commonNames = SefariaService.getCommonTehillimNames();
                finalChapterName = commonNames[chapter_number] ||
                    (chapterInfo ? chapterInfo.englishTitle : null);
            }
            catch (error) {
                console.log('Could not fetch chapter name from Sefaria, proceeding without it');
            }
        }
        const result = await db
            .insertInto('tehillim_chapters')
            .values({
            chapter_number,
            chapter_name: finalChapterName || null,
            date_completed,
            notes: notes || null,
            created_at: new Date().toISOString()
        })
            .returning('id')
            .executeTakeFirstOrThrow();
        console.log('Created Tehillim chapter entry with ID:', result.id);
        res.status(201).json({ id: result.id, message: 'Tehillim chapter saved successfully' });
    }
    catch (error) {
        console.error('Error creating Tehillim chapter entry:', error);
        res.status(500).json({ error: 'Failed to save Tehillim chapter' });
    }
});
// Delete Tehillim chapter entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting Tehillim chapter:', id);
        await db
            .deleteFrom('tehillim_chapters')
            .where('id', '=', parseInt(id))
            .execute();
        console.log('Deleted Tehillim chapter:', id);
        res.json({ message: 'Tehillim chapter deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting Tehillim chapter:', error);
        res.status(500).json({ error: 'Failed to delete Tehillim chapter' });
    }
});
// Get Tehillim progress (chapters completed vs total 150)
router.get('/progress', async (req, res) => {
    try {
        console.log('Fetching Tehillim progress...');
        const completedChapters = await db
            .selectFrom('tehillim_chapters')
            .select(['chapter_number'])
            .groupBy('chapter_number')
            .execute();
        const uniqueChapters = completedChapters.map(c => c.chapter_number).sort((a, b) => a - b);
        const totalChapters = 150;
        const completedCount = uniqueChapters.length;
        const remainingChapters = [];
        for (let i = 1; i <= totalChapters; i++) {
            if (!uniqueChapters.includes(i)) {
                remainingChapters.push(i);
            }
        }
        const progress = {
            total_chapters: totalChapters,
            completed_count: completedCount,
            remaining_count: totalChapters - completedCount,
            completed_chapters: uniqueChapters,
            remaining_chapters: remainingChapters,
            progress_percentage: Math.round((completedCount / totalChapters) * 100)
        };
        console.log(`Tehillim progress: ${completedCount}/${totalChapters} chapters completed`);
        res.json(progress);
    }
    catch (error) {
        console.error('Error fetching Tehillim progress:', error);
        res.status(500).json({ error: 'Failed to fetch Tehillim progress' });
    }
});
// Get suggested chapters for today
router.get('/suggestions', async (req, res) => {
    try {
        console.log('Fetching suggested Tehillim chapters...');
        const today = new Date();
        const dayOfMonth = today.getDate();
        // Traditional daily Tehillim based on day of month
        const dailySuggestions = [];
        // Days 1-29 have specific chapter ranges, day 30 covers remaining chapters
        if (dayOfMonth <= 29) {
            const chaptersPerDay = Math.ceil(150 / 30);
            const startChapter = (dayOfMonth - 1) * chaptersPerDay + 1;
            const endChapter = Math.min(dayOfMonth * chaptersPerDay, 150);
            for (let i = startChapter; i <= endChapter; i++) {
                dailySuggestions.push(i);
            }
        }
        else {
            // Day 30 - chapters 140-150
            for (let i = 140; i <= 150; i++) {
                dailySuggestions.push(i);
            }
        }
        // Popular chapters for special occasions
        const popularChapters = [23, 27, 91, 121, 130, 142];
        // Get already completed chapters to exclude from suggestions
        const completedToday = await db
            .selectFrom('tehillim_chapters')
            .select(['chapter_number'])
            .where('date_completed', '=', today.toISOString().split('T')[0])
            .execute();
        const completedNumbers = completedToday.map(c => c.chapter_number);
        const suggestions = {
            daily_portion: dailySuggestions.filter(n => !completedNumbers.includes(n)),
            popular_chapters: popularChapters.filter(n => !completedNumbers.includes(n)),
            completed_today: completedNumbers,
            day_of_month: dayOfMonth
        };
        console.log(`Generated suggestions for day ${dayOfMonth}`);
        res.json(suggestions);
    }
    catch (error) {
        console.error('Error fetching Tehillim suggestions:', error);
        res.status(500).json({ error: 'Failed to fetch suggestions' });
    }
});
export default router;
