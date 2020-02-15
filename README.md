# homebridge-musiccast-tv

## Features

## Configuration

```json
    "accessories": [{
        "accessory": "MusicCastTV",
        "name": "Living Room Radio",
        "ip": "192.168.178.2",
        "maxVol": 60,
        "volume": 50,
        "inputs": {
            "airplay": "AirPlay", 
            "am": "AM", 
            "fm": "FM", 
            "line_cd": "CD", 
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

| name | exaple | description | required |
| ---- | ------ | ----------- | -------- |
| acessory | MusicCastTV | this value is used to identify this plugin | yes |
| name | "TV stereo" | the name of your device | yes |
| zone | "zone2" | MusicCast zone from getFeatures.json, default: "main" | no |
| ip | 192.168.178.29 | ip address for your MusicCast device | yes |
| maxVol | 161 | maxVol from getFeatures.json | yes |
| inputs | {"fm": "radio", "line_cd": "CD", "airplay": "AirPlay"} | one key:value pair for each input you want to use. You can hide inputs by removing the checkbox in your HomeKit app or by removing it here. | yes |
| volume | 100 | initial Volume | no |
| modell | "Yamaha R-N602" |  | no |


Currently supported and planned inputs:

| Input Name | Implemented |
| ---------- | ----------- |
| cd | no |
| tuner | no |
| multi_ch | no |
| phono | yes |
| fm | yes |
| am | yes |
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
| hdmi[1-8] | no |
| aux | no |
| aux1 | no |
| aux2 | no |
| av[1-7] | no |
| analog | no |
| audio[1-4] | no |
|  |  |
| mc_link | no |
| main_sync | no |
| **streaming services** |
| spotify | yes |
| deezer | yes |
| napster | yes |
| qobuz | yes |
| juke | yes |
| tidal | yes |
| pandora | no |
| siriusxm | no |
| radiko | no |

If your MusicCast device has additional inputs, please file an issue. 
hdmi[1-8] summarizes hdmi1, hdmi2, ..., hdmi8

## Debugging 
 - check you are using the right ip-adress
 - check your log file for error messages
 - run in debug mode using "homebridge -D" and file an issue

## TODO
 - [ ] prepare one InputService for each possible input
 - [x] remove eval
 - [x] create npm package

