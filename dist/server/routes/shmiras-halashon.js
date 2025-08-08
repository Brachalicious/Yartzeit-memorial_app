import express from 'express';
import { db } from '../database/connection.js';
const router = express.Router();
// Get all Shmiras HaLashon entries
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all Shmiras HaLashon entries...');
        const entries = await db
            .selectFrom('shmiras_halashon_entries')
            .selectAll()
            .orderBy('date_recorded', 'desc')
            .execute();
        console.log(`Found ${entries.length} Shmiras HaLashon entries`);
        res.json(entries);
    }
    catch (error) {
        console.error('Error fetching Shmiras HaLashon entries:', error);
        res.status(500).json({ error: 'Failed to fetch Shmiras HaLashon entries' });
    }
});
// Get Shmiras HaLashon entries by date range
router.get('/range/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;
        console.log(`Fetching Shmiras HaLashon entries from ${startDate} to ${endDate}...`);
        const entries = await db
            .selectFrom('shmiras_halashon_entries')
            .selectAll()
            .where('date_recorded', '>=', startDate)
            .where('date_recorded', '<=', endDate)
            .orderBy('date_recorded', 'desc')
            .execute();
        console.log(`Found ${entries.length} Shmiras HaLashon entries in range`);
        res.json(entries);
    }
    catch (error) {
        console.error('Error fetching Shmiras HaLashon entries by range:', error);
        res.status(500).json({ error: 'Failed to fetch Shmiras HaLashon entries' });
    }
});
// Get entry for specific date
router.get('/date/:date', async (req, res) => {
    try {
        const { date } = req.params;
        console.log(`Fetching Shmiras HaLashon entry for date: ${date}`);
        const entry = await db
            .selectFrom('shmiras_halashon_entries')
            .selectAll()
            .where('date_recorded', '=', date)
            .executeTakeFirst();
        if (entry) {
            console.log(`Found entry for ${date}`);
            res.json(entry);
        }
        else {
            console.log(`No entry found for ${date}`);
            res.status(404).json({ error: 'No entry found for this date' });
        }
    }
    catch (error) {
        console.error('Error fetching Shmiras HaLashon entry by date:', error);
        res.status(500).json({ error: 'Failed to fetch Shmiras HaLashon entry' });
    }
});
// Get progress statistics
router.get('/stats', async (req, res) => {
    try {
        console.log('Calculating Shmiras HaLashon statistics...');
        const totalEntries = await db
            .selectFrom('shmiras_halashon_entries')
            .select(({ fn }) => [
            fn.count('id').as('total_days'),
            fn.avg('overall_rating').as('average_rating'),
            fn.sum('positive_speech_count').as('total_positive_speech'),
            fn.sum('avoided_lashon_hara').as('total_avoided_lashon_hara'),
            fn.sum('gave_compliments').as('total_compliments'),
            fn.sum('spoke_words_of_torah').as('total_torah_words'),
            fn.sum('helped_through_speech').as('total_helped_through_speech')
        ])
            .executeTakeFirst();
        // Get recent trend (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentEntries = await db
            .selectFrom('shmiras_halashon_entries')
            .selectAll()
            .where('date_recorded', '>=', sevenDaysAgo.toISOString().split('T')[0])
            .orderBy('date_recorded', 'desc')
            .execute();
        // Calculate streak
        const allEntries = await db
            .selectFrom('shmiras_halashon_entries')
            .select(['date_recorded'])
            .orderBy('date_recorded', 'desc')
            .execute();
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < allEntries.length; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateString = checkDate.toISOString().split('T')[0];
            if (allEntries.find(entry => entry.date_recorded === dateString)) {
                currentStreak++;
            }
            else {
                break;
            }
        }
        const stats = {
            total_days_tracked: totalEntries?.total_days || 0,
            average_rating: totalEntries?.average_rating ? Math.round((Number(totalEntries.average_rating) + Number.EPSILON) * 100) / 100 : 0,
            total_positive_speech: totalEntries?.total_positive_speech || 0,
            total_avoided_lashon_hara: totalEntries?.total_avoided_lashon_hara || 0,
            total_compliments: totalEntries?.total_compliments || 0,
            total_torah_words: totalEntries?.total_torah_words || 0,
            total_helped_through_speech: totalEntries?.total_helped_through_speech || 0,
            current_streak: currentStreak,
            recent_entries: recentEntries.length
        };
        console.log('Calculated statistics:', stats);
        res.json(stats);
    }
    catch (error) {
        console.error('Error calculating Shmiras HaLashon statistics:', error);
        res.status(500).json({ error: 'Failed to calculate statistics' });
    }
});
// Create new Shmiras HaLashon entry
router.post('/', async (req, res) => {
    try {
        const { date_recorded, positive_speech_count = 0, avoided_lashon_hara = 0, gave_compliments = 0, spoke_words_of_torah = 0, helped_through_speech = 0, reflection_notes, daily_goal, challenges_faced, improvements_noticed, overall_rating } = req.body;
        if (!date_recorded || !overall_rating) {
            res.status(400).json({ error: 'Date and overall rating are required' });
            return;
        }
        if (overall_rating < 1 || overall_rating > 5) {
            res.status(400).json({ error: 'Overall rating must be between 1 and 5' });
            return;
        }
        console.log('Creating new Shmiras HaLashon entry:', { date_recorded, overall_rating });
        // Check if entry already exists for this date
        const existingEntry = await db
            .selectFrom('shmiras_halashon_entries')
            .select(['id'])
            .where('date_recorded', '=', date_recorded)
            .executeTakeFirst();
        if (existingEntry) {
            res.status(409).json({ error: 'Entry already exists for this date' });
            return;
        }
        const result = await db
            .insertInto('shmiras_halashon_entries')
            .values({
            date_recorded,
            positive_speech_count,
            avoided_lashon_hara,
            gave_compliments,
            spoke_words_of_torah,
            helped_through_speech,
            reflection_notes: reflection_notes || null,
            daily_goal: daily_goal || null,
            challenges_faced: challenges_faced || null,
            improvements_noticed: improvements_noticed || null,
            overall_rating,
            created_at: new Date().toISOString()
        })
            .returning('id')
            .executeTakeFirstOrThrow();
        console.log('Created Shmiras HaLashon entry with ID:', result.id);
        res.status(201).json({ id: result.id, message: 'Shmiras HaLashon entry created successfully' });
    }
    catch (error) {
        console.error('Error creating Shmiras HaLashon entry:', error);
        res.status(500).json({ error: 'Failed to create Shmiras HaLashon entry' });
    }
});
// Update Shmiras HaLashon entry
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { positive_speech_count, avoided_lashon_hara, gave_compliments, spoke_words_of_torah, helped_through_speech, reflection_notes, daily_goal, challenges_faced, improvements_noticed, overall_rating } = req.body;
        console.log('Updating Shmiras HaLashon entry:', id);
        const updateData = {};
        if (positive_speech_count !== undefined)
            updateData.positive_speech_count = positive_speech_count;
        if (avoided_lashon_hara !== undefined)
            updateData.avoided_lashon_hara = avoided_lashon_hara;
        if (gave_compliments !== undefined)
            updateData.gave_compliments = gave_compliments;
        if (spoke_words_of_torah !== undefined)
            updateData.spoke_words_of_torah = spoke_words_of_torah;
        if (helped_through_speech !== undefined)
            updateData.helped_through_speech = helped_through_speech;
        if (reflection_notes !== undefined)
            updateData.reflection_notes = reflection_notes || null;
        if (daily_goal !== undefined)
            updateData.daily_goal = daily_goal || null;
        if (challenges_faced !== undefined)
            updateData.challenges_faced = challenges_faced || null;
        if (improvements_noticed !== undefined)
            updateData.improvements_noticed = improvements_noticed || null;
        if (overall_rating !== undefined) {
            if (overall_rating < 1 || overall_rating > 5) {
                res.status(400).json({ error: 'Overall rating must be between 1 and 5' });
                return;
            }
            updateData.overall_rating = overall_rating;
        }
        await db
            .updateTable('shmiras_halashon_entries')
            .set(updateData)
            .where('id', '=', parseInt(id))
            .execute();
        console.log('Updated Shmiras HaLashon entry:', id);
        res.json({ message: 'Shmiras HaLashon entry updated successfully' });
    }
    catch (error) {
        console.error('Error updating Shmiras HaLashon entry:', error);
        res.status(500).json({ error: 'Failed to update Shmiras HaLashon entry' });
    }
});
// Delete Shmiras HaLashon entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting Shmiras HaLashon entry:', id);
        await db
            .deleteFrom('shmiras_halashon_entries')
            .where('id', '=', parseInt(id))
            .execute();
        console.log('Deleted Shmiras HaLashon entry:', id);
        res.json({ message: 'Shmiras HaLashon entry deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting Shmiras HaLashon entry:', error);
        res.status(500).json({ error: 'Failed to delete Shmiras HaLashon entry' });
    }
});
export default router;
