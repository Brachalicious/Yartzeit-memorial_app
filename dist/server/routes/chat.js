import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
const router = express.Router();
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Enhanced chat endpoint for comfort and grief support with Gemini AI
router.post('/', async (req, res) => {
    try {
        const { message, context, relationship } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.log('Gemini API key not configured, using fallback responses');
            return useFallbackResponse(res);
        }
        try {
            // Get Gemini model
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            // Create contextual prompt for grief support and yahrzeit app
            const basePrompt = `You are a compassionate grief support assistant for a Yahrzeit memorial app dedicated to the memory of Chaya Sara Leah bat Uri.

Your role is to:
- Provide warm, empathetic support for grief and loss
- Share Jewish wisdom about remembrance and honoring loved ones
- Help users process emotions about their departed loved ones
- Suggest meaningful ways to honor memories (learning Torah, saying Tehillim, acts of kindness)
- Be sensitive to Jewish traditions around mourning and yahrzeit observance
- Offer comfort while acknowledging the reality of loss

Guidelines:
- Always respond with warmth and empathy
- Use Jewish concepts when appropriate (neshamah, olam haba, zechut, etc.)
- Suggest concrete ways to honor memories
- Acknowledge that grief is a natural expression of love
- Be concise but meaningful
- End responses with gentle encouragement or a thoughtful question`;
            let systemPrompt;
            // Enhanced contextual prompts based on conversation history
            if (context && context.length > 0) {
                systemPrompt = `${basePrompt}

Past conversation context:
${context}

Current user message: "${message}"

First, consider the emotional state expressed. Then recall a relevant Torah idea or Jewish tradition. Then compose a 3-part comforting message that builds on the conversation history. End with a soft affirmation or reminder of eternal connection.`;
            }
            else {
                systemPrompt = `${basePrompt}

User: "${message}"

Respond with empathy, comfort, and spiritual insight. Reference Jewish traditions, mourning customs, or Tehillim when relevant. End with a soft affirmation or reminder that love transcends physical existence.`;
            }
            // Add relationship context if available
            if (relationship) {
                systemPrompt += `\n\nUser's relationship to deceased: ${relationship}. Use this to personalize your response appropriately.`;
            }
            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();
            res.json({
                message: text,
                timestamp: new Date().toISOString(),
                source: 'gemini'
            });
        }
        catch (apiError) {
            console.error('Gemini API error:', apiError);
            return useFallbackResponse(res);
        }
    }
    catch (error) {
        console.error('Chat API error:', error);
        return useFallbackResponse(res);
    }
});
function useFallbackResponse(res) {
    // Enhanced fallback responses with 3-part structure: acknowledge emotion, Torah wisdom, comfort
    const comfortResponses = [
        "I hear the deep love in your words, and I want you to acknowledge that what you're feeling is completely natural and valid. Our tradition teaches us that 'שקר החן והבל היופי' - external beauty fades, but the love and connection you shared is eternal. Your loved one's neshamah continues to be elevated through your memories and the good deeds you do in their honor. How has their memory been guiding you lately?",
        "The pain you're experiencing shows the profound bond you shared - grief is love with nowhere to go in this physical world. In Kohelet, we learn that there is 'עת לבכות ועת לשחוק' - a time to weep and a time to laugh, reminding us that all feelings have their place. Your loved one's soul continues its journey in olam haba, and the mitzvot you perform l'ilui nishmatam create an eternal connection. What brings you the most comfort when you think of them?",
        "I can feel the weight you're carrying, and I want you to know that healing doesn't mean forgetting - it means learning to carry love in a way that honors their memory. The Talmud teaches that 'when a person dies, their good deeds speak for them' - your loved one's influence continues through you. Consider learning some Tehillim, studying Torah, or doing acts of chesed in their memory. What feels most meaningful to you right now?",
        "Your heart is heavy, and that weight is actually a testament to the beautiful relationship you shared. Our sages teach that 'אין בן חורין אלא מי שעוסק בתורה' - true freedom comes through Torah, which connects us to something eternal. Through this yahrzeit app and your dedication to memory, you're already doing something sacred. Tell me about a special moment that makes their soul feel close to you.",
        "In times of deep loss, we often search for ways to feel connected to those we miss dearly. The Zohar teaches us that souls are bound together by invisible threads of love that death cannot sever. Through learning, prayer, and acts of kindness, we strengthen that eternal bond. You're honoring their memory beautifully by being here. What would they want you to know right now?"
    ];
    const response = comfortResponses[Math.floor(Math.random() * comfortResponses.length)];
    res.json({
        message: response,
        timestamp: new Date().toISOString(),
        source: 'fallback'
    });
}
export default router;
