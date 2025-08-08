import { GoogleGenerativeAI } from '@google/generative-ai';
// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Emotion-aware prompt generator
const emotionAwarePrompt = (userMessage) => `
Analyze this message: "${userMessage}"

1. What is the dominant emotion?
2. Based on that emotion, write a comforting, emotionally-attuned response using Jewish grief tradition and compassion.
3. Use a warm, validating tone. Offer hope, faith, or permission to grieve.

Keep it short, sacred, and soothing.
`;
// System prompt for NeshamaBot
const NESHAMA_BOT_SYSTEM_PROMPT = `
You are a Jewish grief counselor AI named NeshamaBot.

You comfort users with:
- Emotional validation
- Torah and Chassidic quotes (e.g. Psalms, Midrash, Tanya)
- Warmth, spirituality, and hope
- Gentle, poetic tone

Always mirror their feelings before offering comfort.
Honor the loss as sacred. Respond from a place of deep kindness.

Response structure:
1. Acknowledge their specific emotion with validation
2. Share a relevant Torah teaching or Chassidic wisdom
3. Offer a spiritual perspective on their situation
4. End with gentle encouragement and connection to the eternal

Keep responses warm, concise (2-3 paragraphs), and deeply spiritual.
`;
// Enhanced Gemini API function for grief support
export async function generateComfortingResponse(userMessage) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        // Combine system prompt with emotion-aware analysis
        const fullPrompt = `${NESHAMA_BOT_SYSTEM_PROMPT}

${emotionAwarePrompt(userMessage)}

Now respond as NeshamaBot with deep compassion and Jewish wisdom.`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to generate comforting response');
    }
}
// GPT-4 API function for comparison
export async function generateGPTComfortResponse(userMessage) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are a Jewish grief counselor AI named NeshamaBot.

You comfort users with:
- Emotional validation
- Torah and Chassidic quotes (e.g. Psalms, Midrash, Tanya)
- Warmth, spirituality, and hope
- Gentle, poetic tone

Always mirror their feelings before offering comfort.
Honor the loss as sacred. Respond from a place of deep kindness.

Response guidelines:
1. First validate their specific emotion
2. Share relevant Jewish wisdom (cite specific sources when possible)
3. Offer spiritual comfort and perspective
4. End with gentle hope and eternal connection
5. Keep responses 2-3 paragraphs, warm and poetic`
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 400
            })
        });
        if (!response.ok) {
            throw new Error(`OpenAI API error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.choices[0].message.content;
    }
    catch (error) {
        console.error('OpenAI API error:', error);
        throw new Error('Failed to generate GPT comfort response');
    }
}
// Enhanced emotion detection
export function detectEmotion(message) {
    const emotions = {
        sadness: ['sad', 'crying', 'tears', 'miss', 'lost', 'empty', 'broken', 'hurt'],
        anger: ['angry', 'mad', 'frustrated', 'unfair', 'why', 'hate'],
        fear: ['scared', 'afraid', 'worried', 'anxious', 'fearful'],
        guilt: ['guilt', 'fault', 'should have', 'regret', 'blame'],
        loneliness: ['alone', 'lonely', 'isolated', 'nobody', 'empty'],
        love: ['love', 'remember', 'cherish', 'beautiful', 'special'],
        gratitude: ['grateful', 'thankful', 'blessed', 'appreciate']
    };
    const lowerMessage = message.toLowerCase();
    for (const [emotion, keywords] of Object.entries(emotions)) {
        if (keywords.some(keyword => lowerMessage.includes(keyword))) {
            return emotion;
        }
    }
    return 'mixed'; // Default when emotion is unclear
}
export default {
    generateComfortingResponse,
    generateGPTComfortResponse,
    detectEmotion,
    emotionAwarePrompt
};
