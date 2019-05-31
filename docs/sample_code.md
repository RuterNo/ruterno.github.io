# Sample code

## Web application for OTA Schemas

This sample project is a standalone HTML application that contains all its resources locally. 
Simply point to the index.html file to run.

It tries to connect to an MQTT broker with the hard-coded name mqtt-broker, which is expected on board busses.

It monitors all topics on the broker and for topics that are known and have schemas, it will validate 
the content of the messages and record statistics.

- [Sample Web Application for OTA Schemas](https://github.com/RuterNo/ota-schemas/tree/master/code/web)
