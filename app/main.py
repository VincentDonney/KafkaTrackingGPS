from fastapi import FastAPI, BackgroundTasks, HTTPException
from confluent_kafka import Consumer, KafkaException
import threading
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql

app = FastAPI(title="Fastapi")

# Database connection settings
db_settings = {
    'dbname': 'db',
    'user': 'user',
    'password': 'pwd',
    'host': 'database',
    'port': '5432'
}

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
        while i < 2:
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
    finally:
        consumer.close()
    push_data_to_database(messages)
    return messages


def push_data_to_database(processed_data):
    conn = psycopg2.connect(
        host="database",
        database="db",
        user="user",
        password="pwd"
    )
    """
    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO coordinates (timestamp, x, y) VALUES (%s, %s, %s)",
                           (processed_data['timestamp'], processed_data['x'], processed_data['y']))
        conn.commit()
    finally:
        conn.close()"""
    
#@app.get("/state")
#async def state():
#    