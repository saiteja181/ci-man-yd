const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// POST /api/code/analyze
router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code and language are required' 
      });
    }

    console.log(`🔍 Analyzing ${language} code...`);
    
    const hints = await aiService.analyzeCode(code, language);
    
    res.json({
      success: true,
      hints: hints,
      analysis: {
        language,
        timestamp: new Date().toISOString(),
        codeLength: code.length
      }
    });
    
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze code',
      message: error.message 
    });
  }
});

module.exports = router;