from confluent_kafka import Producer
import json
import time

# Kafka producer settings
kafka_broker = "kafka:9092"
kafka_settings = {
    'bootstrap.servers': kafka_broker,
}


def produce_kafka_messages():
    producer = Producer(kafka_settings)

    # Test coordinate
    coordinate_entity1 = {
        'id': 42,
        'timestamp': int(time.time()),
        'x': 12.03,
        'y': 62.79,
    }
    coordinate_entity2 = {
        'id': 41,
        'timestamp': int(time.time()),
        'x': 66.70,
        'y': 99.14,
    }
    coordinate_entity3 = {
        'id': 46,
        'timestamp': int(time.time()),
        'x': 3.33,
        'y': 33.3,
    }

    # Convert coordinate entity to JSON
    message_value = json.dumps(coordinate_entity1)

    # Produce message to the "coordinates" topic
    producer.produce('coordinates', value=message_value)

    # Convert second coordinate entity to JSON
    message_value = json.dumps(coordinate_entity2)

    producer.produce('coordinates', value=message_value)

    # Wait for any outstanding messages to be delivered and delivery reports received
    producer.flush()

# Produce Kafka messages
produce_kafka_messages()
