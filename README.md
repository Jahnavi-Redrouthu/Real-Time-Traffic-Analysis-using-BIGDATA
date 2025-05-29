kafka_2.13-3.7.2 is needed to run kafka

Go to that path and run the below commands one after other in two different tabs:

bin/zookeeper-server-start.sh config/zookeeper.properties
bin/kafka-server-start.sh config/server.properties

nc -vz localhost 9092


————————————————————————
For PIP :
python3 -m venv path/to/venv
source path/to/venv/bin/activate

deactivate
———————————————————————
To create topic:
>uuidgen

>bin/kafka-storage.sh format -t AB8ECA52-90AC-4A89-859A-077D00D4A570 -c config/kraft/server.properties

And then start 
>bin/kafka-server-start.sh config/server.properties

New terminal tab :
>bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --topic traffic-topic --partitions 1 --replication-factor 1

> bin/kafka-topics.sh --list --bootstrap-server localhost:9092

traffic-topic

Or 
>./bin/kafka-topics.sh --list --bootstrap-server localhost:9092

TO RUN SPARK:
spark-submit --packages org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2 spark_streaming.py
