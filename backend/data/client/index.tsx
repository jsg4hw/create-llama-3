
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { io } from 'socket.io-client';
import { ChatMessage, LLMModel, ChatRequest, ChatResponse } from '../shared/types';
import './index.css';

const socket = io();

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch('/api/models')
      .then((res) => res.json())
      .then((data: LLMModel[]) => {
        setModels(data);
        setSelectedModel(data[0]?.id || null);
      });

    socket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('chat_message', (message: ChatMessage) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleSend = () => {
    if (input.trim() !== '' && selectedModel !== null) {
      const chatRequest: ChatRequest = {
        message: input,
        modelId: selectedModel,
      };

      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatRequest),
      })
        .then((res) => res.json())
        .then((data: ChatResponse) => {
          setInput('');
        });
    }
  };

  return (
    <div className="app">
      <h1>Local LLM Chatbot</h1>
      <div className="chat-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <select
          value={selectedModel || ''}
          onChange={(e) => setSelectedModel(Number(e.target.value))}
        >
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

