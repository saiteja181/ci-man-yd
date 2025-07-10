require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/code', require('./routes/code'));
app.use('/api/users', require('./routes/users'));
app.use('/api/striver', require('./routes/striver'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CI-MAN-YD Backend is running!' });
});

// MongoDB Connection Function
async function connectToMongoDB() {
  try {
    let mongoUri;
    
    if (process.env.MONGODB_URI) {
      // Use provided MongoDB URI (Atlas or local)
      mongoUri = process.env.MONGODB_URI;
      console.log('🔄 Connecting to MongoDB...');
    } else {
      // Use in-memory MongoDB for development
      console.log('🔄 Starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('💾 In-memory MongoDB started');
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('💡 Try these solutions:');
    console.log('1. Install MongoDB locally');
    console.log('2. Use MongoDB Atlas (free cloud)');
    console.log('3. Check your MONGODB_URI in .env file');
    process.exit(1);
  }
}

// Connect to MongoDB and start server
connectToMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
  process.exit(0);
});