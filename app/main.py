from fastapi import FastAPI, HTTPException
from kafka import KafkaConsumer
import httpx

app = FastAPI()

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
    'bootstrap_servers': 'kafka:9092',
    'group_id': 'web_consumer_group',
    'auto_offset_reset': 'earliest'
}


# Function to fetch data from the database
async def fetch_data_from_database():
    async with httpx.AsyncClient() as client:
        response = await client.get('http://database:5432/query')  # Replace with your database endpoint
        return response.json()


# FastAPI endpoint to simulate fetching data
@app.get("/fetch-data")
async def fetch_data():
    # Fetch data from the database
    data_from_db = await fetch_data_from_database()

    # Process the fetched data (replace this with your actual logic)
    processed_data = {"message": "Data processed successfully", "data": data_from_db}
    
    return processed_data
