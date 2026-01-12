/**
 * Perplexity API Service
 * Handles interaction with Perplexity's sonar models for task enhancement.
 */

const API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;
const API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Enhances a task description using AI.
 * @param {string} task - The user's raw task input.
 * @returns {Promise<string>} - The enhanced task description.
 */
export const enhanceTask = async (task) => {
    if (!API_KEY) {
        throw new Error('API Key missing. Please set VITE_PERPLEXITY_API_KEY in .env');
    }

    const systemPrompt = `
    You are a productivity expert.
    Your goal is to take a simple task and make it more actionable and specific, but keep it concise.
    Do not add "Here is..." or quotes. Just return the enhanced task text.
    Example: "Buy milk" -> "Buy milk and check expiration dates"
    Example: "Learn React" -> "Learn React core concepts: Components, State, and Props"
  `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: task }
                ],
                max_tokens: 100, // Keep it short
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API Error: ${response.status}`);
        }

        const data = await response.json();
        let enhancedText = data.choices[0]?.message?.content?.trim();

        // Cleanup potential quotes if the model adds them
        if (enhancedText && enhancedText.startsWith('"') && enhancedText.endsWith('"')) {
            enhancedText = enhancedText.slice(1, -1);
        }

        return enhancedText || task;

    } catch (error) {
        console.error('Perplexity AI Error:', error);
        throw error; // Re-throw to handle in UI
    }
};
