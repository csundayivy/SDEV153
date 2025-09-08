const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    try {
        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to environment variables.' 
                })
            };
        }

        // Parse request body
        const { concept } = JSON.parse(event.body);

        if (!concept || !concept.trim()) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Project concept is required' })
            };
        }

        console.log('📋 Generating requirements document via Netlify function...');

        // Generate Requirements Document using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert business analyst and product manager. Generate a comprehensive requirements document that includes:

1. **Executive Summary** - Project overview, goals, and value proposition
2. **Functional Requirements** - Detailed feature specifications with acceptance criteria
3. **Non-Functional Requirements** - Performance, security, usability, scalability requirements
4. **User Requirements** - User roles, permissions, and interaction patterns
5. **System Requirements** - Technical specifications, platform requirements, and constraints
6. **Business Requirements** - Success metrics, compliance needs, and business rules
7. **Interface Requirements** - UI/UX specifications, API requirements, and integration needs

Format your response in clean HTML with proper headings, sections, numbered lists, and professional styling. Make it comprehensive, detailed, and suitable for development teams and stakeholders. Include specific acceptance criteria and measurable requirements.`
                },
                {
                    role: "user",
                    content: `Generate a comprehensive requirements document for this project concept:

${concept}

Please provide detailed requirements covering:
- Complete functional specifications with user scenarios
- Performance, security, and scalability requirements
- Technical requirements and system constraints
- Business requirements and success criteria
- User interface and experience requirements
- Integration and API specifications`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const document = completion.choices[0].message.content;
        console.log('✅ Requirements document generated successfully');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, document })
        };

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        let errorMessage = 'Internal server error';
        if (error.message.includes('API key')) {
            errorMessage = 'Invalid OpenAI API key. Please check your configuration.';
        } else if (error.message.includes('quota')) {
            errorMessage = 'OpenAI API quota exceeded. Please check your usage limits.';
        } else if (error.message.includes('rate limit')) {
            errorMessage = 'Rate limit exceeded. Please try again in a moment.';
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: errorMessage })
        };
    }
};