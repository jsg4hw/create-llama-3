
import { app, io } from './run_express';
import { initDb, addChatMessage, getChatHistory, getModels } from './db';
import { generateResponse } from './llm';
import { ChatRequest, ChatResponse } from '../shared/types';

initDb();

app.post('/api/chat', async (req, res) => {
  const { message, modelId } = req.body as ChatRequest;

  const model = (await getModels()).find((m) => m.id === modelId);
  if (!model) {
    res.status(400).json({ error: 'Invalid model ID' });
    return;
  }

  const response = await generateResponse(message, model);
  addChatMessage(response);

  io.emit('chat_message', response);

  res.json({ message: response } as ChatResponse);
});

app.get('/api/models', async (req, res) => {
  const models = await getModels();
  res.json(models);
});

io.on('connection', async (socket) => {
  console.log('Client connected');

  const history = await getChatHistory();
  socket.emit('chat_history', history);

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

