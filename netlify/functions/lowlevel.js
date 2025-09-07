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
                    content: `You are an expert software architect and technical lead specializing in detailed system design. Analyze the given specifications and generate comprehensive low-level technical diagrams that include:

1. **Class/Component Diagrams** - Detailed structure of each module with attributes, methods, and relationships
2. **Sequence Diagrams** - Step-by-step interaction flows between objects/components
3. **Database Schema** - Detailed table structures, relationships, constraints, and indexes
4. **API Specifications** - Complete method signatures, parameters, return types, and HTTP endpoints
5. **Algorithms** - Pseudocode and flowcharts for complex processing logic
6. **Error Handling** - Specific exceptions, error codes, and recovery mechanisms

Format your response in clean HTML with proper headings, sections, code blocks, diagrams, and professional styling. Include UML-style diagrams using text representations, detailed code specifications, and comprehensive technical documentation. Make it suitable for developers and technical architects who need to implement the system.`
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