# homebridge-musiccast-tv

## Features

## Configuration

```
    "accessories": [{
        "accessory": "MusicCastTV",
        "name": "Living Room Radio",
        "ip": "192.168.178.2",
        "inputs":{}
    }]
```

## Installation

### Install [Homebridge](https://github.com/nfarina/homebridge)

```
sudo npm install -g homebridge
sudo npm install -g homebridge-musiccast-tv
```
### Configure Homebridge

You can get information about your MusicCast device by visiting 
http://<ip>/YamahaExtendedControl/v1/system/getFeatures".


config arguments: 

| name | exaple | description | required |
| ---- | ------ | ----------- | -------- |
| acessory | MusicCastTV | this value is used to identify this plugin | yes |
| name | "TV stereo" | the name of your device | yes |
| zone | "zone2" | default: "main" | no |
| ip | 192.168.178.29 | any valid ip adress | yes |
| maxVol | 161 | maxVol from getFeatures.json | yes |
| inputs | {"fm": "radio", "line_cd": "CD", "airplay": "AirPlay"} | name: display Name | yes |
| volume | 100 | initial Volume | no |
| modell | "Yamaha R-N602" |  | no |
|  |  |  |  |


Currently supported and planned inputs:

| Input Name | Description | Implemented |
| ---------- | ----------- | ----------- |
| cd |  |  |
| tuner |  |  |
| multi_ch |  |  |
| phono |  | yes |
| fm |  | yes |
| am |  | yes |
| line_cd |  | yes |
| line1 |  | yes |
| line2 |  | yes |
| line3 |  | yes |
| usb |  | yes |
| airplay |  | yes |
| bluetooth |  | yes |
| net_radio |  | yes |
| server |  | yes |
| optical1 |  | yes |
| optical2 |  | yes |
| coaxial1 |  |  |
| coaxial2 |  |  |
| hdmi1 |  |  |
| av1 |  |  |
| analog |  |  |
|  |  |  |
|  |  |  |
| -- streaming services -- |
| spotify |  | yes |
| napster |  |  |
| qobuz |  |  |
| juke |  |  |
| tidal |  |  |
| deezer |  | yes |

If your MusicCast device has additional inputs, please file an issue. 

## Debugging 
 - check you are using the right ip-adress
 - check your log file for error messages
 - run in debug mode using "homebridge -D" and file an issue

## TODO
 - [ ] prepare one InputService for each possible input
 - [x] remove eval
 - [ ] create npm package

