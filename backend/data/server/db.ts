
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database(':memory:');

export function initDb() {
  db.run(`
    CREATE TABLE IF NOT EXISTS chat_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS llm_models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `);

  // Insert sample LLM models
  db.run(`
    INSERT INTO llm_models (name, description)
    VALUES 
      ('gpt-3', 'GPT-3 language model'),
      ('gpt-4', 'GPT-4 language model')
  `);
}

export function addChatMessage(message: ChatMessage) {
  db.run(`
    INSERT INTO chat_messages (role, content, timestamp)
    VALUES (?, ?, ?)
  `, [message.role, message.content, message.timestamp]);
}

export function getChatHistory() {
  return new Promise<ChatMessage[]>((resolve, reject) => {
    db.all(`
      SELECT * FROM chat_messages
      ORDER BY timestamp ASC
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as ChatMessage[]);
      }
    });
  });
}

export function getModels() {
  return new Promise<LLMModel[]>((resolve, reject) => {
    db.all(`
      SELECT * FROM llm_models
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows as LLMModel[]);
      }
    });
  });
}

