from confluent_kafka import Producer
import json
import time
import random
import math
import os

# Kafka producer settings
kafka_broker = "kafka:9092"
kafka_settings = {
    'bootstrap.servers': kafka_broker,
}

# Function to generate coordinates along a 45° angle
def generate_coordinates(x, y):
    x += random.uniform(-0.001, 0.001)
    y += random.uniform(-0.001, 0.001)
    return x, y

# Produce kafka message of coherently random position every 5s
def produce_kafka_messages():
    producer = Producer(kafka_settings)
    id = os.getenv('id', '0')
    x = os.getenv('x', '0')
    y = os.getenv('y', '0')
    while True :
        # Update coordinates with random values between 0 and 0.001 adn 45° angle
        x, y = generate_coordinates(int(x), int(y))
        coordinate_entity = {
            'id': id,
            'timestamp': int(time.time()),
            'x': x,
            'y': y,
        }
        # Convert coordinate entity to JSON
        message_value = json.dumps(coordinate_entity)
        # Produce message to the "coordinates" topic
        producer.produce('coordinates', value=message_value)
        # Wait for any outstanding messages to be delivered and delivery reports received
        producer.flush()
        # Sleep for 5 seconds before producing the next message
        time.sleep(5)


# Produce Kafka messages
produce_kafka_messages()