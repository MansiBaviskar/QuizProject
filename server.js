const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { enhanceTopic, generateQuiz } = require('./geminiserver');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// 1️⃣ Route to Enhance Topic
app.post('/enhance-topic', async (req, res) => {
    const { topic, courseDescription } = req.body;
    if (!topic || !courseDescription) {
        return res.status(400).json({ success: false, message: 'Missing topic or course description' });
    }
    
    try {
        const enhancedTopic = await enhanceTopic(topic, courseDescription);
        res.json({ success: true, enhancedTopic });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.listen(5000, () => {
    console.log("✅ Server running on port 5000");
});