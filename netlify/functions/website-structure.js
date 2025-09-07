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

        const { concept } = requestBody;

        if (!concept) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Website concept is required' })
            };
        }

        // Generate Website Structure using OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are an expert web developer and project architect specializing in website structure and organization. Analyze the given website concept and generate a comprehensive project structure that includes:

1. **Complete File Structure** - Organized folder hierarchy with all necessary files and directories
2. **HTML Pages** - All required pages with proper naming conventions
3. **CSS Organization** - Stylesheet structure and organization approach
4. **JavaScript Architecture** - Script organization and modular structure
5. **Asset Management** - Images, fonts, and media organization
6. **Configuration Files** - Build tools, package management, and deployment configs
7. **Documentation Structure** - README, documentation, and project guides

Format your response in clean HTML with proper headings, code blocks for file structures, and professional styling. Include detailed explanations of the organizational approach, naming conventions, and best practices. Make it comprehensive and ready for immediate implementation by web developers.`
                },
                {
                    role: 'user',
                    content: `Based on this website concept, generate a complete project structure and file organization:

${concept}

Please provide detailed structure covering:
- Complete folder hierarchy and file organization
- All HTML pages and components needed
- CSS and JavaScript organization strategy
- Asset and media file management
- Build and deployment configuration
- Documentation and project setup guides`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const structure = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, structure })
        };

    } catch (error) {
        console.error('Website Structure Generation Error:', error);
        
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
                error: error.message || 'Failed to generate website structure' 
            })
        };
    }
};