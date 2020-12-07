# TSP Messages

**Version 0.1**

The TSP messages (Transit Signal Priority) are used to communicate with BYMs signal priority solution.

The messages are encoded as json payloads, and you can validate any payload by using the corresponding JSON schema 
definition found in the corresponding [JSON schema repository](#json-schemas).

MQTT is used as the transport mechanism for all TSP messages. MQTT is a simple pub-sub based messaging protocol, that 
works on top of TCP/IP as well as on websockets.

## Summary
The following is a summary of the messages

| Local topic                        | Change     | Receiver    | Name                                     | Comments                                                                                                                                                                                                  |
|------------------------------------|------------|-------------|------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| bym/ruter/[vehicleRef]/vm          |-           | BYM         | [Vehicle monitoring](#Vehicle-monitoring)  |                                                                                                                                                                                                           |
| bym/ruter/[vehicleRef]/journey     |-           | BYM         | [Journey](#Journey)                      |                                                                                                                                                                                                           |
| ruter/bym/[vehicleRef]/tspack      |-           | Ruter       | [TSP ack](#TSP-ack)                       |                                                                                                                                                                                                           |

## Description of messages

### Vehicle monitoring

| Name          | Vehicle monitoring                                   |
|---------------|-----------------------------------------------------|
| topic         | bym/ruter/[vehicleRef]/vm                           |
| qos           | 0                                                   |
| retained      | false                                               |
| frequency     | approx. 1/sec per vehicle                           |
| Schema        | vehiclemonitoring.json                              |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| journeyPatternRef   | string  | Reference to the journey pattern the vehicle is currently driving.|
| quayRef	          | string  | Reference to the quay that the vehicle is currently at or driving towards.|
| order               | integer | The order of the quay that the vehicle is currently at or driving towards|
| position            | geoJson | cordinates of the vehicle, as defined by GeoJson type Point: [longitude, latitude]|
| distanceMeter	      | number  | The distance driven towards the quay that the vehicle is currently at or driving towards. Note: approximate if odometer is missing|
| occupancyPercent    | integer | The occupancy of the bus delivered in percent.|
| delaySeconds        | integer | The current delay of the vehicle compared to the plan|
| doorsOpen           | boolean | true if one or more doors are open|

#### Example payload
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "journeyPatternRef": "RUT:JourneyPattern:123",
  "quayRef": "NSR:Quay:123",
  "order": 1,
  "distanceMeter": 32.5,
  "position": [10.7522, 59.9139],
  "delaySeconds": -10,
  "doorsOpen": false
}
```

### Journey

| Name          | Journey                                             |
|---------------|-----------------------------------------------------|
| topic         | bym/ruter/[vehicleRef]/journey                      |
| qos           | 1                                                   |
| retained      | true                                                |
| frequency     | approx. 1/hour per vehicle                          |
| Schema        | journey.json                                        |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| journeyPatternRef   | string  | Reference to the journey pattern the vehicle is currently driving.|
| line  	          | string  | Line number|
| journeyPattern      | array   | Array of Links (see below) The complete journeyPattern the vehicle is to drive |

##### Link
| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| order               | integer | The order of the stop|
| quayRef             | string  | Reference to the quay of the stop|
| lineString          | geoJson | coordinates as the field is defined in GeoJSON LineString. May be empty|

#### Example payload
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "journeyPatternRef": "RUT:JourneyPattern:123",
  "line": "36E",
  "journeyPattern": [
    {
      "order": 1,
      "quayRef": "NSR:Quay:123",
      "lineString": []
    },
    {
      "order": 2,
      "quayRef": "NSR:Quay:1234",
      "lineString": [[10.7522, 59.9139], [10.7522, 59.9139]]
    }
  ]
}
```

### TSP ack

| Name          | TSP ack                                             |
|---------------|-----------------------------------------------------|
| topic         | ruter/bym/[vehicleRef]/tspack                       |
| qos           | 0                                                   |
| retained      | false                                               |
| frequency     | approx. 1/min per vehicle?                          |
| Schema        | tspack.json                                         |

#### Fields

| Name                | Type    | Description                                                                       |
|---------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp      | string  | Timestamp of the event that triggered this message. ISO 8601 UTC.|
| publishedTimestamp  | string  | Timestamp close to when the message was generated. ISO 8601 UTC. |
| traceId             | string  | trace-id of this message. UUID. |
| vehicleRef          | string  | Reference of the vehicle. 17-character VIN or 8 character number.|
| signalRef           | string  | Reference to the signal that was triggered|
| signalName          | string  | Name of the signal/crossroads|
| signalPosition      | geoJson | Coordinates of the signal that was triggered, as defined by GeoJson type Point: [longitude, latitude]|
| priorityLevel       | string  | What priority was given|

#### Example payload
```json
{
  "eventTimestamp": "2019-10-15T09:06:10.285218Z",
  "publishedTimestamp": "2019-10-15T09:06:15.285218Z",
  "traceId": "40634dfc-b8bc-44b5-9353-161ac0b0e80b",
  "vehicleRef": "XYZ0123X0X0123456",
  "signalRef":  "?",
  "signalName":  "?",
  "signalPosition": [10.7522, 59.9139],
  "priorityLevel": "?"
}
```

## JSON Schemas

Link to JSON schemas and examples for all messages:
* [TSP MQTT schemas](https://github.com/RuterNo/tsp-mqtt-schemas)

_Notice_ The schemas are of version 0.7 of the JSON Schema standard, which is still under development. For more information, see:
[https://json-schema.org](https://json-schema.org/specification.html)
