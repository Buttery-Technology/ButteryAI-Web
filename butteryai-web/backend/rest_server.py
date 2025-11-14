from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# Allow CORS from React dev server origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    id: int
    subject: str
    date: str
    user: str
    message: str

chats = []

@app.post("/api/start")
async def start_new_chat(chat: ChatRequest):
    print(f"Received chat: {chat}")
    chats.append(chat)
    return {"id": chat.id, "message": "Message received", "date": chat.date}

@app.get("/api/get")
async def get_chats():
    print(f"Chats requested, total: {len(chats)}")
    return {"chats": chats}

if __name__ == "__main__":
    uvicorn.run("backend.rest_server:app", host="0.0.0.0", port=3001, reload=True)
