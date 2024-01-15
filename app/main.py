from fastapi import FastAPI, BackgroundTasks, HTTPException
from confluent_kafka import Consumer, KafkaException
import threading
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql
import json
from datetime import datetime

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


@app.get("/see_messages")
async def see_messages():
    messages = []
    i = 0
    consumer = Consumer(kafka_settings)
    consumer.subscribe(['coordinates'])
    try:
        while i < 1:
            msg = consumer.poll(1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaException._PARTITION_EOF:
                    continue
                else:
                    print(msg.error())
                    break
            print(f'Received message: {msg.value().decode("utf-8")}')
            i += 1
            messages.append({msg.value().decode("utf-8")})
            go = {msg.value().decode("utf-8")}
    finally:
        consumer.close()
    end = push_data_to_database(go)
    return end


def push_data_to_database(processed_data):
    conn = psycopg2.connect(
        host="database",
        database="pg",
        user="pg",
        password="pg"
    )
    
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO coordinates (id, timestamp, x, y) VALUES (%s, %s, %s, %s)",
                           (id, timestamp, x, y))
        conn.commit()
    finally:
        conn.close()
    """
    return (id_value)
    
