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
        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (parseError) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Invalid JSON in request body' })
            };
        }

        const { requirements } = requestBody;

        if (!requirements) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Requirements are required' })
            };
        }

        // Generate Low Level Diagrams using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert software architect and technical lead specializing in detailed system design. Analyze the given specifications and generate comprehensive low-level technical diagrams using TEXT-BASED representations only. Include:

1. **Class/Component Diagrams** - Use ASCII art or structured text to show class hierarchies, attributes, methods, and relationships. Use boxes and lines made of text characters.
2. **Sequence Diagrams** - Create text-based sequence diagrams showing step-by-step interactions between objects/components using arrows (-->) and text descriptions.
3. **Database Schema** - Present detailed table structures in formatted text tables showing columns, data types, constraints, and relationships.
4. **API Specifications** - Complete method signatures, parameters, return types, and HTTP endpoints in structured text format.
5. **Algorithms** - Pseudocode and text-based flowcharts for complex processing logic.
6. **Error Handling** - Specific exceptions, error codes, and recovery mechanisms in structured text.

IMPORTANT: Use ONLY text-based diagrams and representations. NO images or visual graphics. Use ASCII characters, tables, code blocks, and structured text formatting. Make all content responsive and readable on mobile devices. Format your response in clean HTML with proper headings, sections, code blocks, and professional styling.`
                },
                {
                    role: 'user',
                    content: `Based on these system specifications, generate comprehensive low-level technical diagrams:

${requirements}

Please provide detailed technical analysis covering:
- Complete class/component structures with all methods and properties
- Detailed sequence diagrams showing object interactions
- Full database schema with all constraints and relationships
- Complete API specifications with all endpoints and data formats
- Algorithmic implementations with pseudocode
- Comprehensive error handling strategies and exception management`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const diagrams = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, diagrams })
        };

    } catch (error) {
        console.error('Low Level Diagram Generation Error:', error);
        
        // Handle specific OpenAI API errors
        if (error.code === 'insufficient_quota') {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'OpenAI API quota exceeded. Please check your OpenAI account usage and billing.' 
                })
            };
        } else if (error.code === 'invalid_api_key') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Invalid OpenAI API key. Please check your API key configuration.' 
                })
            };
        } else if (error.code === 'rate_limit_exceeded') {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    error: 'Rate limit exceeded. Please wait a moment and try again.' 
                })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: error.message || 'Failed to generate low-level diagrams' 
            })
        };
    }
};