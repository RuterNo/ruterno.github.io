# OTA Messages
 
The OTA messages (short for "over-the-air" messages) are the payloads that flow back and forth between the operators vehicle (PTO) and Ruters
backend services (PTA). This could be vehicle location data, journey information, estimated arrivals and so on. 

The messages are encoded as json payloads, and you can validate any payload by using the corresponding JSON schema definition found in 
Ruters repositories.  

MQTT is used as the transport mechanism for all OTA messages. MQTT is a simple pub-sub based messaging protocol, that works on top of TCP/IP as well as on websockets. 


## Description of messages

### External documentation
Link to an external webpage describing all the OTA messages in detail:
* [OTA messages](https://ruterno.github.io/ota-schemas/mqtt/index.html)

### Audio message

| Field         | Value                                                   |
|---------------|---------------------------------------------------------|
| Name          | Audio message                                           |
| Local topic   | infohub/dpi/audio/json                                  |
| Central topic | <operatorId>/ruter/<vehicleId>/itxpt/ota/dpi/audio/json |

Topic used exclusively to transmit audio messages to be played by the speaker system. The audio messages may contain an array of sound bites, that are to be played in the sequence they have been received.  

#### Example payload
```{
     "eventTimestamp": "2017-10-31T08:38:02.749Z",
     "expiryTimestamp": "2017-10-31T08:38:47.749Z",
     "type": "ARRIVING",
     "ref": "RUT:StopPlace:03012453",
     "value": [
       {
         "encoding": "OPUS",
         "content": "ZkxhQwAAACIQABAAAAUJABtAA+gA8AB+W8FZndQvQAyjv...",
         "speaker": "PASSENGERS",
         "volume": 70
       },
       {
         "encoding": "MP3",
         "content": "ZkxhQwAAACIQABAAAAUJABtAA+gA8AB+W8FZndQvQAyjv...",
         "speaker": "DRIVER",
         "volume": 60
       },
       {
         "encoding": "MP3",
         "content": "ZkxhQwAAACIQABAAAAUJABtAA+gA8AB+W8FZndQvQAyjv...",
         "speaker": "EXTERNAL",
         "volume": 80
       }
     ]
   }

```
#### Fields
##### Header
| Name            | Type           |  Description                                              |
|-----------------|----------------|-----------------------------------------------------------|
| eventTimestamp  | string         | ISO 8601, UTC                                             |
| expiryTimestamp | string         | ISO 8601, UTC, audio should not be played after this time |
| type            | string         | Type of audio message                                     |
| ref             | string         | reference to what the audio is about                      |
| value           | array of Audio | one or more sound bits to be played in sequence           |

##### Audio
| Name     | Type   | Description                |
|----------|--------|----------------------------|
| encoding | string | enum Encoding              |
| content  | string | Base 64 encoded audio data |
| speaker  | string | enum of SpeakerType        |
| volume   | int    | 1-100                      |

##### Enum Encoding
| Name | Description                |
|------|----------------------------|
| OPUS | Opus Audio Codec (rfc6716) |
| MP3  | MP3 Codec                  |

##### Enum SpeakerType
| Name       | Prio | Description                                              |
|------------|------|----------------------------------------------------------|
| PASSENGERS | 1    | Internal speaker for passengers                          |
| DRIVER     | 2    | internal speaker for the driver only                     |
| EXTERNAL   | 3    | External speaker for announcements to waiting passengers |
Speaker types corresponds to the ITxPT-standard, S01v2.0.1_2017, Vehicle Installation Requirements Specification, side 32.

#### Volume levels
The table below describes the approximate volume levels the sound system should be producing both inside and outside of the vehicle. 

A message volume of 70 is what you should expect during normal operations. When adjusting the volume levels, your priority should be to best fit the volume level to the normal operation range. 
A volume level of 100 is only to be used in the event of an emergency situation. 

| Speaker    | Message volume | Decibel volume                                 |
|------------|----------------|------------------------------------------------|
| PASSENGERS | 70             | 70 – 73 dB, approximately 1 meter from speaker |
| PASSENGERS | 100            | max 90 dB, approximately 1 meter from speaker      |
| DRIVER     | 70             | 70 – 73 dB, approximately 1 meter from speaker |
| DRIVER     | 100            | max 90 dB, approximately 1 meter from speaker      |
| EXTERNAL   | 70             | 90 dB, approximately 1 meter from door 1       |
| EXTERNAL   | 100            | max 100 dB, approximately 1 meter from door 1      |

## JSON Schemas

Link to JSON schemas for all OTA payloads going back and forth between PTO and PTA:
* [OTA Message schemas](https://github.com/RuterNo/ota-schemas/tree/master/schemas/mqtt)

?> _Notice_ The schemas are of version 0.7 of the JSON Schema standard, which is still under development. For more information, see: 
[https://json-schema.org](https://json-schema.org/specification.html)

## Example payloads

Link to example OTA message payloads: 
* [OTA Message payloads](https://github.com/RuterNo/ota-schemas/tree/master/examples/mqtt)
