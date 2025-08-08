// Chofetz Chaim Chat Database Logic Page
// This file provides a UI to view and test the Chofetz Chaim bot's database logic for incorporating halachic teachings into responses.

import React, { useState } from 'react';
import { getChofetzChaimTeaching, chofetzChaimTeachings } from '../../server/services/chofetzChaimChatDatabase';

const ChofetzChaimChatDatabasePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [teaching, setTeaching] = useState('');

  const handleTestResponse = () => {
    // Simulate bot response incorporating a teaching
    const teaching = getChofetzChaimTeaching();
    setTeaching(teaching);
    setResponse(`${input}\n\nChofetz Chaim Principle: ${teaching}`);
  };

  return (
    <div style={{ padding: 32, maxWidth: 600, margin: '0 auto' }}>
      <h1>Chofetz Chaim Chat Database Logic</h1>
      <p>This page lets you test how the Chofetz Chaim bot incorporates halachic principles into its responses.</p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={4}
        style={{ width: '100%', marginBottom: 16 }}
        placeholder="Type a user message..."
      />
      <button onClick={handleTestResponse} style={{ marginBottom: 16 }}>
        Test Bot Response
      </button>
      {response && (
        <div style={{ background: '#f9f9f9', padding: 16, borderRadius: 8 }}>
          <strong>Bot Response:</strong>
          <pre>{response}</pre>
        </div>
      )}
      <h2>Available Chofetz Chaim Teachings</h2>
      <ul>
        {chofetzChaimTeachings.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
};

export default ChofetzChaimChatDatabasePage;
