const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function enhanceTopic(topic, courseDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Given the topic: "${topic}", and the following course description: "${courseDescription}",
    enhance the topic by listing key subtopics that should be covered in a quiz only based on 
    course description and based on difficulty level. Return a structured summary in short.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Error enhancing topic:", error);
    throw error;
  }
}

async function generateMCQs(enhancedTopic, difficulty) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  // Updated prompt to force structured response
  const prompt = `
    Create 10 multiple choice questions about: "${enhancedTopic}" at ${difficulty} difficulty level.
    
    Respond with ONLY a JSON array of questions. Do not include any other text, markdown, or formatting.
    Each question must follow this EXACT format:
    
    {
      "question": "Question text",
      "options": [
        "A) First option",
        "B) Second option",
        "C) Third option",
        "D) Fourth option"
      ],
      "correctAnswer": "a",
      "explanation": "Explanation text"
    }

    The response should start with [ and end with ]. No other characters allowed outside the JSON structure.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = await result.response.text();

    // Clean the response
    text = text.trim();
    
    // Remove any markdown formatting if present
    if (text.includes('```')) {
      text = text.replace(/```json\s?/g, '')
                 .replace(/```\s?/g, '')
                 .trim();
    }

    // Ensure we have valid JSON array brackets
    if (!text.startsWith('[')) {
      const match = text.match(/\[([\s\S]*)\]/);
      if (match) {
        text = match[0];
      }
    }

    // Parse the JSON
    let questions;
    try {
      questions = JSON.parse(text);
      
      // If we got a single object instead of an array, wrap it
      if (!Array.isArray(questions)) {
        questions = [questions];
      }

      // Validate and format each question
      questions = questions.map(q => ({
        question: String(q.question || ''),
        options: Array.isArray(q.options) ? q.options.map(String) : [],
        correctAnswer: String(q.correctAnswer || '').toLowerCase(),
        explanation: String(q.explanation || '')
      }));

      return { questions };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error(`Invalid JSON structure received from API: ${parseError.message}`);
    }
  } catch (error) {
    console.error("Generation Error:", error);
    throw error;
  }
}

module.exports = { enhanceTopic, generateMCQs };