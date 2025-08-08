import express from 'express';
import { generateChofetzChaimResponse, generateDailyEncouragement } from '../services/chofetzChaimBot.js';
const router = express.Router();
// Route for Chofetz Chaim chatbot
router.post('/chofetz-chaim/chat', async (req, res) => {
    try {
        console.log('📞 Chofetz Chaim chat request received:', req.body);
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            console.log('❌ Invalid message format');
            return res.status(400).json({
                error: 'Message is required and must be a string'
            });
        }
        console.log('🤖 Calling Chofetz Chaim bot with message:', message.trim());
        const response = await generateChofetzChaimResponse(message.trim());
        console.log('✅ Chofetz Chaim response generated, length:', response.length);
        res.json({
            response,
            timestamp: new Date().toISOString(),
            type: 'chofetz-chaim-guidance'
        });
    }
    catch (error) {
        console.error('❌ Error in Chofetz Chaim chat:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            fallback: `My dear friend, I'm having difficulty responding right now, but remember - every word we guard is precious. Let your speech today be a source of blessing in memory of Chaya Sara Leah Bas Uri zt"l.`
        });
    }
});
// Route for daily encouragement
router.get('/chofetz-chaim/daily-encouragement', async (req, res) => {
    try {
        const encouragement = await generateDailyEncouragement();
        res.json({
            encouragement,
            timestamp: new Date().toISOString(),
            type: 'daily-shmiras-halashon-encouragement'
        });
    }
    catch (error) {
        console.error('Error generating daily encouragement:', error);
        res.status(500).json({
            error: 'Failed to generate encouragement',
            fallback: `Good morning! Today is a beautiful opportunity to practice Shmiras HaLashon. May your words bring only blessing and light to the world, in memory of Chaya Sara Leah Bas Uri zt"l.`
        });
    }
});
export default router;
