const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config(); // Load API key from .env

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1️⃣ Function to Enhance the Topic Using Course Description
async function enhanceTopic(topic, courseDescription) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Given the topic: "${topic}", and the following course description:
        "${courseDescription}", enhance the topic by listing key subtopics
        that should be covered in a quiz only based on course description .
        Return a structured summary.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();  // Enhanced topic
    } catch (error) {
        
        console.error("❌ Error enhancing topic:", error);
        throw error;
    }
}


module.exports = { enhanceTopic };
