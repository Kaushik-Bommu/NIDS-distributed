import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware # <--- ADD THIS IMPORT
from pydantic import BaseModel
from qstash import QStash
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables from the .env file (like QSTASH_TOKEN)
load_dotenv()

# Initialize the QStash Client using your token
client = QStash(os.getenv("QSTASH_TOKEN"))
QUEUE_NAME = "nids-queue"

ML_WORKER_URL = os.getenv("ML_WORKER_URL", "http://localhost:8001/predict")

# IMPORTANT: You will replace this with your actual Ngrok URL later.
# --- PART 2: STARTUP LOGIC (LIFESPAN) ---
# This code runs EXACTLY ONCE when you start your FastAPI server.
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("⚙️ Configuring QStash Queue...")
    
    # YOUR CODE: Explicitly create or update the queue to handle 2 concurrent requests
    client.queue.upsert(QUEUE_NAME, parallelism=2)
    
    print(f"✅ Queue '{QUEUE_NAME}' is ready with parallelism=2")
    yield
    print("🛑 Shutting down ingestion API...")

app = FastAPI(lifespan=lifespan)

# --- ADD THIS ENTIRE BLOCK TO ENABLE CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows any frontend (React) to talk to this API
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------------

# Define the features your NIDS model expects
class NetworkLog(BaseModel):
    source_ip: str
    destination_ip: str
    packet_size: int
    protocol: str
    src_bytes: int
    dst_bytes: int
    raw_data: list[str] # <--- ADD THIS

# --- ENDPOINT: Fast-lane ingestion, no heavy ML processing here ---
@app.post("/ingest", status_code=status.HTTP_202_ACCEPTED)
async def ingest_log(log: NetworkLog):
    try:
        # Pushes the JSON data to QStash. QStash will then securely route it 
        # to your ML Worker via the ML_WORKER_URL.
        client.message.enqueue_json(
            queue=QUEUE_NAME,
            url=ML_WORKER_URL,
            body=log.model_dump() # Converts the Pydantic model to a standard dictionary
        )
        return {"status": "Log successfully queued in QStash"}
        
    except Exception as e:
        # If QStash fails, return a 500 Internal Server Error
        raise HTTPException(status_code=500, detail=str(e))