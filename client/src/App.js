import React, { useState, useEffect } from 'react';
import { Code, Brain, User, History, Send, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';


// API Service - normally you'd import this from services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  async analyzeCode(code, language) {
    const response = await fetch(`${API_BASE_URL}/code/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  },

  async testConnection() {
    try {
      const response = await fetch('http://localhost:5000/');
      return await response.json();
    } catch (error) {
      return { error: 'Backend not reachable' };
    }
  }
};

// Main App Component
const App = () => {
  // State Management
  const [code, setCode] = useState('// Write your code here\nfunction solve() {\n  // Your solution\n  return result;\n}');
  const [hints, setHints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [user, setUser] = useState({ name: 'Student', level: 'Beginner' });
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [error, setError] = useState('');
  const [analysisHistory, setAnalysisHistory] = useState([]);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const result = await apiService.testConnection();
      if (result.error) {
        setConnectionStatus('error');
        setError('Backend server not connected');
      } else {
        setConnectionStatus('connected');
        setError('');
      }
    } catch (error) {
      setConnectionStatus('error');
      setError('Failed to connect to backend');
    }
  };

  // Real API call to analyze code
  const analyzeCode = async (userCode, lang) => {
    if (!userCode.trim()) {
      setError('Please write some code first!');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔍 Sending code to backend for analysis...');
      const result = await apiService.analyzeCode(userCode, lang);
      
      if (result.success) {
        setHints(result.hints || []);
        
        // Add to history
        const newSubmission = {
          id: Date.now(),
          timestamp: new Date().toLocaleString(),
          language: lang,
          status: 'analyzed',
          hintsCount: result.hints?.length || 0
        };
        
        setAnalysisHistory(prev => [newSubmission, ...prev.slice(0, 4)]); // Keep last 5
        
        console.log('✅ Analysis complete:', result.hints?.length, 'hints received');
      } else {
        setError('Analysis failed: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Analysis error:', error);
      setError('Failed to analyze code: ' + error.message);
      
      // Show fallback hints
      setHints([
        {
          id: 1,
          type: 'error',
          message: 'Unable to connect to AI service. Please check your internet connection.',
          severity: 'warning'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header user={user} connectionStatus={connectionStatus} />
      
      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
            <button 
              onClick={checkBackendConnection}
              className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Side - Code Editor */}
          <div className="space-y-4">
            <CodeEditor 
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={setLanguage}
              onSubmit={() => analyzeCode(code, language)}
              isLoading={isLoading}
              disabled={connectionStatus !== 'connected'}
            />
          </div>
          
          {/* Right Side - Hints & Analysis */}
          <div className="space-y-4">
            <HintPanel hints={hints} isLoading={isLoading} />
            <SubmissionHistory submissions={analysisHistory} />
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = ({ user, connectionStatus }) => {
  const getStatusColor = () => {
    switch(connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getStatusText = () => {
    switch(connectionStatus) {
      case 'connected': return 'Connected';
      case 'error': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">CI-MAN-YD</h1>
            <span className="text-sm text-gray-500">Code Intelligence Assistant</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              {connectionStatus === 'connected' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {user.level}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Code Editor Component
const CodeEditor = ({ code, setCode, language, setLanguage, onSubmit, isLoading, disabled }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Code className="h-5 w-5 mr-2" />
          Code Editor
        </h2>
        
        {/* Language Selector */}
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm"
          disabled={disabled}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>
      
      {/* Code Textarea */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-4 border rounded-md font-mono text-sm bg-gray-50 resize-none"
        placeholder="Write your code here..."
        style={{ fontFamily: 'Monaco, Consolas, monospace' }}
        disabled={disabled}
      />
      
      {/* Submit Button */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {code.length} characters
        </span>
        <button
          onClick={onSubmit}
          disabled={isLoading || disabled}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Analyze Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


const HintPanel = ({ hints, isLoading }) => {
  console.log('📦 Hints passed to HintPanel:', hints); // ✅ Log for debugging

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'warning': return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'error': return 'bg-red-50 border-red-400 text-red-800';
      case 'none': return 'bg-green-50 border-green-400 text-green-800';
      default: return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
        AI Hints & Analysis
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent"></div>
          <span className="ml-3 text-gray-600">Analyzing your code with AI...</span>
        </div>
      ) : hints && hints.length > 0 ? (
        <div className="space-y-3">
          {hints.map((hint, index) => (
            <div
              key={`${hint.type}-${index}`}
              className={`p-4 rounded-md border-l-4 ${getSeverityColor(hint.severity)}`}
            >
              <div className="flex items-start">
                <Lightbulb className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm capitalize">{hint.type} Hint</p>
                  <p className="text-sm mt-1">{hint.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Submit your code to get AI-powered hints!</p>
        </div>
      )}
    </div>
  );
};

// Submission History Component
const SubmissionHistory = ({ submissions = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <History className="h-5 w-5 mr-2" />
        Recent Submissions
      </h2>
      
      <div className="space-y-3">
        {submissions.length > 0 ? (
          submissions.map((submission) => (
            <div
              key={submission.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <p className="font-medium text-sm">{submission.language}</p>
                <p className="text-xs text-gray-500">{submission.timestamp}</p>
              </div>
              <div className="text-right">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  {submission.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {submission.hintsCount} hints
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <History className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;