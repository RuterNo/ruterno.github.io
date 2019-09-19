# Troubleshooting client

### Known situations and client fallbacks 
Listed below are situations that may occur and how these situations are indicated in busmonitor application.
#### Unable to establish connection to local mqtt-bridge
![Unable to establish connection](../assets/images/no_connection.png)

Note: dark blue background 

This means the client is unable to connect to the `ws://mqtt-broker:9883/mqtt` endpoint.
##### Checklist:
 1. Make sure the host `mqtt-broker` is pointing to the ip address of the mqtt bridge in your host file (for Unix based systems: `/etc/hosts`)
 2. Make sure the mqtt-broker is running and allows anonymous connections. Authentication to the remote mqtt-broker is done in your mqtt-bridge config.

#### No journey received
![Unable to establish connection](../assets/images/no_journey.png)

Note: dark black background 

This means the client has established a connection to the mqtt-broker, but at the point of time has not received a journey.
It may or have not received data on other topics. 

##### Checklist:
 1. Verify that the topics mappings in mqtt-bridge config are correct, 
    e.g. ```topic json in 1 infohub/dpi/journey/ operator_name/ruter/vehicle_id/itxpt/ota/dpi/journey/```
 2. Use a mqtt-client to subscribe to wildcard (`#`) in order to inspect incoming data and on which topics they are being sent.
  
#### dry-run journey
The journey qualifies as a dead-run when the public code of the line equals `0`.

![Unable to establish connection](../assets/images/dry_run.png)

