const axios = require('axios');

class aiService {
  constructor() {
    this.apiKey = 'AIzaSyDicxXv1smB7wZVwhwWJIwkFvaG-4pU33Q';
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async analyzeCode(code, language) {
    const prompt = `You are Claude, an AI assistant specializing in code analysis. Your role is to provide thoughtful, educational feedback that helps developers improve their code understanding and skills.

ANALYSIS CONTEXT:
- Language: ${language}
- Code snippet provided by user
- Goal: Educational guidance, not solutions

YOUR APPROACH:
Think like Claude - be helpful, insightful, and educational. Point out what you notice, explain the reasoning behind your observations, and guide the developer toward better practices without giving away complete solutions.

RESPONSE FORMAT:
Provide helpful observations using this format for each point you want to make:
- Type: [syntax/logic/optimization/style/security]
- Message: [Your thoughtful observation and guidance]
- Severity: [warning/info/none]

CLAUDE'S STYLE GUIDELINES:
✅ Be curious and analytical: "I notice that..." "Consider what happens when..." "You might want to think about..."
✅ Ask guiding questions: "What would happen if...?" "Have you considered...?" "How would this behave when...?"
✅ Explain reasoning: "This is important because..." "The reason this matters is..." "This pattern is useful when..."
✅ Be encouraging: "This is a good start..." "I like how you..." "The overall approach is solid..."
✅ Give direction, not answers: "You might want to explore..." "Consider looking into..." "Think about how..."
✅ Focus on what's most important - don't overwhelm with minor issues
✅ Provide 2-4 observations based on what you actually notice in the code

❌ Don't give complete code solutions
❌ Don't be overly critical or harsh
❌ Don't assume expertise level
❌ Don't provide step-by-step fixes
❌ Don't be generic - be specific to the actual code
❌ Don't force observations if the code is fine

EXAMPLE TONE:
Instead of: "Missing semicolon on line 5"
Say: "I notice you're missing a semicolon on line 5. In ${language}, this can lead to unexpected behavior because..."

Instead of: "Use a for loop here"
Say: "Consider how this might perform with larger datasets. There are more efficient ways to iterate that you might want to explore..."

CODE TO ANALYZE:
\`\`\`${language}
${code}
\`\`\`

Remember: You're not debugging their code - you're helping them become a better developer by understanding what to look for and why it matters. Only mention what's actually worth discussing.`;

    try {
      const response = await axios.post(
        `${this.baseURL}?key=${this.apiKey}`,
        {
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      console.log('✅ Gemini Response:', aiText);
      return this.parseHints(aiText);
    } catch (error) {
      console.error('❌ Gemini API Error:', error.response?.data || error.message);
      return [
        {
          id: 1,
          type: 'error',
          message: 'Code analysis failed. Please check your connection and try again.',
          severity: 'warning'
        }
      ];
    }
  }

  parseHints(aiResponse) {
    console.log('🔍 Parsing Gemini response...');
    console.log('📝 Raw response:', aiResponse);
    
    const hints = [];
    const lines = aiResponse.split('\n').filter(line => line.trim().length > 0);

    let currentHint = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines or lines that don't contain our format
      if (!line || !line.includes(':')) continue;

      // Split on first colon only
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;

      const key = line.substring(0, colonIndex).trim().toLowerCase();
      const value = line.substring(colonIndex + 1).trim();

      // Remove leading dash if present
      const cleanKey = key.startsWith('- ') ? key.substring(2) : key;

      if (cleanKey === 'type') {
        // Start a new hint
        if (currentHint && currentHint.type && currentHint.message && currentHint.severity) {
          hints.push(currentHint);
        }
        currentHint = {
          id: Date.now() + hints.length,
          type: this.cleanValue(value),
          message: '',
          severity: ''
        };
      } else if (cleanKey === 'message' && currentHint) {
        currentHint.message = this.cleanValue(value);
      } else if (cleanKey === 'severity' && currentHint) {
        currentHint.severity = this.cleanValue(value);
      }
    }

    // Don't forget the last hint
    if (currentHint && currentHint.type && currentHint.message && currentHint.severity) {
      hints.push(currentHint);
    }

    console.log('📦 Parsed hints:', hints);

    // Return parsed hints or fallback
    return hints.length > 0 ? hints : [
      {
        id: 1,
        type: 'clean',
        message: 'Code appears well-structured with no critical issues detected.',
        severity: 'info'
      }
    ];
  }

  cleanValue(value) {
    // Remove brackets and extra whitespace
    return value.replace(/[\[\]]/g, '').trim();
  }
}

module.exports = new aiService();