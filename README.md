# homebridge-musiccast-tv

[![npm](https://img.shields.io/npm/v/homebridge-musiccast-tv)](https://npmjs.com/package/homebridge-musiccast-tv)

## Features

This plugin publishes MusicCast devices as HomeKit compatible TVs. 
It supports any number of inputs and volume control via the Apple TV Remote widget in the iOS Control Center. 

## Configuration

```json
    "accessories": [{
        "accessory": "MusicCastTV",
        "name": "Living Room Radio",
        "ip": "192.168.178.2",
        "inputs": {
            "airplay": "AirPlay", 
            "am": "AM", 
            "fm": "FM", 
            "line_cd": "CD", 
            "hdmi1": "DVD Player", 
            "server": "Homeserver", 
            "net_radio": "Online radio"
            }
    }]
```

## Installation

### Install [Homebridge](https://github.com/homebridge/homebridge)

```shell
sudo npm install -g homebridge
sudo npm install -g homebridge-musiccast-tv
```
### Configure Homebridge

You can get information about your MusicCast device by visiting 
"http://\<ip\>/YamahaExtendedControl/v1/system/getFeatures".


config arguments: 

| name | example | description | required |
| ---- | ------- | ----------- | -------- |
| accessory | MusicCastTV | this value is used to identify this plugin | yes |
| name | "TV stereo" | the name of your device | yes |
| ip | 192.168.178.29 | ip address for your MusicCast device | yes |
| zone | "zone2" | MusicCast zone from getFeatures.json, default: "main" | no |
| inputs | {"fm": "radio", "line_cd": "CD", "airplay": "AirPlay"} | one key:value pair for each input you want to use. You can hide inputs by removing the checkbox in your HomeKit app or by removing it here. | yes |
| model | "Yamaha R-N602" | device model shown in homebridge | no |
| powerOnInput | "line_cd" | input automatically switched to at powerOn | no |
| powerOnVolume | 60 | Volume your device is set to at powerOn | no |
| updateInterval | 1000 | time between updates im ms | no |
| volume | 100 | initial Volume; automatically detected | no |
| maxVol | 161 | maxVol from getFeatures.json; automatically detected | no |
<!--
| identifier | 38 | used to set initial input after homebridge restart; values from [index.js line 57](https://github.com/DoctorNSA/homebridge-musiccast-tv/blob/3327b51757484fe480fc20c0e62199163b4570bb/index.js#L57) | no |
-->


Currently supported inputs:

| Input Name | Implemented |
| ---------- | ----------- |
| phono | yes |
| line_cd | yes |
| line1 | yes |
| line2 | yes |
| line3 | yes |
| usb | yes |
| usb_dac | no |
| airplay | yes |
| bluetooth | yes |
| net_radio | yes |
| server | yes |
| optical | no |
| optical1 | yes |
| optical2 | yes |
| coaxial | no |
| coaxial1 | yes |
| coaxial2 | yes |
| hdmi | yes |
| hdmi[1-8] | yes |
| aux | yes |
| aux1 | yes |
| aux2 | yes |
| v_aux | no |
| av[1-7] | yes |
| cd | yes |
| tv | yes |
| analog | yes |
| multi_ch | yes |
| audio | no |
| audio[1-4] | yes |
| audio_cd | no |
|  | no |
| mc_link | yes |
| main_sync | no |
| **tuner** |
| fm | yes |
| am | yes |
| dab | yes |
| **streaming services** |
| spotify | yes |
| amazon_music | yes |
| deezer | yes |
| napster | yes |
| qobuz | yes |
| juke | yes |
| tidal | yes |
| pandora | yes |
| siriusxm | yes |
| radiko | yes |

If your MusicCast device supports additional inputs, please file an issue. 

hdmi[1-8] summarizes hdmi1, hdmi2, ..., hdmi8

## Debugging 
 - check you are using the right ip-adress
 - check your log file for error messages
 - run in debug mode using "homebridge -D" and file an issue


## Common issues

### Input appears as additional tile
 - remove and repair Homebridge
 - restart Homebridge

### Issues with more than one TV per bridge
If you have more than one TV per Homebridge instance you might experience some of the following issues: 
- only one TV appears in the TV widget
- one or multiple TVs have problems syncing to Homebridge
- one or more TVs are flashing in the Home app

To fix these Issues make sure there is just one TV per Homebridge instance. You can run [multiple Homebridge instances](https://github.com/homebridge/homebridge/wiki/Install-Homebridge-on-Raspbian#multiple-instances) per device. 


## TODO
 - [ ] prepare one InputService for each remaining input
 - [x] automatically detect volume, maxVolume and input
 - [x] turn on optional input from config.json after power on
 - [x] add an option to set the Volume to a fixed level after turning on the device via HomeKit
