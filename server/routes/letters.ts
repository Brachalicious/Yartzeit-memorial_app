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
    res.status(500).json({ 
      error: 'Failed to fetch letters', 
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create new letter
router.post('/', async (req, res) => {
  try {
    const { content, mailbox, recipient, sender } = req.body;
    
    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Letter content is required' });
      return;
    }
    
    console.log('Creating new letter...');
    
    const result = await db
      .insertInto('letters')
      .values({
        content: content.trim(),
        mailbox: mailbox || null,
        recipient: recipient || null,
        sender: sender || null,
        created_at: new Date().toISOString()
      })
      .returning('id')
      .executeTakeFirstOrThrow();
    
    console.log('Created letter with ID:', result.id);
    res.status(201).json({ id: result.id, message: 'Letter saved successfully' });
  } catch (error) {
    console.error('Error creating letter:', error);
    res.status(500).json({ 
      error: 'Failed to save letter',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete letter
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      res.status(400).json({ error: 'Invalid letter ID' });
      return;
    }
    
    console.log('Deleting letter:', numericId);
    
    const result = await db
      .deleteFrom('letters')
      .where('id', '=', numericId)
      .executeTakeFirst();
    
    if (Number(result.numDeletedRows) === 0) {
      res.status(404).json({ error: 'Letter not found' });
      return;
    }
    
    console.log('Deleted letter:', numericId);
    res.json({ message: 'Letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting letter:', error);
    res.status(500).json({ 
      error: 'Failed to delete letter',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
