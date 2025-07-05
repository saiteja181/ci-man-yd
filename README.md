# CI-MAN-YD
**Code Intelligence Assistant - Mentoring and Development**

A real-time code analysis platform that provides intelligent hints and suggestions to help developers improve their coding skills. Built with modern web technologies and powered by AI.

## ✨ What This Does

Stop getting stuck on bugs for hours. CI-MAN-YD analyzes your code instantly and tells you exactly what's wrong, why it's wrong, and how to fix it. Think of it as having a senior developer looking over your shoulder, but without the judgment.

## 🚀 Features

- **Real-time Code Analysis** - Get feedback as you type
- **Multi-language Support** - JavaScript, Python, Java, C++
- **Smart Hint System** - Syntax errors, logic issues, optimizations
- **Clean Interface** - No clutter, just your code and helpful suggestions
- **Submission History** - Track your progress and past analyses

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- Tailwind CSS for styling
- Lucide React for icons

**Backend:**
- Node.js with Express
- Google Gemini AI for code analysis
- Axios for API calls

**Development:**
- Hot reload for instant feedback
- Modular component architecture
- RESTful API design

## 📋 Prerequisites

Make sure you have these installed:
- Node.js (v16 or higher)
- npm or yarn
- A Google AI API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ci-man-yd.git
   cd ci-man-yd
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start backend server
   npm run server
   
   # In another terminal, start frontend
   npm run client
   ```

5. **Open your browser**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

## 🎯 Usage

1. **Write your code** in the editor
2. **Select your language** from the dropdown
3. **Click "Analyze Code"** to get instant feedback
4. **Review the hints** - they're categorized by type and severity
5. **Check your history** to see past analyses

## 🔑 API Endpoints

```
POST /api/code/analyze
- Analyzes code and returns hints
- Body: { code: string, language: string }
- Returns: { success: boolean, hints: array }

GET /
- Health check endpoint
- Returns: { status: "OK", message: "Backend is running" }
```

## 🎨 Project Structure

```
ci-man-yd/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
├── server/                # Express backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── index.js          # Server entry point
├── .env                   # Environment variables
└── package.json          # Dependencies
```

## 🔧 Configuration

**Backend Configuration:**
- Port: 5000 (configurable via .env)
- CORS: Enabled for localhost:3000
- API: Google Gemini 2.0 Flash

**Frontend Configuration:**
- Tailwind CSS for styling
- Responsive design
- Real-time connection status

## 🚀 Deployment

**Quick Deploy to Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway up
```

**Environment Variables for Production:**
```
GOOGLE_AI_API_KEY=your_production_api_key
NODE_ENV=production
PORT=5000
```

## 🐛 Troubleshooting

**"Backend not reachable" error:**
- Check if backend server is running on port 5000
- Verify your API key is correct
- Check console for detailed error messages

**Hints not showing:**
- Ensure your code is valid
- Check network tab for failed requests
- Verify the response format in console

**Connection issues:**
- Make sure both frontend and backend are running
- Check if ports 3000 and 5000 are available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature-name"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## 🙏 Acknowledgments

- Google AI for providing the Gemini API
- The open-source community for the amazing tools
- Everyone who tested and provided feedback

## 📧 Contact

Have questions? Found a bug? Want to contribute?

- **Email**: kuramdasusaiteja@gmail.com
- **GitHub**: [saiteja181](https://github.com/saiteja181)
- **LinkedIn**: [sai-teja-kuramdasu](https://linkedin.com/in/sai-teja-kuramdasu)

