import express from 'express';
import { db } from '../database/connection.js';
const router = express.Router();
// Get all learning activities
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all learning activities...');
        const activities = await db
            .selectFrom('learning_activities')
            .selectAll()
            .orderBy('date_completed', 'desc')
            .execute();
        console.log(`Found ${activities.length} learning activities`);
        res.json(activities);
    }
    catch (error) {
        console.error('Error fetching learning activities:', error);
        res.status(500).json({ error: 'Failed to fetch learning activities' });
    }
});
// Get learning activities by type
router.get('/type/:type', async (req, res) => {
    try {
        const { type } = req.params;
        if (type !== 'tehillim' && type !== 'torah') {
            res.status(400).json({ error: 'Invalid activity type' });
            return;
        }
        console.log(`Fetching ${type} activities...`);
        const activities = await db
            .selectFrom('learning_activities')
            .selectAll()
            .where('activity_type', '=', type)
            .orderBy('date_completed', 'desc')
            .execute();
        console.log(`Found ${activities.length} ${type} activities`);
        res.json(activities);
    }
    catch (error) {
        console.error('Error fetching learning activities by type:', error);
        res.status(500).json({ error: 'Failed to fetch learning activities' });
    }
});
// Create new learning activity
router.post('/', async (req, res) => {
    try {
        const { activity_type, title, description, date_completed, notes } = req.body;
        if (!activity_type || !title || !date_completed) {
            res.status(400).json({ error: 'Activity type, title, and date are required' });
            return;
        }
        if (activity_type !== 'tehillim' && activity_type !== 'torah') {
            res.status(400).json({ error: 'Invalid activity type' });
            return;
        }
        console.log('Creating new learning activity:', { activity_type, title, date_completed });
        const result = await db
            .insertInto('learning_activities')
            .values({
            activity_type,
            title,
            description: description || null,
            date_completed,
            notes: notes || null,
            created_at: new Date().toISOString()
        })
            .returning('id')
            .executeTakeFirstOrThrow();
        console.log('Created learning activity with ID:', result.id);
        res.status(201).json({ id: result.id, message: 'Learning activity saved successfully' });
    }
    catch (error) {
        console.error('Error creating learning activity:', error);
        res.status(500).json({ error: 'Failed to save learning activity' });
    }
});
// Delete learning activity
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Deleting learning activity:', id);
        await db
            .deleteFrom('learning_activities')
            .where('id', '=', parseInt(id))
            .execute();
        console.log('Deleted learning activity:', id);
        res.json({ message: 'Learning activity deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting learning activity:', error);
        res.status(500).json({ error: 'Failed to delete learning activity' });
    }
});
export default router;
