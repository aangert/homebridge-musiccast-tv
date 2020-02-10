var Service, Characteristic;
const request = require('request');
const url = require('url');

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;
	homebridge.registerAccessory("homebridge-musiccast-tv", "MusicCastTV", MusicCastTV);
};

function MusicCastTV(log, config) {
	this.log = log;
	this.name = config["name"];
	this.ip = config["ip"];
	this.zone = config["zone"] || "main";
	this.maxVol = config["maxVol"] || 160;
	this.inputs =  config["inputs"] || {"AirPlay": "1. 'inputs' missing", "bluetooth": "2. in config.json", "spotify": "3. please modify"};
	this.active = config["active"] || config["power"] || 0;
	this.ActiveIdentifier = config["identifier"] || 1;
	this.mute = 1;
	//this.brightness = config["brightness"] || 100;
	this.volume = config["volume"] || 100;
	//this.updateInterval = 1000;
	this.version = 0.4;
	this.features = {};
	this.info = {"AirPlay": {"Identifier": 1, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "airplay"}, 
		"line_cd": {"Identifier": 2, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line_cd"}, 
		"fm": {"Identifier": 3, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "fm"}, 
		"am": {"Identifier": 4, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "am"}, 
		"dab": {"Identifier": 5, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"server": {"Identifier": 6, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "server"}, 
		"Phono": {"Identifier": 7, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "phono"}, 
		"usb": {"Identifier": 8, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "usb"}, 
		"bluetooth": {"Identifier": 9, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "bluetooth"}, 
		"net_radio": {"Identifier": 10, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "net_radio"}, 
		"line1": {"Identifier": 11, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line1"}, 
		"line2": {"Identifier": 12, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line2"}, 
		"line3": {"Identifier": 13, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line3"}, 
		"optical1": {"Identifier": 14, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "optical1"}, 
		"optical2": {"Identifier": 15, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "optical2"}, 
		"coaxial1": {"Identifier": 16, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "coaxial1"}, 
		"coaxial2": {"Identifier": 17, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "coaxial2"}, 
		"spotify": {"Identifier": 18, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "spotify"}, 
		"deezer": {"Identifier": 19, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "deezer"}, 
		"napster": {"Identifier": 20, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"qobuz": {"Identifier": 21, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"juke": {"Identifier": 22, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"tidal": {"Identifier": 23, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"c": {"Identifier": 30, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}};
	this.modell = config["modell"] || "MusicCast TV";
	this.log.debug(config);
	for(var key in this.inputs) {
		this.log.debug("updating name for " + key);
		switch (key) {
			case "airplay":
			case "AirPlay":
				this.info["AirPlay"]["ConfiguredName"]=this.inputs[key];
				break;
			case "phono":
			case "Phono":
				this.info["Phono"]["ConfiguredName"]=this.inputs[key];
				break;
			case "line_cd":
			case "LineCD":
				this.info["line_cd"]["ConfiguredName"]=this.inputs[key];
				break;
			case "line1":
			case "Line1":
				this.info["line1"]["ConfiguredName"]=this.inputs[key];
				break;
			case "line2":
			case "Line2":
				this.info["line2"]["ConfiguredName"]=this.inputs[key];
				break;
			case "line3":
			case "Line3":
				this.info["line3"]["ConfiguredName"]=this.inputs[key];
				break;
			case "fm":
			case "FM":
				this.info["fm"]["ConfiguredName"]=this.inputs[key];
				break;
			case "am":
			case "AM":
				this.info["am"]["ConfiguredName"]=this.inputs[key];
				break;
			case "net_radio":
			case "NetRadio":
				this.info["net_radio"]["ConfiguredName"]=this.inputs[key];
				break;
			case "server":
			case "Server":
				this.info["server"]["ConfiguredName"]=this.inputs[key];
				break;
			case "bluetooth":
			case "Bluetooth":
				this.info["bluetooth"]["ConfiguredName"]=this.inputs[key];
				break;
			case "usb":
			case "USB":
				this.info["usb"]["ConfiguredName"]=this.inputs[key];
				break;
			case "optical1":
			case "Optical1":
				this.info["optical1"]["ConfiguredName"]=this.inputs[key];
				break;
			case "optical2":
			case "Optical2":
				this.info["optical2"]["ConfiguredName"]=this.inputs[key];
				break;
			case "coaxial1":
			case "Coaxial1":
				this.info["coaxial1"]["ConfiguredName"]=this.inputs[key];
				break;
			case "coaxial2":
			case "Coaxial2":
				this.info["coaxial2"]["ConfiguredName"]=this.inputs[key];
				break;
			case "spotify":
			case "Spotify":
				this.info["spotify"]["ConfiguredName"]=this.inputs[key];
				break;
			case "deezer":
			case "Deezer":
				this.info["deezer"]["ConfiguredName"]=this.inputs[key];
				break;
			case "napster":
			case "Napster":
				this.info["napster"]["ConfiguredName"]=this.inputs[key];
				break;
			case "qobuz":
			case "Qobuz":
				this.info["qobuz"]["ConfiguredName"]=this.inputs[key];
				break;
			case "juke":
			case "Juke":
				this.info["juke"]["ConfiguredName"]=this.inputs[key];
				break;
			case "tidal":
			case "Tidal":
				this.info["tidal"]["ConfiguredName"]=this.inputs[key];
				break;
			default:
				this.log("input " + key + ": " + this.inputs[key] + " not found");
		}
	}
	this.log("Initialized '" + this.name + "'");

}

MusicCastTV.prototype = {
	identify: function(callback) {
		this.log("Identify " + this.name);
		callback();
	},
	getActive: function(callback) {
		const that = this;
		this.log.debug("get Active of " + this.name + ": " + this.active);
		request({
        method: 'GET',
            url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        that.log.debug('HTTP get error');
        that.log(error.message);
        return callback(error);
      }
	  att=JSON.parse(body);
	  that.log.debug('HTTP GetStatus result: ' + att.power);
	  that.active = (att.power=='on');
      return callback(null, (att.power=='on'));
	  });
	},
	setActive: function(value, callback) {
		const that = this;
		this.active = value;
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (value ? 'on' : 'standby'),
		method: 'GET',
		body: ""
		},
		function (error, response) {
			if (error) {
			that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (value ? 'on' : 'standby'));
			that.log(error.message);
			return callback(error);
			}
		})
		this.log("Active to " + value);
		callback();
	},
	getActiveIdentifier: function(callback) {
		this.log.debug("get Active Identifier: " + this.ActiveIdentifier);
		callback(null, this.ActiveIdentifier);
	},
	setActiveIdentifier: function(value, callback) {
		const that = this;
		for(var key in this.info) {
		this.log.debug(key);
			if (this.info[key]["Identifier"] == value) {
				var newInput = this.info[key]["Command"]
				var tempInput = newInput;
				this.log("Switch to " + newInput);
			}
		}
		if (tempInput=="am" || tempInput=="fm" || tempInput=="dab") {
			newInput = "tuner";
		}
		this.log.debug("ActiveIdentifier to " + value);
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setInput?input=' + newInput,
		method: 'GET',
		body: ""
		},
		function (error, response) {
			if (error) {
			that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setInput?input=' + newInput);
			that.log(error.message);
			return callback(error);
			}
		})
		if (tempInput=="am" || tempInput=="fm" || tempInput=="dab") {
			request({
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tempInput,
			method: 'GET',
			body: ""
			},
			function (error, response) {
				if (error) {
				that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tempInput);
				that.log(error.message);
				return callback(error);
				}
			})
		}
		this.ActiveIdentifier = value;
		callback();
	},
	getMute: function(callback) {
		this.log.debug("get Mute of " + this.name + ": " + this.mute);
		callback(null, this.mute);
	},
	setMute: function(value, callback) {
		this.mute = value;
		this.log("Mute to " + value);
		callback();
	},
	remoteKeyPress: function(value, callback) {
		switch (value) {
			case 4:
				this.log("remoteKeyPress UP");
				break;
			case 5:
				this.log("remoteKeyPress DOWN");
				break;
			case 6:
				this.log("remoteKeyPress LEFT");
				break;
			case 7:
				this.log("remoteKeyPress RIGHT");
				break;
			case 8:
				this.log("remoteKeyPress OK/MITTE");
				break;
			case 9:
				this.log("remoteKeyPress zurück");
				break;
			case 11:
				this.log("remoteKeyPress Play/Pause");
				//CurrentMediaState und TargetMediaState verändern
				//0=PLAY;1=PAUSE;2=STOP
				if (this.CurrentMediaState == 0) {
					setTargetMediaState(1, callback);
					//this.TargetMediaState = 1;
				} 
				if (this.CurrentMediaState == 1) {
					setTargetMediaState(0, callback);
					//this.TargetMediaState = 0;
				}
				break;
			case 15:
				this.log("remoteKeyPress i");
				break;
			default:
				this.log("remoteKeyPress " + value);
				break;
		}
		callback();
	},
	getVolume: function(callback) {
		const that = this;
		this.log.debug("get Volume of " + this.name + ": " + this.volume);
		request({
        method: 'GET',
            url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        that.log.debug('HTTP get error');
        that.log(error.message);
        return callback(error);
      }
	  att=JSON.parse(body);
	  that.log('HTTP GetStatus result: Volume = ' + att.volume);
	  that.volume = (att.volume * 100 / that.maxVol);
      return callback(null, att.volume);
	  });
	},
	setVolume: function(value, callback) {
		const that = this;
		if (value<0 || this.maxVol>value) {
			this.log("Volume must be between 0 and " + this.maxVol);
			callback();
		}
		this.volume = value;
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value,
		method: 'GET',
		body: ""
		},
		function (error, response) {
			if (error) {
			that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value);
			that.log(error.message);
			return callback(error);
			}
		})
		this.log("Volume to " + value);
		callback();
	},
	setVolumeSelector: function(value, callback) {
		this.log("VolumeSelector: " + value + ", current Volume: " + this.volume);
		if (value == 0) {
			this.setVolume(this.volume+1, callback);
		}else if (value == 1){
			this.setVolume(this.volume-1, callback);
		}
	},
	
	getServices: function() {
		const that = this;
		
		var AirPlayService = new Service.InputSource("AirPlay", "AirPlay");
		AirPlayService.setCharacteristic(Characteristic.Identifier, this.info["AirPlay"]["Identifier"]);
		AirPlayService.setCharacteristic(Characteristic.ConfiguredName, this.info["AirPlay"]["ConfiguredName"]);
		AirPlayService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		AirPlayService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		AirPlayService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of AirPlay' + this.info["AirPlay"]['CurrentVisibilityState']);
			callback(null, this.info["AirPlay"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		AirPlayService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["AirPlay"]['TargetVisibilityState']);
			callback(null, this.info["AirPlay"]['TargetVisibilityState']);
		});
		AirPlayService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["AirPlay"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["AirPlay"]['ConfiguredName']);
			this.info["AirPlay"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.AirPlayService = AirPlayService;
		
		var PhonoService = new Service.InputSource("Phono", "Phono");
		PhonoService.setCharacteristic(Characteristic.Identifier, this.info["Phono"]["Identifier"]);
		PhonoService.setCharacteristic(Characteristic.ConfiguredName, this.info["Phono"]["ConfiguredName"]);
		PhonoService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		PhonoService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		PhonoService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of Phono' + this.info["Phono"]['CurrentVisibilityState']);
			callback(null, this.info["Phono"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		PhonoService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["Phono"]['TargetVisibilityState']);
			callback(null, this.info["Phono"]['TargetVisibilityState']);
		});
		PhonoService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["Phono"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["Phono"]['ConfiguredName']);
			this.info["Phono"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.PhonoService = PhonoService;
		
		var line_cdService = new Service.InputSource("line_cd", "line_cd");
		line_cdService.setCharacteristic(Characteristic.Identifier, this.info["line_cd"]["Identifier"]);
		line_cdService.setCharacteristic(Characteristic.ConfiguredName, this.info["line_cd"]["ConfiguredName"]);
		line_cdService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		line_cdService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		line_cdService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of line_cd' + this.info["line_cd"]['CurrentVisibilityState']);
			callback(null, this.info["line_cd"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		line_cdService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["line_cd"]['TargetVisibilityState']);
			callback(null, this.info["line_cd"]['TargetVisibilityState']);
		});
		line_cdService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["line_cd"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["line_cd"]['ConfiguredName']);
			this.info["line_cd"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.line_cdService = line_cdService;
		
		var line1Service = new Service.InputSource("line1", "line1");
		line1Service.setCharacteristic(Characteristic.Identifier, this.info["line1"]["Identifier"]);
		line1Service.setCharacteristic(Characteristic.ConfiguredName, this.info["line1"]["ConfiguredName"]);
		line1Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		line1Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		line1Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of line1' + this.info["line1"]['CurrentVisibilityState']);
			callback(null, this.info["line1"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		line1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["line1"]['TargetVisibilityState']);
			callback(null, this.info["line1"]['TargetVisibilityState']);
		});
		line1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["line1"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["line1"]['ConfiguredName']);
			this.info["line1"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.line1Service = line1Service;
		
		var line2Service = new Service.InputSource("line2", "line2");
		line2Service.setCharacteristic(Characteristic.Identifier, this.info["line2"]["Identifier"]);
		line2Service.setCharacteristic(Characteristic.ConfiguredName, this.info["line2"]["ConfiguredName"]);
		line2Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		line2Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		line2Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of line2' + this.info["line2"]['CurrentVisibilityState']);
			callback(null, this.info["line2"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		line2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["line2"]['TargetVisibilityState']);
			callback(null, this.info["line2"]['TargetVisibilityState']);
		});
		line2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["line2"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["line2"]['ConfiguredName']);
			this.info["line2"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.line2Service = line2Service;
		
		var line3Service = new Service.InputSource("line3", "line3");
		line3Service.setCharacteristic(Characteristic.Identifier, this.info["line3"]["Identifier"]);
		line3Service.setCharacteristic(Characteristic.ConfiguredName, this.info["line3"]["ConfiguredName"]);
		line3Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		line3Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		line3Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of line3' + this.info["line3"]['CurrentVisibilityState']);
			callback(null, this.info["line3"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		line3Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["line3"]['TargetVisibilityState']);
			callback(null, this.info["line3"]['TargetVisibilityState']);
		});
		line3Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["line3"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["line3"]['ConfiguredName']);
			this.info["line3"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.line3Service = line3Service;
		
		var fmService = new Service.InputSource("fm", "fm");
		fmService.setCharacteristic(Characteristic.Identifier, this.info["fm"]["Identifier"]);
		fmService.setCharacteristic(Characteristic.ConfiguredName, this.info["fm"]["ConfiguredName"]);
		fmService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		fmService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		fmService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of fm' + this.info["fm"]['CurrentVisibilityState']);
			callback(null, this.info["fm"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		fmService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["fm"]['TargetVisibilityState']);
			callback(null, this.info["fm"]['TargetVisibilityState']);
		});
		fmService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["fm"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["fm"]['ConfiguredName']);
			this.info["fm"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.fmService = fmService;
		
		var amService = new Service.InputSource("am", "am");
		amService.setCharacteristic(Characteristic.Identifier, this.info["am"]["Identifier"]);
		amService.setCharacteristic(Characteristic.ConfiguredName, this.info["am"]["ConfiguredName"]);
		amService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		amService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		amService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of am' + this.info["am"]['CurrentVisibilityState']);
			callback(null, this.info["am"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		amService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["am"]['TargetVisibilityState']);
			callback(null, this.info["am"]['TargetVisibilityState']);
		});
		amService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["am"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["am"]['ConfiguredName']);
			this.info["am"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.amService = amService;
		
		var net_radioService = new Service.InputSource("net_radio", "net_radio");
		net_radioService.setCharacteristic(Characteristic.Identifier, this.info["net_radio"]["Identifier"]);
		net_radioService.setCharacteristic(Characteristic.ConfiguredName, this.info["net_radio"]["ConfiguredName"]);
		net_radioService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		net_radioService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		net_radioService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of net_radio' + this.info["net_radio"]['CurrentVisibilityState']);
			callback(null, this.info["net_radio"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		net_radioService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["net_radio"]['TargetVisibilityState']);
			callback(null, this.info["net_radio"]['TargetVisibilityState']);
		});
		net_radioService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["net_radio"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["net_radio"]['ConfiguredName']);
			this.info["net_radio"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.net_radioService = net_radioService;
		
		var serverService = new Service.InputSource("server", "server");
		serverService.setCharacteristic(Characteristic.Identifier, this.info["server"]["Identifier"]);
		serverService.setCharacteristic(Characteristic.ConfiguredName, this.info["server"]["ConfiguredName"]);
		serverService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		serverService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		serverService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of server' + this.info["server"]['CurrentVisibilityState']);
			callback(null, this.info["server"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		serverService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["server"]['TargetVisibilityState']);
			callback(null, this.info["server"]['TargetVisibilityState']);
		});
		serverService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["server"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["server"]['ConfiguredName']);
			this.info["server"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.serverService = serverService;
		
		var bluetoothService = new Service.InputSource("bluetooth", "bluetooth");
		bluetoothService.setCharacteristic(Characteristic.Identifier, this.info["bluetooth"]["Identifier"]);
		bluetoothService.setCharacteristic(Characteristic.ConfiguredName, this.info["bluetooth"]["ConfiguredName"]);
		bluetoothService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		bluetoothService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		bluetoothService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of bluetooth' + this.info["bluetooth"]['CurrentVisibilityState']);
			callback(null, this.info["bluetooth"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		bluetoothService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["bluetooth"]['TargetVisibilityState']);
			callback(null, this.info["bluetooth"]['TargetVisibilityState']);
		});
		bluetoothService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["bluetooth"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["bluetooth"]['ConfiguredName']);
			this.info["bluetooth"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.bluetoothService = bluetoothService;
		
		var usbService = new Service.InputSource("usb", "usb");
		usbService.setCharacteristic(Characteristic.Identifier, this.info["usb"]["Identifier"]);
		usbService.setCharacteristic(Characteristic.ConfiguredName, this.info["usb"]["ConfiguredName"]);
		usbService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		usbService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		usbService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of usb' + this.info["usb"]['CurrentVisibilityState']);
			callback(null, this.info["usb"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		usbService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["usb"]['TargetVisibilityState']);
			callback(null, this.info["usb"]['TargetVisibilityState']);
		});
		usbService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["usb"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["usb"]['ConfiguredName']);
			this.info["usb"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.usbService = usbService;
		
		var optical1Service = new Service.InputSource("optical1", "optical1");
		optical1Service.setCharacteristic(Characteristic.Identifier, this.info["optical1"]["Identifier"]);
		optical1Service.setCharacteristic(Characteristic.ConfiguredName, this.info["optical1"]["ConfiguredName"]);
		optical1Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		optical1Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		optical1Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of optical1' + this.info["optical1"]['CurrentVisibilityState']);
			callback(null, this.info["optical1"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		optical1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["optical1"]['TargetVisibilityState']);
			callback(null, this.info["optical1"]['TargetVisibilityState']);
		});
		optical1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["optical1"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["optical1"]['ConfiguredName']);
			this.info["optical1"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.optical1Service = optical1Service;
		
		var optical2Service = new Service.InputSource("optical2", "optical2");
		optical2Service.setCharacteristic(Characteristic.Identifier, this.info["optical2"]["Identifier"]);
		optical2Service.setCharacteristic(Characteristic.ConfiguredName, this.info["optical2"]["ConfiguredName"]);
		optical2Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		optical2Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		optical2Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of optical2' + this.info["optical2"]['CurrentVisibilityState']);
			callback(null, this.info["optical2"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		optical2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["optical2"]['TargetVisibilityState']);
			callback(null, this.info["optical2"]['TargetVisibilityState']);
		});
		optical2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["optical2"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["optical2"]['ConfiguredName']);
			this.info["optical2"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.optical2Service = optical2Service;
		
		var coaxial1Service = new Service.InputSource("coaxial1", "coaxial1");
		coaxial1Service.setCharacteristic(Characteristic.Identifier, this.info["coaxial1"]["Identifier"]);
		coaxial1Service.setCharacteristic(Characteristic.ConfiguredName, this.info["coaxial1"]["ConfiguredName"]);
		coaxial1Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		coaxial1Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		coaxial1Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of coaxial1' + this.info["coaxial1"]['CurrentVisibilityState']);
			callback(null, this.info["coaxial1"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		coaxial1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["coaxial1"]['TargetVisibilityState']);
			callback(null, this.info["coaxial1"]['TargetVisibilityState']);
		});
		coaxial1Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["coaxial1"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["coaxial1"]['ConfiguredName']);
			this.info["coaxial1"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.coaxial1Service = coaxial1Service;
		
		var coaxial2Service = new Service.InputSource("coaxial2", "coaxial2");
		coaxial2Service.setCharacteristic(Characteristic.Identifier, this.info["coaxial2"]["Identifier"]);
		coaxial2Service.setCharacteristic(Characteristic.ConfiguredName, this.info["coaxial2"]["ConfiguredName"]);
		coaxial2Service.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		coaxial2Service.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		coaxial2Service.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of coaxial2' + this.info["coaxial2"]['CurrentVisibilityState']);
			callback(null, this.info["coaxial2"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		coaxial2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["coaxial2"]['TargetVisibilityState']);
			callback(null, this.info["coaxial2"]['TargetVisibilityState']);
		});
		coaxial2Service.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["coaxial2"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["coaxial2"]['ConfiguredName']);
			this.info["coaxial2"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.coaxial2Service = coaxial2Service;
		
		var spotifyService = new Service.InputSource("spotify", "spotify");
		spotifyService.setCharacteristic(Characteristic.Identifier, this.info["spotify"]["Identifier"]);
		spotifyService.setCharacteristic(Characteristic.ConfiguredName, this.info["spotify"]["ConfiguredName"]);
		spotifyService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		spotifyService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		spotifyService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of spotify' + this.info["spotify"]['CurrentVisibilityState']);
			callback(null, this.info["spotify"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		spotifyService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["spotify"]['TargetVisibilityState']);
			callback(null, this.info["spotify"]['TargetVisibilityState']);
		});
		spotifyService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["spotify"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["spotify"]['ConfiguredName']);
			this.info["spotify"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.spotifyService = spotifyService;
		
		var deezerService = new Service.InputSource("deezer", "deezer");
		deezerService.setCharacteristic(Characteristic.Identifier, this.info["deezer"]["Identifier"]);
		deezerService.setCharacteristic(Characteristic.ConfiguredName, this.info["deezer"]["ConfiguredName"]);
		deezerService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		deezerService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		deezerService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug('get CurrentVisibilityState of deezer' + this.info["deezer"]['CurrentVisibilityState']);
			callback(null, this.info["deezer"]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		deezerService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + this.info["deezer"]['TargetVisibilityState']);
			callback(null, this.info["deezer"]['TargetVisibilityState']);
		});
		deezerService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info["deezer"]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info["deezer"]['ConfiguredName']);
			this.info["deezer"]['CurrentVisibilityState'] = value;
			callback();
		});
		this.deezerService = deezerService;
		
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "DoctorNSA")
			.setCharacteristic(Characteristic.Model, this.modell)
			.setCharacteristic(Characteristic.SerialNumber, "123-456-789")
			.setCharacteristic(Characteristic.FirmwareRevision, this.version);
		
		ServiceList = [];
		ServiceList.push(informationService);
		
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/system/getFeatures',
	        method: 'GET',
		headers: {
			'X-AppName': 'MusicCast/1.0',
			'X-AppPort': '41100',
		}
		},
		function (error, response, body) {
			that.log.debug(response + ", body= " + body);
			if (error) {
        			that.log.debug('HTTP get error');
        			that.log(error.message);
			} else {
				that.features=JSON.parse(body);
			}
		});
		this.log.debug("features: " + this.features);
		
		let TelevisionService = new Service.Television(this.name);
		TelevisionService
			.setCharacteristic(Characteristic.ConfiguredName, this.name);
		TelevisionService
			.setCharacteristic(Characteristic.SleepDiscoveryMode, 1);
		TelevisionService
			.getCharacteristic(Characteristic.Active)//läuft 
				.on('get', this.getActive.bind(this))
				.on('set', this.setActive.bind(this));
		 TelevisionService
			.getCharacteristic(Characteristic.ActiveIdentifier)//läuft
				.on('get', this.getActiveIdentifier.bind(this))
				.on('set', this.setActiveIdentifier.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.RemoteKey)//läuft nicht
				.on('set', this.remoteKeyPress.bind(this));
		/*TelevisionService
			.getCharacteristic(Characteristic.PowerModeSelection)//fehlt
				.on('set', this.setPowerModeSelection.bind(this));//0=Show Menu
		TelevisionService
			.getCharacteristic(Characteristic.CurrentMediaState)
				.on('get', this.getCurrentMediaState.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.TargetMediaState)
				.on('get', this.getTargetMediaState.bind(this))
				.on('set', this.setTargetMediaState.bind(this));
		setInterval(() => {
			TelevisionService.getCharacteristic(Characteristic.CurrentMediaState)
				.updateValue(this.CurrentMediaState);
		}, this.updateInterval);*/
		ServiceList.push(TelevisionService);
		
		let TelevisionSpeakerService = new Service.TelevisionSpeaker(this.name + 'SpeakerService');
		TelevisionSpeakerService
			.setCharacteristic(Characteristic.Active, Characteristic.Active.ACTIVE)
			.setCharacteristic(Characteristic.VolumeControlType, 3);
			//0 NONE; 1 RELATIVE; 2 RELATIVE_WITH_CURRENT; 3 ABSOLUTE;
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.VolumeSelector)//0 INCREMENT; 1 DECREMENT
				.on('set', this.setVolumeSelector.bind(this));
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.Mute)//läuft nicht
				.on('get', this.getMute.bind(this))
				.on('set', this.setMute.bind(this));
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.Volume)//läuft nicht
				.on('get', this.getVolume.bind(this))
				.on('set', this.setVolume.bind(this));
		TelevisionService.addLinkedService(TelevisionSpeakerService);
		ServiceList.push(TelevisionSpeakerService);
		//var i = 0;
		for(var key in this.inputs) {
			this.log.debug("processing input " + key);
			switch (key) {
				case "airplay":
				case "AirPlay":
					TelevisionService.addLinkedService(this.AirPlayService);
					ServiceList.push(this.AirPlayService);
					break;
				case "phono":
				case "Phono":
					TelevisionService.addLinkedService(this.PhonoService);
					ServiceList.push(this.PhonoService);
					break;
				case "line_cd":
				case "LineCD":
					TelevisionService.addLinkedService(this.line_cdService);
					ServiceList.push(this.line_cdService);
					break;
				case "line1":
				case "Line1":
					TelevisionService.addLinkedService(this.line1Service);
					ServiceList.push(this.line1Service);
					break;
				case "line2":
				case "Line2":
					TelevisionService.addLinkedService(this.line2Service);
					ServiceList.push(this.line2Service);
					break;
				case "line3":
				case "Line3":
					TelevisionService.addLinkedService(this.line3Service);
					ServiceList.push(this.line3Service);
					break;
				case "fm":
				case "FM":
					TelevisionService.addLinkedService(this.fmService);
					ServiceList.push(this.fmService);
					break;
				case "am":
				case "AM":
					TelevisionService.addLinkedService(this.amService);
					ServiceList.push(this.amService);
					break;
				case "net_radio":
				case "NetRadio":
					TelevisionService.addLinkedService(this.net_radioService);
					ServiceList.push(this.net_radioService);
					break;
				case "server":
				case "Server":
					TelevisionService.addLinkedService(this.serverService);
					ServiceList.push(this.serverService);
					break;
				case "bluetooth":
				case "Bluetooth":
					TelevisionService.addLinkedService(this.bluetoothService);
					ServiceList.push(this.bluetoothService);
					break;
				case "usb":
				case "USB":
					TelevisionService.addLinkedService(this.usbService);
					ServiceList.push(this.usbService);
					break;
				case "optical1":
				case "Optical1":
					TelevisionService.addLinkedService(this.optical1Service);
					ServiceList.push(this.optical1Service);
					break;
				case "optical2":
				case "Optical2":
					TelevisionService.addLinkedService(this.optical2Service);
					ServiceList.push(this.optical2Service);
					break;
				case "coaxial1":
				case "Coaxial1":
					TelevisionService.addLinkedService(this.coaxial1Service);
					ServiceList.push(this.coaxial1Service);
					break;
				case "coaxial2":
				case "Coaxial2":
					TelevisionService.addLinkedService(this.coaxial2Service);
					ServiceList.push(this.coaxial2Service);
					break;
				case "spotify":
				case "Spotify":
					TelevisionService.addLinkedService(this.spotifyService);
					ServiceList.push(this.spotifyService);
					break;
				case "deezer":
				case "Deezer":
					TelevisionService.addLinkedService(this.deezerService);
					ServiceList.push(this.deezerService);
					break;
				default:
					this.log("input " + key + " not found");
					this.log("please file a feature request and include this log");
					this.log("features: " + this.features);
			}
		}
		/*	eval("var InputService" + i + " = new Service.InputSource(key, key)");
			//eval("InputService" + i + ".setCharacteristic(Characteristic.InputSourceType, this.inputs[key]['InputSourceType'])");
				//0=OTHER;1=HOME_SCREEN;2=TUNER;3=HDMI; 4=COMPOSITE_VIDEO;5=S_VIDEO;
				//6=COMPONENT_VIDEO;7=DVI;8=AIRPLAY;9=USB;10=APPLICATION;
			//eval("InputService" + i + ".setCharacteristic(Characteristic.InputDeviceType, this.inputs[key]['InputDeviceType'])");
				//0=OTHER;1=TV;2=RECORDING;3=TUNER;4=PLAYBACK;5=AUDIO_SYSTEM;
			TelevisionService.addLinkedService(eval("InputService" + i));
			ServiceList.push(eval("InputService" + i));
		};*/
		
		this.TelevisionService = TelevisionService;
		this.TelevisionSpeakerService = TelevisionSpeakerService;
		this.informationService = informationService;
		return ServiceList;
	}
}
