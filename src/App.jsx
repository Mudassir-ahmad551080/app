// chatbot/src/App.jsx
import React, { useState, useEffect } from 'react';
import Answe from './component/Answe';

const App = () => {
  const [query, setQuery] = useState('');
  const [menu, setMenu] = useState(false);
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const API_KEY = "AIzaSyD2QQk69MRNu2msBe050Dne9bgeUY2YNW0";
  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  async function askQuestion() {
    if (!query.trim()) return;

    const payload = {
      contents: [{ parts: [{ text: query }] }]
    };

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      const dataString = data.candidates[0].content.parts[0].text;
      const lines = dataString.split('* ').map((item) => item.trim()).filter(Boolean);

      const newChat = {
        question: query,
        answers: lines
      };

      setHistory(prev => [...prev, newChat]);

      const formatted = [{ type: 'q', text: query }, ...lines.map(line => ({ type: 'a', text: line }))];
      setResult(prev => [...prev, ...formatted]);
      setQuery('');
    } catch (error) {
      console.error("Error:", error);
      setResult(prev => [...prev, { type: 'error', text: 'Something went wrong.' }]);
    }
  }

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('chatHistory');
    setResult([]);
  };

  const loadFromHistory = (chatItem) => {
    const formatted = [{ type: 'q', text: chatItem.question }, ...chatItem.answers.map(a => ({ type: 'a', text: a }))];
    setResult(formatted); // replace view (not accumulate)
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`w-64 bg-gray-800 fixed md:h-screen p-4 transition-all duration-300 ease-in-out ${menu ? 'block' : 'hidden md:block'}`}>
        <div className="flex justify-between items-center md:justify-start mb-4">
          <h2 className="text-xl font-bold">History</h2>
          <button onClick={() => setMenu(false)} className="md:hidden text-sm bg-indigo-600 px-3 py-1 rounded-full">Close</button>
        </div>

        <div className="space-y-2 text-sm text-gray-300  overflow-y-auto max-h-[80vh]">
          {history.length === 0 ? (
            <p>No history yet.</p>
          ) : (
            history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => loadFromHistory(item)}
                className="text-left w-full bg-gray-700 hover:bg-gray-600 rounded px-3 py-2 transition"
              >
                {item.question}
              </button>
            ))
          )}
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="mt-4 w-full text-sm bg-red-600 px-3 py-2 rounded-md hover:bg-red-700 transition"
          >
            Clear History
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col items-center">
        <div className="w-full flex justify-start md:hidden mb-4">
          <button onClick={() => setMenu(true)} className="bg-indigo-600 px-4 py-2 rounded-full">Show History</button>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6">
          Hello, I Am <span className="text-lime-400">Delta</span>
        </h1>

        {/* Output */}
        <div id="mydiv" className="w-full max-w-2xl space-y-3">
          {result.map((item, index) => (
            <Answe key={index} ans={item.text} type={item.type} />
          ))}
        </div>

        {/* Input */}
        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row mt-6 sm:mt-20 border border-white rounded-xl p-2 bg-gray-800 shadow-md w-full">
            <input
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              type="text"
              placeholder="Ask me anything..."
              className="w-full sm:flex-grow px-4 py-2 bg-transparent text-white outline-none placeholder-gray-400 mb-2 sm:mb-0"
            />
            <button
              onClick={askQuestion}
              className="w-full cursor-pointer sm:w-auto bg-black px-5 py-2 rounded-xl hover:bg-gray-700 transition"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
