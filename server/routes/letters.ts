import express from 'express';
import { db } from '../database/connection.js';

const router = express.Router();

// Get all letters
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all letters...');
    const letters = await db
      .selectFrom('letters')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
    
    console.log(`Found ${letters.length} letters`);
    res.json(letters);
  } catch (error) {
    console.error('Error fetching letters:', error);
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

// Create new letter
router.post('/', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Letter content is required' });
      return;
    }
    
    console.log('Creating new letter...');
    
    const result = await db
      .insertInto('letters')
      .values({
        content: content.trim(),
        created_at: new Date().toISOString()
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    
    console.log('Created letter with ID:', result.id);
    res.status(201).json({ id: result.id, message: 'Letter saved successfully' });
  } catch (error) {
    console.error('Error creating letter:', error);
    res.status(500).json({ error: 'Failed to save letter' });
  }
});

// Delete letter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Deleting letter:', id);
    
    await db
      .deleteFrom('letters')
      .where('id', '=', parseInt(id))
      .execute();
    
    console.log('Deleted letter:', id);
    res.json({ message: 'Letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ error: 'Failed to delete letter' });
  }
});

export default router;
