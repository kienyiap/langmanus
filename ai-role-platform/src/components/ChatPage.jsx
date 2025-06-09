import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roles } from '../data/roles';

function ChatPage() {
  const { id } = useParams();
  const role = roles.find(r => String(r.id) === id);
  const storageKey = `chat_${id}`;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const provider = import.meta.env.VITE_PROVIDER || 'openai';
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore malformed data
      }
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, storageKey]);

  const MAX_CHARS = 12000; // rough limit for 4k tokens

  const limitHistory = hist => {
    let total = role.systemPrompt.length + hist.reduce((a, m) => a + m.content.length, 0);
    const copy = [...hist];
    while (total > MAX_CHARS && copy.length) {
      const removed = copy.shift();
      total -= removed.content.length;
    }
    return copy;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    const history = limitHistory([...messages, userMsg]);
    setMessages(history);
    setInput('');

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: role.systemPrompt },
            ...history,
          ],
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message}` },
      ]);
    }
  };

  if (!role) {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Role not found.</p>
        <Link to="/" className="text-blue-500 underline">Back</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 underline">← Back to roles</Link>
      <div className="text-center mt-4">
        <img
          src={role.avatar}
          alt={role.name}
          className="mx-auto mb-2 rounded-full w-24 h-24 object-cover"
        />
        <h1 className="text-2xl font-bold mb-2">{role.name}</h1>
        <p className="italic text-gray-600 mb-4">System Prompt: {role.systemPrompt}</p>
        <div className="p-4 border rounded bg-white h-96 overflow-y-auto mb-4 text-left flex flex-col space-y-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-3 py-2 rounded-lg max-w-[70%] break-words transition-opacity duration-300 animate-fade-in ${
                  msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border rounded p-2 focus:outline-none focus:ring focus:ring-blue-200 transition-all"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
