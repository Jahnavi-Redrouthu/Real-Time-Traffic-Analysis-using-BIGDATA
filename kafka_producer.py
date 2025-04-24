import json
import time
import requests
from kafka import KafkaProducer
from kafka.errors import KafkaError
import signal
import sys

API_URL = "https://data.cityofnewyork.us/resource/i4gi-tjb9.json"
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    retries=5,
    acks='all',
    request_timeout_ms=60000,  # Increase the request timeout
    max_block_ms=60000        # Increase the max block timeout for metadata
)

# Graceful shutdown handling
def signal_handler(sig, frame):
    print("Gracefully shutting down...")
    producer.flush()
    producer.close()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

while True:
    try:
        response = requests.get(API_URL)
        if response.status_code == 200:
            data = response.json()
            for record in data:
                try:
                    producer.send("traffic-topic", value=record).get(timeout=10)
                except KafkaError as e:
                    print(f"Error sending record to Kafka: {e}")
            print("Sent batch to Kafka.")
        else:
            print(f"Error fetching data: {response.status_code}")
        
        time.sleep(10)  # Wait before next batch

    except Exception as e:
        print(f"An error occurred: {e}")
        time.sleep(10)  # Wait before retrying
