from fastapi import FastAPI, BackgroundTasks
from confluent_kafka import Consumer, KafkaException

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

# Function to consume messages from Kafka
def consume_kafka_messages():
    consumer = Consumer(kafka_settings)
    # Subscribe to the "coordinates" topic
    consumer.subscribe(['coordinates'])
    try:
        while True:
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
    finally:
        consumer.close()

"""
# Background task to start the Kafka consumer
def start_kafka_consumer(background_tasks: BackgroundTasks):
    background_tasks.add_task(consume_kafka_messages)
"""

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
    return messages