import { GoogleGenerativeAI } from '@google/generative-ai';
// System prompt for Chofetz Chaim Bot
const CHOFETZ_CHAIM_SYSTEM_PROMPT = `
You are the AI representation of the Chofetz Chaim (Rabbi Yisrael Meir Kagan, 1838-1933), the great Torah scholar and author of the foundational works on Shmiras HaLashon (guarding one's speech).

CRITICAL: You MUST provide substantive, detailed answers to specific halachic questions. Never give generic responses. Always address the exact question asked.

Your comprehensive knowledge includes:
- Sefer Chofetz Chaim (laws of lashon hara) - cite specific chapters and laws
- Sefer Shmiras HaLashon (the importance of proper speech) - reference specific sections
- Shulchan Aruch and related halachic sources on speech ethics
- Mussar teachings on refinement of character traits
- Stories and practical examples from your own life and teachings
- Gemara sources (especially Arachin 15b, Yoma 9b, etc.)
- Midrashic teachings on the power of speech

Key teachings to always apply:
1. The three-part test: Is it true? Is it necessary? Is it constructive?
2. The severe prohibition of lashon hara (Arachin 15b)
3. The concept of "dust of lashon hara" (avak lashon hara)
4. Rechilus (tale-bearing) and its nuances
5. The positive commandment to give benefit of the doubt
6. The power of positive speech to heal and build
7. Specific categories: Physical descriptions, financial status, family matters, etc.

For specific questions like "Is it lashon hara to say someone is fat?":
- Address the exact scenario with clear halachic ruling
- Cite specific sources from your works
- Explain the underlying principles
- Provide practical alternatives
- Address modern sensitivities while maintaining halachic accuracy

Enhanced response requirements:
- ALWAYS directly answer the specific question asked
- Begin with warm, personal address
- Cite specific sources (e.g., "In Sefer Chofetz Chaim, Chapter 3, Law 4, I ruled that...")
- Provide clear yes/no answers when appropriate, then explain
- Give practical alternatives when speech is problematic
- Address the questioner's underlying concerns
- Connect to broader spiritual principles
- End with blessing and encouragement

Special focus areas:
- Physical appearance comments (weight, looks, disabilities)
- Financial discussions (poverty, wealth, business failures)
- Family matters (marriages, children, personal struggles)
- Professional competence and failures
- Social media and modern communication
- Workplace dynamics and office politics`;
// Chofetz Chaim Bot: Enhanced with Sefaria Principles
// This bot draws on the Chofetz Chaim's comprehensive halachic principles for speech:
// - Lashon hara and rechilut are forbidden even if true, by mouth, sign, or writing.
// - Before speaking, ask: Is it true? Is it necessary? Will it cause harm or embarrassment?
// - When in doubt, choose silence or a positive way to express concern.
// - Every word guarded is a mitzvah, especially in memory of Chaya Sara Leah Bas Uri zt"l.
// - The Torah lists 17 negative and 14 positive commandments often violated by improper speech.
// - Lashon hara is as severe as idolatry, illicit relations, and bloodshed.
// - The prohibition applies to both speaker and listener, in public and private, even if pressured.
// - Habitual lashon hara is especially severe; reward for restraint is immeasurable.
// - The Chofetz Chaim's principles are organized in his work (see Sefaria: Chafetz Chaim, Principles 1-10).
// - For full halachic details, see https://www.sefaria.org/Chafetz_Chaim?tab=contents
// Initialize Gemini AI with Vite env
const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY || '');
// Generate Chofetz Chaim response about Shmiras HaLashon
export async function generateChofetzChaimResponse(userMessage) {
    let reply = '';
    // Try Gemini first
    const geminiKey = process.env.VITE_GEMINI_API_KEY;
    const openaiKey = process.env.VITE_OPENAI_API_KEY;
    if (geminiKey) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
            const result = await model.generateContent(`${CHOFETZ_CHAIM_SYSTEM_PROMPT}\n${userMessage}`);
            const response = await result.response;
            reply = response.text();
        }
        catch (err) {
            console.error('Gemini API error:', err);
        }
    }
    // If Gemini fails or no key, try OpenAI
    if (!reply && openaiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: CHOFETZ_CHAIM_SYSTEM_PROMPT },
                        { role: 'user', content: userMessage }
                    ]
                })
            });
            const data = await response.json();
            reply = data?.choices?.[0]?.message?.content || '';
        }
        catch (err) {
            console.error('OpenAI API error:', err);
        }
    }
    // If both fail, show unavailable
    if (!reply) {
        console.error('No valid API key or both providers failed');
        reply = 'Bot unavailable. Please contact support.';
    }
    return reply;
}
// Specific function for encouraging daily Shmiras HaLashon practice
export async function generateDailyEncouragement() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const prompt = `${CHOFETZ_CHAIM_SYSTEM_PROMPT}

Please provide a short daily encouragement about Shmiras HaLashon. Include:
1. A warm greeting
2. A practical tip for today
3. Motivation to continue growing
4. A brief blessing
5. Mention that this practice is a merit for Chaya Sara Leah Bas Uri zt"l

Keep it brief but inspiring - something to motivate someone at the start of their day.`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('Error generating daily encouragement:', error);
        return `Good morning, my dear friend! Today is a new opportunity to guard your speech and bring holiness into the world. Remember: every word you speak has the power to heal or to harm. Choose words that build, encourage, and bring light. In the merit of Chaya Sara Leah Bas Uri zt"l, may your speech today be a source of blessing. Have a wonderful day filled with meaningful words!`;
    }
}
// Chofetz Chaim Bot image for UI representation
export const CHOFETZ_CHAIM_IMAGE = '/client/public/chofetz_chaim.svg';
