const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        
        if (!prompt) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        console.log('🧠 Generating user stories via Netlify function...');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert product manager and UX designer. Generate comprehensive user stories with specific features and implementation approaches."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0.7
        });

        const response = completion.choices[0].message.content;
        console.log('✅ User stories generated successfully');

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: response })
        };
        
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Failed to generate user stories' })
        };
    }
};