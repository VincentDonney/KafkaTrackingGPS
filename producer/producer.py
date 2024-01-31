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

# Function to update coordinates (movement is generated randomly by small steps)
def generate_coordinates(x, y):
    x = x + random.uniform(0.00005, 0.0006) * random.randint(-1, 1)
    y = y + random.uniform(0.00005, 0.0006) * random.randint(-1, 1)
    return x, y

# Produce kafka message of coherently random position every 5s
def produce_kafka_messages():
    producer = Producer(kafka_settings)
    # Get id and initial positions from environnement variables
    id = os.getenv('id', '0')
    x = os.getenv('x', '0')
    y = os.getenv('y', '0')
    while True :
        x, y = generate_coordinates(float(x), float(y))
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
