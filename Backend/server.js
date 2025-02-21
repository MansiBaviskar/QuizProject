// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();
// const { enhanceTopic, generateMCQs } = require('./geminiservice');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// const PORT = process.env.PORT || 5000;

// app.post('/enhance-topic', async (req, res) => {
//   const { topic, courseDescription } = req.body;
  
//   if (!topic || !courseDescription) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing topic or course description' 
//     });
//   }

//   try {
//     const enhancedTopic = await enhanceTopic(topic, courseDescription);
//     res.json({ success: true, enhancedTopic });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Internal server error' 
//     });
//   }
// });

// app.post('/generate-mcqs', async (req, res) => {
//   const { enhancedTopic, difficulty } = req.body;
  
//   if (!enhancedTopic || !difficulty) {
//     return res.status(400).json({ 
//       success: false, 
//       message: 'Missing enhanced topic or difficulty level' 
//     });
//   }

//   try {
//     const mcqs = await generateMCQs(enhancedTopic, difficulty);
//     res.json({ success: true, mcqs });
//   } catch (error) {
//     console.error("Server error:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Internal server error' 
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { enhanceTopic, generateMCQs } = require('./geminiservice');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

app.post('/enhance-topic', async (req, res, next) => {
  try {
    const { topic, courseDescription } = req.body;
    
    if (!topic || !courseDescription) {
      return res.status(400).json({
        success: false,
        message: 'Missing topic or course description'
      });
    }

    const enhancedTopic = await enhanceTopic(topic, courseDescription);
    res.json({ success: true, enhancedTopic });
  } catch (error) {
    next(error);
  }
});

app.post('/generate-mcqs', async (req, res, next) => {
  try {
    const { enhancedTopic, difficulty } = req.body;
    
    if (!enhancedTopic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Missing enhanced topic or difficulty level'
      });
    }

    const result = await generateMCQs(enhancedTopic, difficulty);
    
    // Ensure we have questions before sending response
    if (!result || !result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid question format received from service');
    }

    res.json({ 
      success: true, 
      mcqs: result.questions 
    });
  } catch (error) {
    next(error);
  }
});

// Add a test endpoint to verify server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});