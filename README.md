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

### Install [Homebridge](https://github.com/nfarina/homebridge)

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
| volume | 100 | initial Volume; automatically detected | no |
| maxVol | 161 | maxVol from getFeatures.json; automatically detected | no |
| model | "Yamaha R-N602" | device model shown in homebridge | no |
| powerOnInput | "line_cd" | input automatically switched to at powerOn | no |
| updateInterval | 1000 | time between updates im ms | no |
<!--
| identifier | 38 | used to set initial input after homebridge restart; values from [index.js line 57](https://github.com/DoctorNSA/homebridge-musiccast-tv/blob/3327b51757484fe480fc20c0e62199163b4570bb/index.js#L57) | no |
-->


Currently supported inputs:

| Input Name | Implemented |
| ---------- | ----------- |
| cd | no |
| multi_ch | no |
| phono | yes |
| line_cd | yes |
| line1 | yes |
| line2 | yes |
| line3 | yes |
| usb | yes |
| airplay | yes |
| bluetooth | yes |
| net_radio | yes |
| server | yes |
| optical1 | yes |
| optical2 | yes |
| coaxial1 | yes |
| coaxial2 | yes |
| hdmi[1-8] | yes |
| aux | yes |
| aux1 | yes |
| aux2 | yes |
| av[1-7] | no |
| analog | no |
| audio[1-4] | no |
|  |  |
| mc_link | no |
| main_sync | no |
| **tuner** |
| fm | yes |
| am | yes |
| dab | yes |
| **streaming services** |
| spotify | yes |
| amazon_music | no |
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


## TODO
 - [ ] prepare one InputService for each remaining input
 - [x] automatically detect volume
 - [x] automatically detect maxVolume
 - [x] automatically detect current input
 - [x] turn on optional input from config.json after power on
