# DPI Bus Monitor Screen Configuration

DPI Bus-monitor supports a range of pre-defined display types depending on size of the screen, screen location and functional needs.
These screens are accessible directly through a URL with following schema: `{BaseURL}/app/#display/{type}`, eg. `http://webserver.local/app/#display/1`.

## Overview of screen types

| Id       | Content                                  | Aspect ratio | Optimal screen resolution (width x height) | Vehicle type   |
| -------- | ---------------------------------------- | ------------ | ------------------------------------------ | -------------- |
| 1        | Vertical journey, Public Announcement    | 32:9         | 1920x540                                   | Bus            |
| 2        | Horizontal journey                       | 48:9         | 1920x360                                   | Bus            |
| 3        | Vertical journey                         | 16:9         | 1920x1080, 960x540                         | Bus            |
| 4        | Vertical journey / Public Announcement   | 16:9         | 1920x1080, 960x540                         | Bus            |
| 5        | Vertical journey                         | 32:9         | 1920x540                                   | Bus            |
| t2-left  | Horizontal journey                       | 1920:197     | 1920x197                                   | Tram (SL18)    |
| t2-right | Horizontal journey (reverse)             | 1920:197     | 1920x197                                   | Tram (SL18)    |
| t3       | Next stop / destination                  | 128:9        | 1920x285                                   | Tram (SL18)    |
| b1       | Vertical journey                         | 16:9         | 1920x1080                                  | Ferry (Boreal) |
| b2       | Next stop, sensors / Public Announcement | 16:9         | 1920x1080                                  | Ferry (Boreal) |

\* These are approx. values and subject to change.

## Distribution channels

Additionally, for public announcements, it is possible to target specific screens by which channels they subscribe to. You define which channels to subscribe to in the URL with following schema:
`{BaseURL}/app/#display/{type}?channels=channel_name[filter_key}=filter_value,additional_channel_name`.

### Short platform

- t2-left: `{BaseURL}/app/#display/t2-left?channels=short_platform[active_cab]=c1`
- t2-right: `{BaseURL}/app/#display/t2-right?channels=short_platform[active_cab]=c1`

Keep in mind that the keys and values are case-sensitive.

Supported filters are:

| Key        | Possible values  |
| ---------- | ---------------- |
| active_cab | c1, c2, inactive |

## Screen configurations for bus (TaaS vehicles)

### Screen config 1

![Running state](../../assets/images/client/config/config-1-1.png)
![Running state](../../assets/images/client/config/config-1-1-2.png)

Running state of config 1, displaying journey (50% of the width) and additional information (fallback, when no public announcements\* are showing).

This is the only configuration used for 32:9, and _all_ 32:9 screens must be configured to use this configuration.

![Media](../../assets/images/client/config/config-1-2.png)

Config 1 showing an example of public announcement.

\*The public announcements are either html campaigns, texts, video and images.

### Screen config 2

![Running state](../../assets/images/client/config/config-2-1.png)

Running state of config 2.
This is the only configuration used for 48:9, and _all_ 48:9 screens must be configured to use this configuration.

### Screen config 3

![Running state](../../assets/images/client/config/config-3-1.png)

Running state of config 3.
Intended for screens dedicated to showing journey, i.e. no public announcements will be displayed on this screen.

### Screen config 4

![Running state](../../assets/images/client/config/config-3-1.png)

Running state of config 4.
Default state for config 4 is showing journey.

![Media](../../assets/images/client/config/config-4-2.png)

Active public announcements will replace journey.

### Screen config 5

![Running state](../../assets/images/client/config/config-5-1.png)

Running state of config 5.
This is an alternative to screen config 2 when using 32:9 screen.

### Assignment of screen config id for screens

General rule of thumb for assignment of configuration id:

1. All 32:9 (1920x540) screens should always be assigned config 1
2. All 48:9 (1920x360) screen should always be assigned config 2
3. All 16:9 (1920x1080 or 960x540) should always be assigned config 3, if any of these conditions are met:
  - This is the only screen on board
  - This screen is in front of the bus
4. Screen config 4 is used for the _right_ screen when 2x 16:9 screens are horizontally aligned, facing the same way (cf. example 1). (For all other 16:9 screens, use config 3)
5. 32:9 (1920x540) on the side of the bus, alternative to screen config 2

![Example 1, 3x 16:9 screens](../../assets/images/bus/3x16-9.png)

## Screen configurations for tram (SL18)

### Screen config t2-left

Left side of the tram when active cab is c1.

![Running state](../../assets/images/client/config/config-t2-left.png)

Running state of t2-left. This is the only state (cf. [trouble shooting](docs/client/troubleshooting-client) for this config.

### Screen config t2-right

Right side of the tram when active cab is c1.

![Running state](../../assets/images/client/config/config-t2-right.png)

Running state of t2-left. This is the only state (cf. [trouble shooting](docs/client/troubleshooting-client) for this config.

### Screen config t3

#### State 1 - doors unlocked

![Destination](../../assets/images/client/config/config-t3-1.png)

#### State 2 - next stop produced

![Next stop](../../assets/images/client/config/config-t3-2.png)

#### State 3 - next stop produced with active stop signal

![Next stop and stopping](../../assets/images/client/config/config-t3-3.png)

## Screen configurations for ferry (Boreal)

### Screen config b1

Running state of config b1. Intended for screens dedicated to showing journey, i.e. public announcements (such as safety instructions etc) are ignored.
This should be used for on the left screen in pair with config b2.

![B1](../../assets/images/client/config/config-b1.png)

### Screen config b2

Running state of config b1. Intended for screens dedicated to showing journey, i.e. public announcements (such as safety instructions etc) are ignored.
This should be used for on the left screen in pair with config b2.

![B2](../../assets/images/client/config/config-b2-1.png)

![Show public announcement](../../assets/images/client/config/config-b2-2.png)

Secondary information, intended for displaying safety announcements, deviations and other media content types.
When there is no active media content playing, the screen will show information about next stop, destination and sensor information from the ferry as fallback. The sensor data is derived from following topics:

- telemetry/01001016 - water temperature
- telemetry/01001011 - temperature outside (ambient)
- weather - wind data
