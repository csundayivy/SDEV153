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

        // Generate Entity-Relationship Diagram using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert database architect and data modeler. Analyze the given data requirements and generate a comprehensive Entity-Relationship Diagram (ERD) that includes:

1. **Database Tables** - All entities with their attributes and data types
2. **Primary Keys** - Unique identifiers for each entity
3. **Foreign Keys** - Relationships between entities
4. **Relationships** - One-to-one, one-to-many, many-to-many relationships
5. **Cardinality** - Specific relationship constraints and multiplicity
6. **Indexes** - Performance optimization recommendations
7. **Constraints** - Data validation rules and business logic

Format your response in clean HTML with proper headings, sections, bullet points, and professional styling. Include detailed table structures, relationship descriptions, and SQL-like schema definitions. Make it comprehensive, technically accurate, and suitable for database developers and system architects.`
                },
                {
                    role: 'user',
                    content: `Based on these data requirements, generate a comprehensive Entity-Relationship Diagram:

${requirements}

Please provide detailed database design covering:
- Complete table structures with all attributes and data types
- Primary and foreign key definitions
- Detailed relationship mappings with cardinality
- Junction tables for many-to-many relationships
- Database constraints and validation rules
- Performance considerations and indexing recommendations`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const erd = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, erd })
        };

    } catch (error) {
        console.error('ERD Generation Error:', error);
        
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
                error: error.message || 'Failed to generate Entity-Relationship Diagram' 
            })
        };
    }
};