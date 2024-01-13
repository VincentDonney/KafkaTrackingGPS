from confluent_kafka import Producer
import json
import time
import random

# Kafka producer settings
kafka_broker = "kafka:9092"
kafka_settings = {
    'bootstrap.servers': kafka_broker,
}

def produce_kafka_messages():
    producer = Producer(kafka_settings)
    id = random.randint(1, 100),
    while True :
        # Update coordinates with random values between 0 and 0.001
        coordinate_entity = {
            'id': id,  # You can adjust the ID generation logic as needed
            'timestamp': int(time.time()),
            'x': random.uniform(0, 0.001),
            'y': random.uniform(0, 0.001),
        }
        # Convert coordinate entity to JSON
        message_value = json.dumps(coordinate_entity)
        # Produce message to the "coordinates" topic
        producer.produce('coordinates', value=message_value)
        # Wait for any outstanding messages to be delivered and delivery reports received
        producer.flush()
        # Sleep for 30 seconds before producing the next message
        time.sleep(30)


# Produce Kafka messages
produce_kafka_messages()
