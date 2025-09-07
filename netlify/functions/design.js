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
        const { requirements } = JSON.parse(event.body);

        if (!requirements || !requirements.trim()) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ success: false, error: 'Requirements are required' })
            };
        }

        // Generate High Level Design using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an expert system architect and technical lead. Analyze the given requirements document and generate a comprehensive high level design that includes:

1. **System Architecture Overview** - Overall system structure, layers, and architectural patterns
2. **Major Component Identification** - Key components, modules, and their responsibilities
3. **Technology Stack Decisions** - Recommended technologies, frameworks, and tools with justifications
4. **System-wide Design Patterns** - Architectural patterns, design principles, and best practices
5. **Integration Approaches** - How components communicate, APIs, messaging, and data flow
6. **Database Architecture** - Data models, storage solutions, and data management strategies

Format your response in clean HTML with proper headings, sections, bullet points, and professional styling. Make it comprehensive, technically sound, and suitable for development teams and technical stakeholders. Include specific recommendations and technical rationale for all decisions.`
                },
                {
                    role: "user",
                    content: `Based on these requirements, generate a comprehensive high level system design:

${requirements}

Please provide detailed technical analysis covering:
- Complete system architecture with component relationships
- Specific technology recommendations with reasoning
- Database design and data architecture decisions  
- Integration patterns and communication protocols
- Security considerations and non-functional requirements
- Scalability and performance design decisions`
                }
            ],
            max_tokens: 4000,
            temperature: 0.7
        });

        const design = completion.choices[0].message.content;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, design })
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