
# Local LLM Chatbot

This is a full-stack TypeScript app for an LLM chatbot that allows the user to use their own local LLM. 

## Routes
- `/`: Serves the main React app
- `/api/chat`: POST endpoint for sending a chat message and getting a response from the local LLM
- `/api/models`: GET endpoint for retrieving the list of available local LLM models

## Libraries Used
- Backend:
  - express
  - sqlite3 
  - socket.io
- Frontend:  
  - react
  - react-dom
  - socket.io-client

## Running the App

To run the app, simply execute:

```
bun server/run.ts // doesn't work - do below command
```

```
bun run dev
```

This will start the server on port 8001. Open http://localhost:8001 in your browser to use the chatbot.

The app uses SQLite for storing chat history. Socket.io is used for real-time updates between the client and server.

