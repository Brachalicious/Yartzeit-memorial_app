import express from 'express';
import { db } from '../database/connection.js';

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
  } catch (error) {
    console.error('Error fetching Tehillim chapters:', error);
    res.status(500).json({ error: 'Failed to fetch Tehillim chapters' });
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
  } catch (error) {
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
    
    const result = await db
      .insertInto('tehillim_chapters')
      .values({
        chapter_number,
        chapter_name: chapter_name || null,
        date_completed,
        notes: notes || null,
        created_at: new Date().toISOString()
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    
    console.log('Created Tehillim chapter entry with ID:', result.id);
    res.status(201).json({ id: result.id, message: 'Tehillim chapter saved successfully' });
  } catch (error) {
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error fetching Tehillim progress:', error);
    res.status(500).json({ error: 'Failed to fetch Tehillim progress' });
  }
});

export default router;
