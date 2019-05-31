# OTA Messages
 
The OTA messages (short for "over-the-air" messages) are the payloads that flow back and forth between the operators vehicle (PTO) and Ruters
backend services (PTA). This could be vehicle location data, journey information, estimated arrivals and so on. 

The messages are encoded as json payloads, and you can validate any payload by using the corresponding JSON schema definition found in 
Ruters repositories.  

MQTT is used as the transport mechanism for all OTA messages. MQTT is a simple pub-sub based messaging protocol, that works on top of TCP/IP as well as on websockets. 


## Description of messages

Link to an external webpage describing all the OTA messages in detail:
* [OTA messages](https://ruterno.github.io/ota-schemas/mqtt/index.html)


## JSON Schemas

Link to JSON schemas for all OTA payloads going back and forth between PTO and PTA:
* [OTA Message schemas](https://github.com/RuterNo/ota-schemas/tree/master/schemas/mqtt)

?> _Notice_ The schemas are of version 0.7 of the JSON Schema standard, which is still under development. For more information, see: 
[https://json-schema.org](https://json-schema.org/specification.html)

## Example payloads

Link to example OTA message payloads: 
* [OTA Message payloads](https://github.com/RuterNo/ota-schemas/tree/master/examples/mqtt)
