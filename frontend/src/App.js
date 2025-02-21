// import axios from 'axios';
// import React, { useState } from 'react';
// import './App.css';

// function App() {
//   const [formData, setFormData] = useState({
//     topic: '',
//     courseDescription: ''
//   });
//   const [enhancedTopic, setEnhancedTopic] = useState('');
//   const [difficulty, setDifficulty] = useState('easy');
//   const [mcqs, setMcqs] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [generating, setGenerating] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMcqs(null);

//     try {
//       const response = await axios.post('http://localhost:5000/enhance-topic', formData);
//       setEnhancedTopic(response.data.enhancedTopic);
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while enhancing the topic');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateMCQs = async () => {
//     setGenerating(true);
//     setError('');

//     try {
//       const response = await axios.post('http://localhost:5000/generate-mcqs', {
//         enhancedTopic,
//         difficulty
//       });
//       setMcqs(response.data.mcqs);
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred while generating MCQs');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="content-wrapper">
//         <h1 className="title">Topic Enhancer & Quiz Generator</h1>
        
//         <div className="card">
//           <div className="card-content">
//             <form onSubmit={handleSubmit} className="form">
//               <div className="form-group">
//                 <label className="label">Topic</label>
//                 <input
//                   type="text"
//                   name="topic"
//                   value={formData.topic}
//                   onChange={handleChange}
//                   placeholder="Enter your topic"
//                   className="input"
//                   required
//                 />
//               </div>
              
//               <div className="form-group">
//                 <label className="label">Course Description</label>
//                 <textarea
//                   name="courseDescription"
//                   value={formData.courseDescription}
//                   onChange={handleChange}
//                   placeholder="Enter course description"
//                   className="textarea"
//                   required
//                 />
//               </div>

//               <button 
//                 type="submit" 
//                 className={`button ${loading ? 'loading' : ''}`}
//                 disabled={loading}
//               >
//                 {loading ? 'Enhancing...' : 'Enhance Topic'}
//               </button>
//             </form>

//             {error && (
//               <div className="error-message">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {enhancedTopic && (
//           <div className="card mt-4">
//             <div className="card-content">
//               <h2 className="subtitle">Enhanced Topic Overview</h2>
//               <div className="enhanced-content">
//                 {enhancedTopic}
//               </div>

//               <div className="mcq-controls">
//                 <div className="difficulty-selector">
//                   <label className="label">Quiz Difficulty:</label>
//                   <select 
//                     value={difficulty} 
//                     onChange={(e) => setDifficulty(e.target.value)}
//                     className="select"
//                   >
//                     <option value="easy">Easy</option>
//                     <option value="medium">Medium</option>
//                     <option value="hard">Hard</option>
//                   </select>
//                 </div>

//                 <button 
//                   onClick={handleGenerateMCQs} 
//                   className={`button ${generating ? 'loading' : ''}`}
//                   disabled={generating}
//                 >
//                   {generating ? 'Generating...' : 'Generate Quiz'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {mcqs && (
//           <div className="card mt-4">
//             <div className="card-content">
//               <h2 className="subtitle">Quiz Questions</h2>
//               <div className="mcq-list">
//                 {mcqs.map((mcq, index) => (
//                   <div key={index} className="mcq-item">
//                     <h3 className="question-number">Question {index + 1}</h3>
//                     <p className="question-text">{mcq.question}</p>
//                     <div className="options-grid">
//                       {mcq.options.map((option, optIndex) => (
//                         <div 
//                           key={optIndex} 
//                           className={`option ${
//                             String.fromCharCode(97 + optIndex) === mcq.correctAnswer 
//                               ? 'correct' 
//                               : ''
//                           }`}
//                         >
//                           <span className="option-letter">
//                             {String.fromCharCode(65 + optIndex)}.
//                           </span>
//                           {option}
//                         </div>
//                       ))}
//                     </div>
//                     <div className="explanation">
//                       <span className="explanation-label">Explanation:</span>
//                       {mcq.explanation}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;

import axios from 'axios';
import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    topic: '',
    courseDescription: ''
  });
  const [enhancedTopic, setEnhancedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [mcqs, setMcqs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    if (!showResults) {
      setSelectedAnswers(prev => ({
        ...prev,
        [questionIndex]: answer
      }));
    }
  };

  const calculateScore = () => {
    if (!mcqs) return 0;
    let correctAnswers = 0;
    mcqs.forEach((mcq, index) => {
      if (selectedAnswers[index] === mcq.correctAnswer) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMcqs(null);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);

    try {
      const response = await axios.post('http://localhost:5000/enhance-topic', formData);
      setEnhancedTopic(response.data.enhancedTopic);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while enhancing the topic');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMCQs = async () => {
    setGenerating(true);
    setError('');
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);

    try {
      const response = await axios.post('http://localhost:5000/generate-mcqs', {
        enhancedTopic,
        difficulty
      });
      setMcqs(response.data.mcqs);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating MCQs');
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleTryAgain = () => {
    setShowResults(false);
    setSelectedAnswers({});
    setScore(0);
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <h1 className="title">Topic Enhancer & Quiz Generator</h1>
        
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              <div className="form-group">
                <label className="label">Topic</label>
                <input
                  type="text"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Enter your topic"
                  className="input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="label">Course Description</label>
                <textarea
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  className="textarea"
                  required
                />
              </div>

              <button 
                type="submit" 
                className={`button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Enhancing...' : 'Enhance Topic'}
              </button>
            </form>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>

        {enhancedTopic && (
          <div className="card mt-4">
            <div className="card-content">
              <h2 className="subtitle">Enhanced Topic Overview</h2>
              <div className="enhanced-content">
                {enhancedTopic}
              </div>

              <div className="mcq-controls">
                <div className="difficulty-selector">
                  <label className="label">Quiz Difficulty:</label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <button 
                  onClick={handleGenerateMCQs} 
                  className={`button ${generating ? 'loading' : ''}`}
                  disabled={generating}
                >
                  {generating ? 'Generating...' : 'Generate Quiz'}
                </button>
              </div>
            </div>
          </div>
        )}

        {mcqs && (
          <div className="card mt-4">
            <div className="card-content">
              <h2 className="subtitle">Quiz Questions</h2>
              <div className="mcq-list">
                {mcqs.map((mcq, index) => (
                  <div key={index} className="mcq-item">
                    <h3 className="question-number">Question {index + 1}</h3>
                    <p className="question-text">{mcq.question}</p>
                    <div className="options-grid">
                      {mcq.options.map((option, optIndex) => {
                        const letterAnswer = String.fromCharCode(97 + optIndex);
                        const isSelected = selectedAnswers[index] === letterAnswer;
                        const isCorrect = showResults && letterAnswer === mcq.correctAnswer;
                        
                        return (
                          <div 
                            key={optIndex} 
                            onClick={() => handleAnswerSelect(index, letterAnswer)}
                            className={`option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : ''}`}
                          >
                            <span className="option-letter">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                          </div>
                        );
                      })}
                    </div>
                    {showResults && (
                      <div className="explanation">
                        <span className="explanation-label">Explanation:</span>
                        {mcq.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <div className="quiz-controls">
                  {!showResults ? (
                    <button 
                      onClick={handleSubmitQuiz}
                      className="button submit-quiz"
                      disabled={Object.keys(selectedAnswers).length !== mcqs.length}
                    >
                      Submit Quiz
                    </button>
                  ) : (
                    <div className="score-display">
                      <h3>Quiz Results</h3>
                      <p>Score: {score} out of {mcqs.length}</p>
                      <p>Percentage: {((score / mcqs.length) * 100).toFixed(1)}%</p>
                      <button 
                        onClick={handleTryAgain}
                        className="button mt-4"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;