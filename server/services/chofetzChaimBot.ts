import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Chofetz Chaim Bot System Prompt - Enhanced with specific sources
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

// Generate Chofetz Chaim response about Shmiras HaLashon
export async function generateChofetzChaimResponse(userMessage: string): Promise<string> {
  try {
    console.log('🤖 Generating Chofetz Chaim response for:', userMessage);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const fullPrompt = `${CHOFETZ_CHAIM_SYSTEM_PROMPT}

User's specific question: "${userMessage}"

CRITICAL INSTRUCTIONS:
1. DIRECTLY answer the specific question asked - do not give generic responses
2. If asking about a specific type of speech (like calling someone fat), give a clear halachic ruling
3. Cite exact sources from Sefer Chofetz Chaim when relevant
4. Provide practical guidance for the exact situation
5. Address any underlying concerns or contexts

Your response must include:
- Direct answer to the question (yes/no if applicable)
- Specific halachic source citation
- Explanation of the underlying principle
- Practical alternatives or solutions
- Connection to broader spiritual growth
- Warm encouragement and blessing

Example format for appearance-related questions:
"My dear friend, regarding your question about commenting on someone's weight - this is indeed a serious matter in halachah. In my work Sefer Chofetz Chaim, Chapter 3, I discuss how speaking about someone's physical appearance, even if factually true, can constitute lashon hara if it causes them embarrassment or could harm their reputation or shidduch prospects. [Continue with detailed guidance...]"

Remember: Be specific, scholarly, warm, and practically helpful. Address the exact question with Torah wisdom.`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('✅ Chofetz Chaim response generated successfully');
    return responseText;
    
  } catch (error) {
    console.error('Gemini API error for Chofetz Chaim bot:', error);
    
    // Enhanced fallback responses that address common questions
    const specificFallbacks: Record<string, string> = {
      'fat': `My dear friend, regarding commenting on someone's weight - this touches on a very sensitive area of halachah. In Sefer Chofetz Chaim, Chapter 3, I explain that speaking about someone's physical appearance, even if true, is generally prohibited lashon hara if it could embarrass them or affect their reputation. Weight discussions can deeply hurt a person and affect their shidduch prospects or social standing. Instead, if you're concerned about someone's health, speak privately with love and offer practical help. May your words be a source of healing rather than pain, in the merit of Chaya Sara Leah Bas Uri zt"l.`,
      
      'poor': `Precious soul, discussing someone's financial struggles is a very serious matter. In my work, I explain that revealing someone's poverty, even if factually true, constitutes lashon hara as it can damage their reputation and cause them embarrassment. Instead of speaking about their situation, find ways to help quietly and encourage others to do chesed without publicizing their need. Your discretion protects their dignity while your actions provide real assistance.`,
      
      'stupid': `My beloved child, calling someone intellectually limited is absolutely forbidden lashon hara. In Sefer Chofetz Chaim, I teach that damaging someone's reputation regarding their abilities can ruin their livelihood and social standing. Every person has unique strengths and challenges. Instead of focusing on perceived weaknesses, look for their special qualities and help them succeed in their own way.`,
      
      'ugly': `Dear friend, commenting on someone's physical appearance in a negative way is a grave violation of Shmiras HaLashon. In my teachings, I emphasize that every person is created b'tzelem Elohim (in G-d's image), and to insult their appearance is to insult the Divine image within them. Focus instead on the beauty of their soul and their good deeds. May your words always build up rather than tear down.`,
      
      'gossip': `My dear student, sharing information about others, even if true, often constitutes lashon hara or rechilus (tale-bearing). Before speaking about someone, ask yourself: Will this information help the listener in a constructive way? Am I the right person to share this? Is there a positive purpose? If not, guard your tongue. Remember, the Gemara teaches that lashon hara kills three people: the speaker, the listener, and the one being spoken about.`,
      
      'boss': `Precious soul, speaking negatively about your employer requires great caution. If the criticism could damage their business reputation or standing, it may constitute lashon hara. However, if you need to warn someone about unethical practices or protect them from harm, this may be permitted under specific conditions. Speak privately, only to those who need to know, and ensure your motivation is purely to help others, not to vent frustration.`
    };
    
    // Check if the question contains specific keywords and provide targeted responses
    const lowerMessage = userMessage.toLowerCase();
    for (const [keyword, response] of Object.entries(specificFallbacks)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }
    
    // General fallback if no specific match
    return `My dear friend, I apologize that I cannot provide the detailed guidance you deserve at this moment. However, remember that in any question of speech, we must ask: Is it true? Is it necessary? Will it cause harm or embarrassment? When in doubt, choose silence or find a positive way to express your concern. Every word we guard is a mitzvah, and in memory of Chaya Sara Leah Bas Uri zt"l, let us be especially careful with our speech. May Hashem grant you wisdom to know when to speak and when to remain silent.`;
  }
}

// Specific function for encouraging daily Shmiras HaLashon practice
export async function generateDailyEncouragement(): Promise<string> {
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
    
  } catch (error) {
    console.error('Error generating daily encouragement:', error);
    return `Good morning, my dear friend! Today is a new opportunity to guard your speech and bring holiness into the world. Remember: every word you speak has the power to heal or to harm. Choose words that build, encourage, and bring light. In the merit of Chaya Sara Leah Bas Uri zt"l, may your speech today be a source of blessing. Have a wonderful day filled with meaningful words!`;
  }
}
