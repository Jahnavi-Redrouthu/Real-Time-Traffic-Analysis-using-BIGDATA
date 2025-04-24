from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import *

# Build Spark session with Kafka JARs included
spark = SparkSession.builder \
    .appName("TrafficDataProcessor") \
    .config("spark.jars", 
            "/Users/jahnaviredrouthu/spark-sql-kafka-0-10_2.12-3.5.5.jar,"
            "/Users/jahnaviredrouthu/kafka-clients-3.5.5.jar,"
            "/Users/jahnaviredrouthu/commons-pool2-2.11.1.jar") \
    .getOrCreate()

# Define schema for the incoming data
schema = StructType([
    StructField("borough", StringType(), True),
    StructField("speed", DoubleType(), True),
    StructField("travel_time", DoubleType(), True),
    StructField("data_as_of", StringType(), True),
    StructField("linkid", StringType(), True),
    StructField("segmentid", StringType(), True)
])

# Read data from Kafka
df = spark.readStream.format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "traffic-topic") \
    .load()

# Parse the JSON data from Kafka
traffic_df = df.selectExpr("CAST(value AS STRING)").select(from_json(col("value"), schema).alias("data")).select("data.*")

# Output to console (for testing purposes)
query = traffic_df.writeStream \
    .format("console") \
    .start()

query.awaitTermination()
