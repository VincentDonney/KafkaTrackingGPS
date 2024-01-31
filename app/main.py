from fastapi import FastAPI, BackgroundTasks, HTTPException, WebSocket
from fastapi.responses import HTMLResponse
from confluent_kafka import Consumer, KafkaException
import threading
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql
import json
from datetime import datetime
import time

app = FastAPI(title="Fastapi")

# Kafka consumer settings
kafka_settings = {
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'web_consumer_group',
    'auto.offset.reset': 'earliest'
}

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI main page!"}

# Fetch all messages of kafka topic 'coordinates' and pushes them to the database
@app.get("/push_message")
async def push_message():
    messages = []
    consumer = Consumer(kafka_settings)
    consumer.subscribe(['coordinates'])
    try:
        # Iterate everything until no message is left
        while True:
            msg = consumer.poll(1.0)
            if msg is None:
                break
            if msg.error():
                if msg.error().code() == KafkaException._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break
            print(f'Received message: {msg.value().decode("utf-8")}')
            messages.append({msg.value().decode("utf-8")})
            data = {msg.value().decode("utf-8")}
            push_data_to_database(data)
    finally:
        consumer.close()
    return "All positions have been pushed"

# Pushes one message to the database
def push_data_to_database(processed_data):
    conn = psycopg2.connect(
        host="database",
        database="pg",
        user="pg",
        password="pg"
    )
    values = message_processor(processed_data)
    try:
        with conn.cursor() as cursor:
            timestamp = datetime.fromtimestamp(values["timestamp"])
            cursor.execute("INSERT INTO coordinates (id, timestamp, x, y) VALUES (%s, %s, %s, %s)",
                           (values["id"], timestamp, values["x"], values["y"]))
        conn.commit()
    finally:
        conn.close()
    
# Processes one Kafka message into a valid JSON object for the database
def message_processor(input):
    message = ""
    for i in input:
        message += i
    parsed_message = json.loads(message)
    id = parsed_message["id"][0]
    timestamp = parsed_message["timestamp"]
    x = parsed_message["x"]
    y = parsed_message["y"]
    values = {
        "id": id,
        "timestamp": timestamp,
        "x": x,
        "y": y
    }
    return values

# Fetches the latest messages from the database
@app.get("/get_messages")
def get_messages():
    conn = psycopg2.connect(
            host="database",
            database="pg",
            user="pg",
            password="pg"
        )
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, timestamp, x, y FROM coordinates ORDER BY timestamp DESC LIMIT 5")
            rows = cursor.fetchall()
            positions = {}
            for row in rows:
                id, timestamp, x, y = row
                # Convert timestamp to Unix timestamp for consistent output
                timestamp_unix = int(timestamp.timestamp())
                positions[id]= {
                    "timestamp": timestamp_unix,
                    "x": x,
                    "y": y
                }
                
    finally:
        conn.close()
    return positions

        
@app.websocket("/ws")
async def pasweb(websocket: WebSocket):
    await websocket.accept()
    while True:
        await push_message()
        positions = get_messages()
        await websocket.send_text(json.dumps(positions))
        del positions
        time.sleep(5)
