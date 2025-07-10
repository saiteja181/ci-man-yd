import React, { useEffect, useState, useCallback } from 'react';
import { List, CheckSquare, Square } from 'lucide-react';

const StriverSheet = ({ api }) => {
  const [questions, setQuestions] = useState([]);
  const [completed, setCompleted] = useState([]);

  const loadQuestions = useCallback(async () => {
    try {
      const data = await api.getStriverQuestions(true);
      setQuestions(data);
    } catch (err) {
      console.error('Failed to load questions', err);
    }
  }, [api]);

  useEffect(() => {
    const done = JSON.parse(localStorage.getItem('striverDone') || '[]');
    setCompleted(done);
    loadQuestions();
  }, [loadQuestions]);

  const toggleDone = (id) => {
    let updated;
    if (completed.includes(id)) {
      updated = completed.filter((d) => d !== id);
    } else {
      updated = [...completed, id];
    }
    setCompleted(updated);
    localStorage.setItem('striverDone', JSON.stringify(updated));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <List className="h-5 w-5 mr-2" />
        Striver Sheet
      </h2>
      <p className="text-sm text-gray-600 mb-2">
        {completed.length}/{questions.length} completed
      </p>
      <ul className="space-y-2">
        {questions.map((q) => (
          <li key={q.id} className="flex items-center justify-between">
            <a
              href={q.link}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {q.title}
            </a>
            <button onClick={() => toggleDone(q.id)} className="ml-2">
              {completed.includes(q.id) ? (
                <CheckSquare className="h-4 w-4 text-green-600" />
              ) : (
                <Square className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StriverSheet;
