# OTA Messages

**Version 2.3**
 
The OTA messages (short for "over-the-air" messages) are the payloads that flow back and forth between the operators vehicle (PTO) and Ruters
backend services (PTA). This could be vehicle location data, journey information, estimated arrivals and so on. 

The messages are encoded as json payloads, and you can validate any payload by using the corresponding JSON schema definition found in 
Ruters repositories.  

MQTT is used as the transport mechanism for all OTA messages. MQTT is a simple pub-sub based messaging protocol, that works on top of TCP/IP as well as on websockets. 

## Summary
The summary refers to topics on board the buses. See below for mapping of the local topic to the bridged topic.
Changes noted in status are based on a comparison with v1.1 of the OTA Messages document. Direction is in/out of the bus.

| Local topic                        | Change     | Direction   | Name                                                              | Comments                                                                                                                                                                                                  |
|------------------------------------|------------|-------------|-------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| signon/json                        |            | Out         | [Start block](#start-block)                                       |                                                                                                                                                                                                           |
| signoff/json                       |            | Out         | [Complete block](#complete-block)                                 |                                                                                                                                                                                                           |
| avl/json                           |            | Out         | [Vehicle position](#vehicle-position)                             |                                                                                                                                                                                                           |
| apc/+/json                         |            | Out         | [Passenger count](#passenger-count)                               | **"+"** is the placeholder for the door number                                                                                                                                                            |
| stopsignal/json                    |            | Out         | [Stop signal status](#stop-signal-status)                         | This signal does not exist in FMS and must be read directly from the electrical signal system on board                                                                                                    |
| telemetry/+/json                   |            | Out         | [Vehicle telemetry](#vehicle-telemetry)                           | **"+"** is the placeholder for an ID, such as PGN which is defined in the FMS standard; We specify which PGN or other telemetry data should be sent. **Used to be fmstoip but has now been generalized.** |
| infohub/dpi/diagnostics/json       |            | Out         | [Diagnostics for screens](#screen-diagnostics)                    | DPI diagnostics data to make sure the displays are set up correctly and are running as expected                                                                                                           |
| tsp/json                           |            | In          | [Signal prioritization](#signal-prioritization)                   | Message to be sent directly from the bus to facilitate signal priority at traffic lights                                                                                                                  |
| madt/notification/json             |            | In          | [Message to driver](#madt-notification)                           | Notification messages to driver. Produced by Ruters backoffice and consumed by MADT device on-board the vehicle.                                                                                          |
| infohub/dpi/journey/json           |            | In          | [Vehicle journey](#vehicle-journey)                               | Coordinates for the stop are now included; stopPointRef was changed to stopPlaceId in v. 1.1                                                                                                              |
| infohub/dpi/nextstop/json          |            | In          | [Next stop](#next-stop)                                           | stopPointRef was changed to stopPlaceId in v. 1.1                                                                                                                                                         |
| infohub/dpi/eta/json               |            | In          | [Estimated arrivals](#eta)                                        | The text for the time to be displayed on the screen is now included; stopPointRef was changed to stopPlaceId in v. 1.1                                                                                    |
| infohub/dpi/externaldisplay/json   |            | In          | [Information on sign box](#Information for external destination display)            |                                                                                                                                                                                                           |
| infohub/dpi/arriving/json          |            | In          | [Arriving](#arrival)                                              | Public announcement of the stop; adds expiryTimestamp and zoneId field; createTimestamp was deleted in v. 1.1                                                                                             |
| infohub/dpi/deviation/json         |            | In          | [Deviation](#deviation)                                           | Multi-lingual, textual deviation messages. With references to stops/journal/lines etc.                                                                                                                    |
| infohub/dpi/announcement/json      |            | In          | [Other announcement](#announcement)                               | Multi-lingual textual messages                                                                                                                                                                            |
| infohub/dpi/audio/json             |            | In          | [Audio message](#audio-message)                                   | Audio messages to be played on the bus. Can contain an array of messages with different target speakers and codecs.                                                                                       |
| infohub/dpi/c2/json                |            | In          | [DPI command and control messages](#command-and-controls-channel) | Command and control messages to be used by DPI, from Ruter backend.                                                                                                                                       |
| *infohub/dpi/connections/json*     |  **New**  | *In*        | [*Information about connections*](#connections)                   | *Real-time data for connections before arrival at the stop*                                                                                                                                               |
| *infohub/dpi/digitalsignage/json*  | *Planned*  | *In*        | [*Multimedia control*](#multimedia-control)                       | *Message that controls the multimedia surfaces on board*                                                                                                                                                  |

### Vehicle Id
Wherever the placeholder &lt;vehicleid&gt; is used below in MQTT topics it should be understood that the Vehicle
Identification Number (VIN) shall be substituted. A VIN is a world-wide standard, a unique identifier for all types of
vehicles defined by ISO 3779 and is a 17-character string.

### Sender and Recipient
Wherever the placeholders &lt;sender&gt; or &lt;recipient&gt; are used below in MQTT topic it should be understood that
the PTA-assigned PTO id (a string) shall be substituted.
Operator names are added as needed and they must be lower case.

## Description of messages

### Start block

| Field         | Value                                               |
|---------------|-----------------------------------------------------|
| Name          | Start block                                         |
| Local topic   | signon/json                                         |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/signon/json    |
| Schema        | signon.json                                         |

Notify PTA BO that the bus is starting a block.

#### Example payload 1
```json
{
   "eventTimestamp": "2019-05-04T15:03:10Z",
   "vehicleNumber": "E2345678901234567",
   "blockId": "3103",
   "vehicleJourneyId": "294"
}
```

#### Example payload 2
```json
{
   "eventTimestamp": "2019-10-09T05:19:22Z",
   "vehicleNumber": "E2345678901234567",
   "blockId": "1102-2019-10-09",
   "vehicleJourneyId": "1102-2019-10-09T07:12:00+02:00"
}
```

#### Example payload 3
```json
{
   "eventTimestamp": "2019-10-09T05:19:22Z",
   "vehicleNumber": "E2345678901234567",
    "blockId": "1102",
   "vehicleJourneyId": "1102-2019-10-09T07:12:00+02:00"
}
```

#### Example payload 4
```json
{
   "eventTimestamp": "2019-10-09T05:19:22Z",
   "vehicleNumber": "E2345678901234567",
    "blockId": "1102-2019-10-09",
   "vehicleJourneyId": "294"
}
```

#### Fields

| Name             | Type    | Description                                                                       |
|------------------|---------|-----------------------------------------------------------------------------------|
| eventTimestamp   | string  | ISO 8601, UTC                                                                     |
| vehicleNumber    | string  | Same as the &lt;vehicleid&gt; in the topic, a VIN                                 |
| blockId          | string  | A series of journeys. May be of the format `blockId`-`ISO 8601 start date`.       |
| vehicleJourneyId | string  | The actual journey started. May be of the format `blockId`-`ISO 8601 start time`. |

Vehicle journey is required and helps track cases where blocks are interrupted and replacement vehicles take over.

Start time must match the scheduled local time, and is therefore typically CE(S)T.

### Complete block 

| Field         | Value                                               |
|---------------|-----------------------------------------------------|
| Name          | Complete block                                      |
| Local topic   | signoff/json                                        |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/signoff/json   |
| Schema        | signon.json                                         |

Notify PTA BO that the bus has completed a block.

#### Fields

The content of signoff is the same as signon and uses the same schema.


### Vehicle position

| Field         | Value                                                     |
|---------------|-----------------------------------------------------------|
| Name          | Vehicle position                                          |
| Local topic   | avl/json                                                  |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/avl/json |
| Schema        | avl.json                                                  |

Reporting of the bus's position, course and speed to PTA BO.

#### Example payload
```json
{
   "eventTimestamp":"2017-10-31T12:45:50Z",
   "seqNumber":0,
   "latitude":60.25255,
   "longitude":11.0567,
   "heading":0.5,
   "speedOverGround":34.5,
   "signalQuality":"AGPS",
   "numberOfSatellites":4,
   "gnssType":"GPS",
   "gnssCoordinateSystem":"WGS84",
   "deadReckoning":false,
   "positionIsSimulated":false,
   "horizontalDilutionOfPrecision":1
}
```

#### Fields

| Name                 | Type    | Description                                                         |
|----------------------|---------|---------------------------------------------------------------------|
| eventTimestamp       | string  | ISO 8601, UTC                                                       |
| seqNumber            | integer | used to ensure that the messages are processed in the correct order |
| latitude             | float   |                                                                     |
| longitude            | float   |                                                                     |
| heading              | float   |                                                                     |
| speedOverGround      | float   |                                                                     |
| signalQuality        | string  | enum SignalQuality                                                  |
| numberOfSatellites   | integer |                                                                     |
| gnssType             | string  | enum GNSSType                                                       |
| gnssCoordinateSystem | string  | enum GNSSCoordinateSystem                                           |
| deadReckoning        | boolean |                                                                     |
| positionIsSimulated  | boolean | true when a block is simulated                                      |
| horizontalDilutionOfPrecision  | float | optional value for horizontal dilution of precision         |

#### Enum SignalQuality

| Name      | Description |
|-----------|-------------|
| AGPS      |             |
| DGPS      |             |
| ESTIMATED |             |
| GPS       |             |
| NOTVALID  |             |
| UNKNOWN   |             |

#### Enum GNSSType

| Name                | Description   |
|-------------------- |---------------|
| GPS                 |               |
| GLONASS             |               |
| GALILEO             |               |
| BEIDOU              |               |
| IRNSS               |               |
| OTHER               |               |
| DEADRECKONING       |               |
| MIXEDGNSSTYPES      |               |

#### Enum GNSSCoordinateSystem

| Name                  | Description   |
|-----------------------|---------------|
| WGS84                 |               |


### Passenger count

| Field         | Value                                               |
|---------------|-----------------------------------------------------|
| Name          | Passenger count                                     |
| Local topic   | apc/&lt;doorid&gt;/json                                         |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/apc/&lt;doorid&gt;/json  |
| Schema        | apc.json                                       |

Report of passenger count per door to PTA BO.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T12:45:50Z",
  "doorId": 1,
  "passengerCounting": [{
    "objectClass": "ADULT",
    "doorPassengerIn": 1,
    "doorPassengerOut": 1
  }, {
    "objectClass": "CHILD",
    "doorPassengerIn": 0,
    "doorPassengerOut": 0
  }, {
    "objectClass": "PRAM",
    "doorPassengerIn": 0,
    "doorPassengerOut": 0
  }, {
    "objectClass": "WHEELCHAIR",
    "doorPassengerIn": 0,
    "doorPassengerOut": 0
  }],
  "doorCountQuality": "REGULAR"
}
```

#### Fields

##### APC
| Name               | Type             | Description                        |
|--------------------|------------------|------------------------------------|
| eventTimestamp     | string           | ISO 8601, UTC                      |
| doorId             | integer          | Data is reported only per door     |
| passengerCounting  | PassengerCount[] | One PassengerCount per ObjectClass |
| doorCountQuality   | string           | enum CountQuality                  |

##### PassengerCount
| Name             | Type    | Description      |
|------------------|---------|------------------|
| objectClass      | string  | enum ObjectClass |
| doorPassengerIn  | integer |                  |
| doorPassengerOut | integer |                  |

#### Enum ObjectClass

| Name       | Description |
|------------|-------------|
| ABSENT     |             |
| ADULT      |             |
| CHILD      |             |
| PRAM       |             |
| BIKE       |             |
| WHEELCHAIR |             |
| OTHER      |             |

#### Enum CountQuality

| Name    | Description |
|---------|-------------|
| ABSENT  |             |
| REGULAR |             |
| DEFECT  |             |
| OTHER   |             |

### Stop signal status 

| Field         | Value                                                |
|---------------|------------------------------------------------------|
| Name          | Stop signal status                                   |
| Local topic   | stopsignal/json                                      |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/stopsignal/json |
| Schema        | stopsignal.json                                      |

This message should be produced whenever the stop signal is turned on or off.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T12:45:50Z",
  "stopSignalled": true
}
```

#### Fields

| Name           | Type    | Description   |
|----------------|---------|---------------|
| eventTimestamp | string  | ISO 8601, UTC |
| stopSignalled  | boolean |               |

### Vehicle telemetry

| Field         | Value                                                    |
|---------------|----------------------------------------------------------|
| Name          | Vehicle telemetry                                        |
| Local topic   | telemetry/&lt;id&gt;/json                                      |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/telemetry/&lt;id&gt;/json |
| Schema        | telemetry.json                                           |

Vehicle telemetry from systems on the bus.

Several different kinds of telemetry are available varying by vehicle type. For traditional busses, FMS is the standard defines what data about the vehicle is published on the FMS bus and out by FMStoIP. For trams VehicleToIP defines a a different and more limited set of data. In addition, electrical and hydrogen have proprietary data that is not captured by either.

This topic generalizes all such data as telemetry defined by a unique id. We will use FMS PGN ids (4-digit hex values) but otherwise use unique ids to identify data from other sources.

If we define the ids along the lines of FMS we can have 32-bit ids that use the following pattern:

| Bytes | Description                       |
|-------|-----------------------------------|
| 1     | Source identifier                 |
| 2-4   | Source-specific id, e.g. FMS PGNs |

Source identifiers will be:

| Id   | Description |
|------|-------------|
| 0x00 | FMS         |
| 0x01 | non-FMS     |
| ...  | new sources |

Therefore all FMS PGNs become "0000" + 4-digit hex PGN.

?> Learn more about the telemetry concept in [this wiki article](https://ruter.atlassian.net/wiki/spaces/TAAS/pages/106004500/Telemetry+concept).

#### FMS
Each of the available data points is defined with a Parameter Group Number (PGN) with fields defined by Suspect Parameter Number (SPN).

The FMS-to-IP service in the ITxPT standard makes the desired data available on the bus's own network over UDP (multicast broadcast). It sends out only the PGNs previously requested by calling a service. The messages are sent every second, according to ITxPT, and includes all the requested PGNs. The format is in XML.

We therefore define which PGNs are needed by Ruter and that the XML message should be broken up per PGN and forwarded as JSON.

#### FMS Parameter Group Number (PGN)
This is the list of required PGNs. It should be possible to expand this over time.

| Code | Description                      | PGN  | SPN                                                                       | Purpose               | ID       | Local topic             |
|------|----------------------------------|------|---------------------------------------------------------------------------|----------------------|----------|-------------------------|
| DC1  | Door Control 1                   | FE4E | 3411 Status 2 of doors <br> 1820 Ramp/Wheel chairlift <br> 1821 Position of doors   | Doors open / closed  | 0000FE4E | telemetry/0000fe4e/json |
| DC2  | Door Control 2                   | FDA5 | XXXX Lock Status Door N <br> XXXX Enable Status Door N <br> XXXX Open Status Door N | Alternative to DC1?  | 0000FDA5 | telemetry/0000fda5/json |
| VDHR | High Resolution Vehicle Distance | FEC1 | 917 High resolution total vehicle distance                                | Supplements position | 0000FEC1 | telemetry/0000fec1/json |

#### JSON format (MQTT)
The message containing several PGNs is split up into several MQTT messages. SPNs are mapped as subids.

**telemetry/0000fef1/json**
```json
{
  "eventTimestamp": "2017-10-31T12:45:50Z",
  "id": "0000FEF1",
  "payloads": [
    {
      "subid": 84,
      "name": "Wheel-Based Vehicle Speed",
      "unit": "km/h",
      "value": 55.3
    },
    {
      "subid": 597,
      "name": "Wheel-Based Vehicle Speed",
      "value": "released"
    }
  ]
}
```

**telemetry/0000f004/json**
```json
{
  "eventTimestamp": "2017-10-31T12:45:50Z",
  "id": "0000F004",
  "payloads": [
    {
      "subid": 190,
      "name": "Engine Speed",
      "unit": "rpm",
      "value": 854
    }
  ]
}
```

#### Fields

##### Telemetry
| Name           | Type      | Description                                     |
|----------------|-----------|-------------------------------------------------|
| eventTimestamp | string    | ISO 8601, UTC                                   |
| id             | string    | eight-digit hex value of the telemetry provided |
| payloads       | Payload[] | one or more payloads                            |

##### Payload
| Name  | Type   | Description                                  |
|-------|--------|----------------------------------------------|
| subid | int    | subid such as SPN, if appropriate (optional) |
| name  | string | optional                                     |
| unit  | string |                                              |
| value | any    |                                              |

### Screen diagnostics

| Field         | Value                                                     |
|---------------|-----------------------------------------------------------|
| Name          | Screen diagnostics                                        |
| Local topic   | infohub/dpi/diagnostics/json                              |
| Bridged topic | ruter/&lt;sender&gt;/&lt;vehicleid&gt;/itxpt/ota/dpi/diagnostics/json |
| Schema        | diagnostics.json                                          |

Report to PTA BO about a screen.

The DPI application itself produces diagnostic messages.
The payload is defined as an object with no pre-defined structure to provide flexibility. 

The types illustrated below are example of possible messages.
The types are under discussion but will be generated entirely by the DPI application and consumed by the PTA BO.

#### Example payload - STATUS
```json
{
    "eventTimestamp": "2019-10-09T05:19:22Z",
    "clientId": "5cc620d6-ef27-4c22-b632-498dcdda803a",
    "type": "STATUS",
    "payload": {
        "client": {
            "version": "2019-08-16T08-11-58Z",
            "display": "1",
            "lastLoaded": "2019-10-09T05:18:22Z"
        },
        "browser": {
            "protocol": "http:",
            "userAgent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36"
        },
        "logEntries": {
            "warning": 0,
            "error": 0
        }
    }
}
```

#### Example payload - HEARTBEAT
```json
{
    "eventTimestamp": "2019-10-09T10:16:07.000Z",
    "clientId": "638f47b7-d0d4-4043-9125-2dd8db6b8a84",
    "type": "HEARTBEAT",
    "payload": {
        "client": {
            "version": "2019-08-16T08-11-58Z",
            "display": "1",
            "windowHeight": 1080,
            "windowWidth": 1920		
        },
        "routeId": "RUT:Route:0-54012"
    }
}
```

#### Fields

| Name             | Type              | Description                                                            |
|------------------|-------------------|------------------------------------------------------------------------|
| eventTimestamp   | string            | ISO 8601, UTC                                                          |
| screenId         | string            | UUID produced and stored by the application per screen                 |
| type             | string            | message type, enum DiagnosticType                                      |
| payload          | dictionary of any | data with a blend possibly of standardized keys and PTA / PTO-specific |

##### Enum DiagnosticType


| Name             | Description                                                                               |
|------------------|-------------------------------------------------------------------------------------------|
| STATUS           | When the screen is turned on and the application application starts, this message is sent |
| HEARTBEAT        | A regular message that the screen is alive; frequency every minute.                      |

Other types of messages may be defined later.

### Signal prioritization  

| Field         | Value                                            |
|---------------|--------------------------------------------------|
| Name          | Signal prioritization                            |
| Local topic   | tsp/json                                         |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/tsp/json |
| Schema        | tsp.json                                         |

The message to be sent to VHF to ensure that the bus is prioritized at the traffic lights.
This message is generated by Ruter when approaching an intersection or, when a stop is just before an intersection, after the doors have closed.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "message": "000000FFFFFFF"
}
```

#### Fields

| Name           | Type   | Description                                                 |
|----------------|--------|-------------------------------------------------------------|
| eventTimestamp | string | ISO 8601, UTC                                               |
| message        | string | String of characters that represent the message to transmit |

### MADT notification

| Field         | Value                                                           |
|---------------|-----------------------------------------------------------------|
| Name          | Message to driver                                               |
| Local topic   | madt/notification/json                                          |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/madt/notification/json |
| Schema        | notification.json                                               |

Notification message sent to the MADT (Multi-Application Driver Terminal) device inside the bus. To be used to inform the bus driver from the Ruter backoffice.

The text message may contain the "Line Feed" character (\n), indicating line breaks. 

#### Example payload
```json
{
  "eventTimestamp": "2019-08-14T11:03:21.000Z",
  "urgency": "MEDIUM",
  "subject": "Pålogging feilet!",
  "content": "Pålogging på: \n\nBlockRef: 11029\nJourneyRef: 107\n\nfeilet! Vennligst prøv igjen, eller meld inn feilen til driftssentral om problemet er gjentagende."
}
```

#### Fields
##### Header
| Name            | Type           |  Description  |
|-----------------|----------------|---------------|
| eventTimestamp  | string         | ISO 8601, UTC |
| urgency         | string         | enum Urgency  |
| subject         | string         |               |
| content         | string         |               |

##### Enum Urgency
| Name      | Description |
|-----------|-------------|
| LOW       |             |
| MEDIUM    |             |
| HIGH      |             |

### Vehicle journey

| Field         | Value                                                    |
|---------------|----------------------------------------------------------|
| Name          | Vehicle journey                                          |
| Local topic   | infohub/dpi/journey/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/journey/json |
| Schema        | journey.json                                             |

The stops included in the bus route, with connections to other lines.
The coordinates of the stop have been added to facilitate backup calculations for stop announcements and possibly other messages.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "journeyId": "RUT:ServiceJourney:31-117215-13227462",
  "journeyRef": "31001-2019-02-17T21:55:00+01:00",
  "route": {
    "id": "RUT:Route:31-1041",
    "name": "Fornebu vest-Tonsenhagen",
    "line": {
      "id": "RUT:Line:31",
      "name": "Snarøya - Fornebu - Tonsenhagen - Grorud",
      "publicCode": "31"
    },
    "stopPlaces": [
      {
        "id": "RUT:StopPlace:02190017",
        "name": "Fornebu vest",
        "connections": [],
        "location": {
            "latitude": 12.33345,
            "longitude": 12.33345
        }
      },
      {
        "id": "RUT:StopPlace:03010013",
        "name": "Jernbanetorget",
        "connections": [
          {
            "line": {
              "id": "RUT:Line:30",
              "name": "Bygdøy via Bygdøynes",
              "publicCode": "30"
           },
           "type": "BUS",
           "color": "e60000"
         },
         {
           "line": {
             "id": "RUT:Line:12",
             "name": "Majorstuen",
             "publicCode": "12"
           },
           "type": "TRAM",
           "color": "0b91ef"
          }
        ],
        "location": {
            "latitude": 12.33345,
            "longitude": 12.33345
        }
      }
    ]
  }
}
```

#### Fields

##### Journey
| Name           | Type   | Description   |
|----------------|--------|---------------|
| eventTimestamp | string | ISO 8601, UTC |
| journeyId | string | Ruter's external journey id |
| journeyRef | string | Ruter's internal journey reference |
| route          | Route  |               |

##### Route
| Name       | Type        | Description |
|------------|-------------|-------------|
| id         | string      | NSR code    |
| name       | string      |             |
| line       | Line        |             |
| stopPlaces | StopPlace[] |             |

##### Line
| Name       | Type   | Description |
|------------|--------|-------------|
| id         | string | NSR code    |
| name       | string |             |
| publicCode | string |             |

##### StopPlace
| Name        | Type         | Description |
|-------------|--------------|-------------|
| id          | string       | NSR code    |
| name        | string       |             |
| connections | Connection[] |             |
| location    | Location     |             |

##### Connection
| Name   | Type   | Description                                                                                        |
|--------|--------|----------------------------------------------------------------------------------------------------|
| line   | Line   |                                                                                                    |
| type   | string | enum TransportType                                                                                 |
| colour | string | RGB code in hex; originally spelled color, but British spelling is preferred in European standards |

##### Location
| Name      | Type  | Description |
|-----------|-------|-------------|
| longitude | float |             |
| latitude  | float |             |

##### Enum TransportType
| Name  | Description                        |
|-------|------------------------------------|
| BUS   | This was originally listed as BUSS |
| TRAM  |                                    |
| METRO |                                    |
| TRAIN |                                    |
| BOAT  |                                    |
| OTHER |                                    |

### Next stop 

| Field         | Value                                                     |
|---------------|-----------------------------------------------------------|
| Name          | Next stop                                                 |
| Local topic   | infohub/dpi/nextstop/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/nextstop/json |
| Schema        | nextstop.json                                             |

Next stop on the bus's route after leaving a stop.
StopPointRef was replaced by StopPlaceId in v. 1.1.

#### Example payload
```json
{
    "eventTimestamp": "2017-10-31T08:38:02.749Z",
    "stopPlaceId": "RUT:StopPlace:03012453",
    "index": 10
}
```

#### Fields

| Name           | Type    | Description        |
|----------------|---------|--------------------|
| eventTimestamp | string  | ISO 8601, UTC      |
| stopPlaceId    | string  | NSR StopPlace code |
| index          | integer | Index of stop place in journey data |

### ETA

| Field         | Value                                                |
|---------------|------------------------------------------------------|
| Name          | ETA                                                  |
| Local topic   | infohub/dpi/eta/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/eta/json |
| Schema        | eta.json                                             |

Estimated arrival at the remaining stops.
StopPointRef was replaced by StopPlaceId in v. 1.1. The field "text" was added to send the desired display text for the arrival time.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "estimatedCalls": [
    {
      "eta": "2017-10-13T12:27:04Z",
      "stopPlaceId": "RUT:StopPlace:03010510",
      "text": "Nå"
      },
    {
      "eta": "2017-10-13T12:27:04Z",
      "stopPlaceId": "RUT:StopPlace:03010511",
      "text": "5 min"
      }
    ]
}
```

#### Fields

| Name           | Type            | Description   |
|----------------|-----------------|---------------|
| eventTimestamp | string          | ISO 8601, UTC |
| estimatedCalls | EstimatedCall[] |               |

##### EstimatedCall
| Name        | Type   | Description                 |
|-------------|--------|-----------------------------|
| eta         | string | ISO 8601, UTC               |
| stopPlaceId | string | NSR StopPlace code          |
| text        | string | display text for passengers |

### Information for external destination display 

| Field         | Value                                                            |
|---------------|------------------------------------------------------------------|
| Name          | Information for external destination display                     |
| Local topic   | infohub/dpi/externaldisplay/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/externaldisplay/json |
| Schema        | externaldisplay.json                                             |

Message to be shown on the external destination display. Usually line number (publicCode) and routeName, with support for alternative message. 

>Note: external destination displays have previously been referred to as "sign boxes".

#### Example payload
```json
{
   "eventTimestamp": "2017-10-31T08:38:02.749Z",
   "publicCode": "31",
   "destination": "Bygdøy",
   "alternativeMessage": "Via Rådhusplassen"
}
```

#### Fields

| Name               | Type   | Description                                                                        |
|--------------------|--------|------------------------------------------------------------------------------------|
| eventTimestamp     | string | ISO 8601, UTC                                                                      |
| publicCode         | string | Publicly known bus, tram or subway line number                                     |
| destination        | string | Final stop or explicitly set destination text                                      |
| alternativeMessage | string | Second line of sign used for via or other supplementary information when available (optional) |

### Arrival

| Field         | Value                                                     |
|---------------|-----------------------------------------------------------|
| Name          | Arrival                                                   |
| Local topic   | infohub/dpi/arriving/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/arriving/json |
| Schema        | arriving.json                                             |

Notice to passengers that the bus is approaching a stop.
StopPointRef was replaced by StopPlaceId in v. 1.1. The field createTimestamp was removed in v. 1.1. Multi-lingual suoport added in v.1.2

The field expiryTimestamp has been added to to prevent delayed messages from being played after a certain amount of time. 

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "expiryTimestamp": "2017-10-31T08:38:47.749Z",
  "ref": "RUT:StopPlace:03012453",
  "zoneId": "2b-vest",
  "message": {
    "no": {
      "title": "Ankommer",
      "text": "Oslo sentralstasjon"
    },
    "en": {
      "title": "Arriving at",
      "text": "Oslo Central Station"
    }
  }
}
```

#### Fields

| Name             | Type                              | Description              |
|------------------|-----------------------------------|--------------------------|
| eventTimestamp   | string                            | ISO 8601, UTC            |
| expiryTimestamp  | string                            | ISO 8601, UTC, audio should not be played after this time |
| ref              | string                            | reference to StopPlaceId |
| zoneId           | string                            | Id of payment zone (optional)      |
| message          | dictionary of MultilingualMessage |                          |

#### MultilingualMessage

| Name               | Type                                | Description                                  |
|--------------------|-------------------------------------|----------------------------------------------|
| title              | string                              | title to be displayed to passengers (optional) |
| text               | string                              | text to be displayed to passengers             |

### Deviation

| Field         | Value                                                      |
|---------------|------------------------------------------------------------|
| Name          | Deviation                                                  |
| Local topic   | infohub/dpi/deviation/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/deviation/json |
| Schema        | deviation.json                                             |

Notice to passengers of a deviation.

The ref field has been added to specify the scope of the deviation. This should be an NSR ID (where the type is included in the ID) such as StopPlaceId, QuayId, LineId, RouteId, JourneyId, OperatorId or AuthorityId. It is possible additional identifiers may be included.

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "expiryTimestamp": "2017-10-31T08:38:47.749Z",
  "ref": [
    "NSR:StopPlace:2561",
    "NSR:StopPlace:2562"
  ],
  "message": {
    "no": {
      "title": "afsdf",
      "text": "Lorem ipsum dolor sit amet"
    },
    "en": {
      "title": "afsdf",
      "text": "Lorem ipsum dolor sit amet"
    }
  }
}
```

#### Fields

| Name             | Type                              | Description                                                                  |
|------------------|-----------------------------------|------------------------------------------------------------------------------|
| eventTimestamp   | string                            | ISO 8601, UTC                                                                |
| expiryTimestamp  | string                            | ISO 8601, UTC, do not show after                                             |
| ref              | string or string[]                | List of affected entities, if empty or not included the deviation is general |
| message          | dictionary of MultilingualMessage |                                                                              |

Responsibility for the use of the ref field lies entirely with the DPI application. When it has matching ids it can tailor the information display accordingly. An example of this is stopPlaceId deviations.

##### MultilingualMessage

| Name             | Type     | Description                                        |
|------------------|----------|----------------------------------------------------|
| title            | string   | title to be displayed to the passengers (optional) |
| text             | string   | text to be displayed to the passengers             |

### Announcement

| Field         | Value                                                         |
|---------------|---------------------------------------------------------------|
| Name          | Announcement                                                  |
| Local topic   | infohub/dpi/announcement/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/announcement/json |
| Schema        | announcement.json                                             |

Announcement to the passengers (ad hoc).
Message contains a reference to the scope of the message, if applicable. Typically NSR stopplaceid / lineId or similar. 

#### Example payload
```json
{
  "eventTimestamp": "2017-10-31T08:38:02.749Z",
  "expiryTimestamp": "2017-10-31T08:38:47.749Z",
  "type": "INFO",
  "ref": [
    "NSR:StopPlace:2561",
    "NSR:StopPlace:2562"
  ],
  "message": {
    "no": {
      "title": "afsdf",
      "text": "Lorem ipsum dolor sit amet"
    },
    "en": {
      "title": "afsdf",
      "text": "Lorem ipsum dolor sit amet"
    }
  }
}
```

#### Fields

| Name             | Type                              | Description                                                                                                                   |
|------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| eventTimestamp   | string                            | ISO 8601, UTC                                                                                                                 |
| expiryTimestamp  | string                            | ISO 8601, UTC                                                                                                                 |
| type             | string                            | Message type, may affect DPI display                                                                                          |
| ref              | string or string[]                | Ids of type StopPlace, Line, Route, VehicleJourney, etc. Used to associate deviations with specific scopes, optional           |
| message          | dictionary of MultilingualMessage | Key is ISO 639-1 language code.                                                                                               |

##### MultilingualMessage

| Name             | Type     | Description                                        |
|------------------|----------|----------------------------------------------------|
| title            | string   | title to be displayed to the passengers (optional) |
| text             | string   | text to be displayed to the passengers             |

### Audio message

| Field         | Value                                                   |
|---------------|---------------------------------------------------------|
| Name          | Audio message                                           |
| Local topic   | infohub/dpi/audio/json                                  |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/audio/json |
| Schema        | audio.json                                              |

Topic used exclusively to transmit audio messages to be played by the speaker system. The audio messages may contain an array of sound bites, that are to be played in the sequence they have been received.  

#### Example payload
```json
{
     "eventTimestamp": "2017-10-31T08:38:02.749Z",
     "expiryTimestamp": "2017-10-31T08:38:47.749Z",
     "type": "ARRIVING",
     "ref": "NSR:StopPlace:4384",
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
| value           | Audio[]        | one or more sound bits to be played in sequence           |

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
| Name       | Priority | Description                                              |
|------------|----------|----------------------------------------------------------|
| PASSENGERS | 1        | Internal speaker for passengers                          |
| DRIVER     | 2        | internal speaker for the driver only                     |
| EXTERNAL   | 3        | External speaker for announcements to waiting passengers |

Speaker types corresponds to the ITxPT-standard, S01v2.0.1_2017, Vehicle Installation Requirements Specification, page 32.

#### Decibel levels
The table below describes the approximate decibel levels the sound system should be producing both inside and outside of the vehicle. 

A message volume of 70 is what you should expect during normal operations. When adjusting the decibel levels, your priority should be to best fit the decibel level to the normal operation range. 
A message volume level of 100 is only to be used in the event of an emergency situation. 

| Speaker    | Message volume | Decibel volume                                 |
|------------|----------------|------------------------------------------------|
| PASSENGERS | 70             | 70 – 73 dB, approximately 1 meter from speaker |
| PASSENGERS | 100            | max 90 dB, approximately 1 meter from speaker  |
| DRIVER     | 70             | 70 – 73 dB, approximately 1 meter from speaker |
| DRIVER     | 100            | max 90 dB, approximately 1 meter from speaker  |
| EXTERNAL   | 70             | 90 dB, approximately 1 meter from door 1       |
| EXTERNAL   | 100            | max 100 dB, approximately 1 meter from door 1  |

### Command and controls channel

| Field         | Value                                            |
|---------------|--------------------------------------------------|
| Name          | Command and controls channel                     |
| Local topic   | infohub/dpi/c2/json                              |
| Bridged topic | ruter/&lt;recipient&gt;/&lt;vehicleid&gt;/itxpt/ota/dpi/c2/json |
| Schema        | c2.json                                          |

Command and control messages from Ruter Data Platform.

The c2 channels is reserved for command and control messages originated by Ruter. Typical use cases include: 

- Diagnostics / debugging
 - Trigger transfer of debug information
 - Trigger screenshot of DPI screen
 - Trigger clearing of cache and refresh of webpage
- Content
 - Trigger display of campaign

The payload is defined as an object with no structure to provide flexibility. 

#### Example payload - DEBUG
```json
{
  "eventTimestamp": "2018-10-31T12:45:50Z",
  "type": "DEBUG",
  "payload": {
    "command": "LOG_TRANSFER",
    "arg": {
      "level": "ERROR",
      "limit": 10,
      "page": 0
    }
  }
}
```

#### Example payload - SET_ITEM
```json
{
  "eventTimestamp": "2018-10-31T12:45:50Z",
  "type": "WORKER_JOB",
  "payload": {
    "command": "SET_ITEM",
    "arg": {
      "name": "enableFeatureX",
      "value": true
    }
  }
}
```

#### Fields

| Name             | Type     | Description     |
|------------------|----------|-----------------|
| eventTimestamp   | string   | ISO 8601, UTC   |
| type             | string   | message type    |
| payload          | Object   |                 |

### Connections

| Field         | Value                                                        |
|---------------|--------------------------------------------------------------|
| Name          | Connections                                                  |
| Local topic   | infohub/dpi/connections/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/connections/json |
| Schema        | connections.json                                             |

List of connections for the remaining stops on a journey with expected departures.

#### Example payload
```json
{
    "eventTimestamp": "2020-03-16T14:30:08.762206Z",
    "expiryTimestamp": "2020-03-16T14:35:08.762206Z",
    "nextStop": {
        "stopPlaceId": "NSR:StopPlace:6498",
        "quayId": "NSR:Quay:11950"
    },
    "journeyId": "RUT:ServiceJourney:60-138542-15631728",
    "routeId": "RUT:Route:60-4",
    "calls": [
        {
            "name": "Tøyenkirken",
            "stopPlaceId": "NSR:StopPlace:6498",
            "quayId": "NSR:Quay:11950",
            "index": 4,
            "connections": []
        },
        {
            "name": "Tøyen skole",
            "stopPlaceId": "NSR:StopPlace:6480",
            "quayId": "NSR:Quay:11910",
            "index": 5,
            "connections": []
        },
        {
            "name": "Tøyen",
            "stopPlaceId": "NSR:StopPlace:6478",
            "quayId": "NSR:Quay:11908",
            "index": 6,
            "connections": [
                {
                    "line": {
                        "id": "RUT:Line:20",
                        "publicCode": "20",
                        "transportMode": "bus"
                    },
                    "direction": "1",
                    "departures": [
                        {
                            "destination": "Galgeberg",
                            "text": "5 min",
                            "departureTime": "2020-03-16T14:35:37Z",
                            "delay": "PT1M37S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685688"
                        },
                        {
                            "destination": "Galgeberg",
                            "text": "10 min",
                            "departureTime": "2020-03-16T14:40:58Z",
                            "delay": "PT1M58S",
                            "journeyId": "RUT:ServiceJourney:20-131531-15685689"
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### Fields
##### Header
| Name            | Type           |  Description                                                |
|-----------------|----------------|-------------------------------------------------------------|
| eventTimestamp  | string         | ISO 8601, UTC                                               |
| expiryTimestamp | string         | ISO 8601, UTC, audio should not be played after this time   |
| nextStop        | NextStop       | Description of trigger for the message (NextStopId, QuayId) |
| journeyId       | string         | journey for which the message is valid                      |
| routeId         | string         | route for which the message is valid                        |
| calls           | array of Call  | list of future calls (stops) for which connections are provided |

##### Call
| Name            | Type               |  Description                                              |
|-----------------|--------------------|-----------------------------------------------------------|
| line            | string             | optional name of stop place                               |
| direction       | string             | NSR stop place id of the call                             |
| quayId          | string             | NSR quay id of the call                                   |
| index           | int                | index of call in journey message                          |
| connections     | array of Connecton | list of connections currently available at stop           |

##### Connection
| Name            | Type               |  Description                                              |
|-----------------|--------------------|-----------------------------------------------------------|
| line            | Line               | Description of the connecting line                        |
| direction       | string             | Arbitrary indicator of direction, usually 1 or 2          |
| departures      | array of Departure | NSR quay id of the call                                   |

##### Line
| Name            | Type               |  Description                                              |
|-----------------|--------------------|-----------------------------------------------------------|
| id              | string             | Ruter id for line in RUT:Line:nn format                   |
| publicCode      | string             | code used to idenity quay to the public                   |
| transportMode   | string             | bus, metro, tram, rail, water                             |

##### Departure
| Name            | Type               |  Description                                              |
|-----------------|--------------------|-----------------------------------------------------------|
| destination     | string             | Destination on external signage                           |
| via             | string             | Optional secondary destination text                       |
| text            | text               | Human-readable format for departure time                  |
| departureTime   | text               | Optional departure time in ISO 8601, UTC                  |
| delay           | text               | Optional delay in ISO 8601 duration format                |
| journeyId       | text               | Optional journey id                                       |

## Planned messages

### Multimedia control

| Field         | Value                                                           |
|---------------|-----------------------------------------------------------------|
| Name          | Multimedia control                                              |
| Local topic   | infohub/dpi/digitalsignage/json                                 |
| Bridged topic | &lt;recipient&gt;/ruter/&lt;vehicleid&gt;/itxpt/ota/dpi/digitalsignage/json |
| Schema        | digitalsignage.json                                             |

Change what appears on the target surfaces of the screens.
When we begin to deliver packages of media to the buses, for example, in connection with campaigns, we must be able to trigger playlists as needed, for example at a stop, a time, etc.

## Summary of changes

### Version 2.3
**Publication Date**: 05 May 2020

| Category          | Topic                                                                   | Description                                                                                                           |
|-------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| added field       | infohub/dpi/journey/json                                           | added field journeyId - Ruter's external journey id                           |
| added field       | infohub/dpi/journey/json                                           | added field journeyRef - Ruter's internal journey reference                         |

### Version 2.2
**Publication Date**: 15 Apr 2020

| Category          | Topic                                                                   | Description                                                                                                           |
|-------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| added topic       | infohub/dpi/connections/json                                            | promoted connections from planned to implemented, and provided documentation of the topic                             |


### Version 2.1

This page currently contains version 2.1 of the specification.

| Category          | Topic                                                                   | Description                                                                                                           |
|-------------------|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| added field       | infohub/dpi/journey/json                                                | added location (latitude and longitude) per stop place                                                                |
| added field       | infohub/dpi/eta/json                                                    | the field `text` has been added for display text in DPI                                                               |
| changed field     | infohub/dpi/eta/json                                                    | the field `expectedArrivalTime` has been renamed `eta`                                                                    |
| changed field     | infohub/dpi/externaldisplay/json                                        | the field `routeName` has been renamed `destination`                                                                      |
| removed field     | infohub/dpi/arriving/json                                               | audio has been removed; see new audio/json topic                                                                      |
| changed field     | infohub/dpi/arriving/json                                               | the field `message` was made multilingual                                                                               |
| added field       | infohub/dpi/arriving/json                                               | the field `zoneId` was added to support the sales system                                                                |
| removed field     | infohub/dpi/deviation/json                                              | audio has been removed; see new audio/json topic                                                                      |
| changed field     | infohub/dpi/deviation/json                                              | the field `message` was made multilingual                                                                               |
| added field       | infohub/dpi/deviation/json                                              | the field `ref` was added to indicate what the deviation affects                                                        |
| removed field     | infohub/dpi/announcement/json                                           | audio has been removed; see new audio/json topic                                                                      |
| changed field     | infohub/dpi/announcement/json                                           | the field `message` was made multilingual                                                                               |
| added field       | infohub/dpi/announcement/json                                           | the field `ref` was added to indicate what the deviation affects                                                        |
| added field       | infohub/dpi/announcement/json                                           | the field `type` was added to support DPI needs                                                                         |
| new topic         | stopsignal/json                                                         | new topic for stop signal status when changed by using stop button                                                    |
| new topic         | telemetry/+/json                                                        | new topic for vehicle telemetry from systems on the bus, including FMS data                                           |
| new topic         | tsp/json                                                                | new topic for traffic signal pre-emption message                                                                      |
| new topic         | infohub/dpi/audio/json                                                  | new topic on which **all audio** will be sent                                                                         |
| new topic         | infohub/dpi/c2/json                                                     | new topic to send commands to DPI application                                                                         |
| new topic         | infohub/dpi/diagnostic/json                                             | used by DPI only to send diagnostic info to BO                                                                        |
| added field       | avl/json                                                                | added optional `horizontalDilutionOfPrecision` to align with ITxPT                                                      |
| changed field     | avl/json                                                                | changed enum values of `gnssCoordinateSystem` to only allow WGS84. No other coordinate systems are allowed.             |
| changed field     | avl/json                                                                | changed enum values of `signalQuality` to remove redundant suffix `_QUALITY` and align with ITxPT                       |
| changed field     | avl/json                                                                | changed enum values of `gnssType` to align with naming in ITxPT                                                         |
| documentation     | stopsignal/json                                                         | state explicitly that stop signal messages should also be sent when the signal is turned off.                         |
| documentation     | telemetry/json                                                          | some extraneous detail about FMS-to-IP has been removed.                                                              |
| documentation     | vehicle id                                                              | defined vehicle id as VIN                                                                                             |
| documentation     | sender and recipient                                                    | defined sender and recipient as PTO id assigned by PTA                                                                |
| documentation     | tsp/json                                                                | added example of encoded value                                                                                        |
| documentation     | infohub/dpi/externaldisplay/json                                        | make clear that `alternativeText` will be used and is intended for the second line of the display. Example was updated. |
| schema correction | infohub/dpi/journey/json                                                | `routeChangeTimestamp` is not required                                                                                  |
| schema correction | infohub/dpi/audio/json                                                  | enum for encoding type should contain only MP3 and OPUS                                                               |
| schema correction | infohub/dpi/arriving/json                                               | add `addtionalProperties: false` to correctly support multi-lingual messages                                          |
| documentation     | tsp/json                                                                | Name was corrected from `encodedMessage` to `message` to conform with schema                                              |
| documentation     | telemetry/json                                                          | Added link to more information on Ruter’s external wiki                                                               |

In version 2.0.1 we specify that &lt;vehicleid&gt; shall be understood to be the vehicle's VIN and
&lt;sender&gt;/&lt;recipient&gt; are the id for PTO assigned by PTA.

## JSON Schemas

Link to JSON schemas for all OTA payloads going back and forth between PTO and PTA:
* [OTA Message schemas](https://github.com/RuterNo/ota-schemas/tree/master/schemas/mqtt)

?> _Notice_ The schemas are of version 0.7 of the JSON Schema standard, which is still under development. For more information, see: 
[https://json-schema.org](https://json-schema.org/specification.html)

## Example payloads

Link to example OTA message payloads: 
* [OTA Message payloads](https://github.com/RuterNo/ota-schemas/tree/master/examples/mqtt)
