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
	this.model = config["model"] || config["modell"] || "MusicCast TV";
	this.volume = config["volume"];
	this.maxVol = config["maxVol"];
	this.ActiveIdentifier = config["identifier"] || 1;
	var vol;
	that = this;
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
			that.log.error(error.message);
		}
		that.log.debug("body: " + body)
		if(body) {
			att=JSON.parse(body);
			that.volume = config["volume"] || att.volume;
			that.maxVol = config["maxVol"] || att.max_volume;
			that.log("volume: " + that.volume + " maxVol: " + that.maxVol);
			tmpInput = that.getInputFromString(att.input);
			that.log("Input: " + tmpInput);
			if(tmpInput != "") {
				if(tmpInput=="tuner") {
					that.getBand();
				} else{
					that.ActiveIdentifier = config["identifier"] || that.info[tmpInput]["Identifier"];
				}
			}
		}
	});
	this.inputs =  config["inputs"] || {"airplay": "1. 'inputs' missing", "bluetooth": "2. in config.json", "spotify": "3. please modify"};
	this.active = config["active"] || config["power"] || 0;
	this.powerOnInput = config["powerOnInput"];
	this.mute = 1;
	//this.brightness = config["brightness"] || 100;
	this.updateInterval = 1000;
	this.version = require("./package.json").version;
	this.features = {};
	this.info = {"airplay": {"Identifier": 1, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "airplay"}, 
		"line_cd": {"Identifier": 2, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "line_cd"}, 
		"fm": {"Identifier": 3, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "fm"}, 
		"am": {"Identifier": 4, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "am"}, 
		"dab": {"Identifier": 5, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "dab"}, 
		"server": {"Identifier": 6, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "server"}, 
		"phono": {"Identifier": 7, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "phono"}, 
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
		"hdmi1": {"Identifier": 18, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi1"}, 
		"hdmi2": {"Identifier": 19, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi2"}, 
		"hdmi3": {"Identifier": 20, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi3"}, 
		"hdmi4": {"Identifier": 21, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi4"}, 
		"hdmi5": {"Identifier": 22, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi5"}, 
		"hdmi6": {"Identifier": 23, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi6"}, 
		"hdmi7": {"Identifier": 24, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi7"}, 
		"hdmi8": {"Identifier": 25, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "hdmi8"}, 
		"aux": {"Identifier": 26, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"aux1": {"Identifier": 27, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "aux1"}, 
		"aux2": {"Identifier": 28, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "aux2"}, 
		"av1": {"Identifier": 29, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av2": {"Identifier": 30, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av3": {"Identifier": 31, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av4": {"Identifier": 32, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av5": {"Identifier": 33, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av6": {"Identifier": 34, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"av7": {"Identifier": 35, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"mc_link": {"Identifier": 36, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"main_sync": {"Identifier": 37, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": ""}, 
		"spotify": {"Identifier": 38, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "spotify"}, 
		"deezer": {"Identifier": 39, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "deezer"}, 
		"napster": {"Identifier": 40, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "napster"}, 
		"qobuz": {"Identifier": 41, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "qobuz"}, 
		"juke": {"Identifier": 42, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "juke"}, 
		"tidal": {"Identifier": 43, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "tidal"}, 
		"pandora": {"Identifier": 44, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "pandora"}, 
		"siriusxm": {"Identifier": 45, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "siriusxm"}, 
		"radiko": {"Identifier": 46, "CurrentVisibilityState": 0, "TargetVisibilityState": 0, "Command": "radiko"}};
	this.log.debug(config);
	for(var key in this.inputs) {
		this.log.debug("updating name for " + key);
		tmpInput = this.getInputFromString(key);
		if(tmpInput != "") {
			this.info[tmpInput]["ConfiguredName"]=this.inputs[key];
		}
	}
	this.log("Initialized '" + this.name + "'");
}

MusicCastTV.prototype = {
	identify: function(callback) {
		this.log("Identify " + this.name);
		callback();
	},
	getInputFromString: function(name) {
		switch(name) {
			case "tuner":
				return "tuner"
			case "airplay":
			case "AirPlay":
				return "airplay";
			case "phono":
			case "Phono":
				return "phono";
			case "line_cd":
			case "LineCD":
				return "line_cd";
			case "line1":
			case "Line1":
				return "line1";
			case "line2":
			case "Line2":
				return "line2";
			case "line3":
			case "Line3":
				return "line3";
			case "fm":
			case "FM":
				return "fm";
			case "am":
			case "AM":
				return "am";
			case "dab":
			case "DAB":
				return "dab";
			case "net_radio":
			case "NetRadio":
				return "net_radio";
			case "server":
			case "Server":
				return "server";
			case "bluetooth":
			case "Bluetooth":
				return "bluetooth";
			case "usb":
			case "USB":
				return "usb";
			case "optical1":
			case "Optical1":
				return "optical1";
			case "optical2":
			case "Optical2":
				return "optical2";
			case "coaxial1":
			case "Coaxial1":
				return "coaxial1";
			case "coaxial2":
			case "Coaxial2":
				return "coaxial2";
			case "hdmi1":
			case "HDMI1":
				return "hdmi1";
			case "hdmi2":
			case "HDMI2":
				return "hdmi2";
			case "hdmi3":
			case "HDMI3":
				return "hdmi3";
			case "hdmi4":
			case "HDMI4":
				return "hdmi4";
			case "hdmi5":
			case "HDMI5":
				return "hdmi5";
			case "hdmi6":
			case "HDMI6":
				return "hdmi6";
			case "hdmi7":
			case "HDMI7":
				return "hdmi7";
			case "hdmi8":
			case "HDMI8":
				return "hdmi8";
			case "aux1":
			case "AUX1":
				return "aux1";
			case "aux2":
			case "AUX2":
				return "aux2";
			case "mc_link":
				return "mc_link";
			case "main_sync":
			case "sync":
				return "main_sync";
			case "spotify":
			case "Spotify":
				return "spotify";
			case "deezer":
			case "Deezer":
				return "deezer";
			case "napster":
			case "Napster":
				return "napster";
			case "qobuz":
			case "Qobuz":
				return "qobuz";
			case "juke":
			case "Juke":
				return "juke";
			case "tidal":
			case "Tidal":
				return "tidal";
			case "pandora":
			case "Pandora":
				return "pandora";
			case "siriusxm":
			case "Siriusxm":
			case "SiriusXM":
				return "siriusxm";
			case "radiko":
				return "radiko";
			default:
				this.log("input " + name + " not found");
				return "";
		}
	},
	getInputService: function(name) {
		var tmpInputService = new Service.InputSource(name, name);
		tmpInputService.setCharacteristic(Characteristic.Identifier, this.info[name]["Identifier"]);
		tmpInputService.setCharacteristic(Characteristic.ConfiguredName, this.info[name]["ConfiguredName"]);
		tmpInputService.setCharacteristic(Characteristic.IsConfigured, Characteristic.IsConfigured.CONFIGURED);
		tmpInputService.setCharacteristic(Characteristic.CurrentVisibilityState, 0);
		tmpInputService.getCharacteristic(Characteristic.CurrentVisibilityState).on('get', (callback) => {
			this.log.debug("get CurrentVisibilityState of " + name + ": " + this.info[name]['CurrentVisibilityState']);
			callback(null, this.info[name]['CurrentVisibilityState']);
		}); //0=SHOWN;1=HIDDEN
		tmpInputService.getCharacteristic(Characteristic.TargetVisibilityState).on('get', (callback) => {
			this.log.debug('get TargetVisibilityState of ' + name + ": " + this.info[name]['TargetVisibilityState']);
			callback(null, this.info[name]['TargetVisibilityState']);
		});
		tmpInputService.getCharacteristic(Characteristic.TargetVisibilityState).on('set', (value, callback) => {
			this.info[name]['TargetVisibilityState'] = value;
			this.log('Target Visibility State to ' + value + " " + this.info[name]['ConfiguredName']);
			this.info[name]['CurrentVisibilityState'] = value;
			callback();
		});
		return tmpInputService;
	},
	getBand: function() {
		that = this;
		request({
			method: 'GET',
			url: 'http://' + this.ip + '/YamahaExtendedControl/v1/tuner/getPlayInfo',
			headers: {
				'X-AppName': 'MusicCast/1.0',
				'X-AppPort': '41100',
			},
		}, 
		function (error, response, body) {
			if (error) {
				that.log.debug('getBand get error');
				that.log.error(error.message);
				return error;
			} else if(body) {
				that.log.debug("getBand body: " + body)
				att = JSON.parse(body);
				tmpInput = that.getInputFromString(att.band);
				that.log("Input: " + tmpInput);
				if(tmpInput != "") {
					that.ActiveIdentifier = that.info[tmpInput]["Identifier"];
					that.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
						.updateValue(that.ActiveIdentifier);
				}
			}
		});
	},
	getHttpInput: function() {
		this.tmp="";
		that = this;
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
				that.log.debug('getHttpInput get error');
				that.log.error(error.message);
				return error;
				that.tmp = "error";
			} else if(body) {
				that.log.debug("HttpInput body: " + body)
				att = JSON.parse(body);
				that.active = (att.power=='on');
				that.volume = att.volume;
				that.maxVol = att.max_volume;
				that.log.debug("volume: " + that.volume + " maxVol: " + that.maxVol);
				tmpInput = that.getInputFromString(att.input);
				if(tmpInput != "") {
					if(tmpInput=="tuner") {
						that.getBand();
					} else{
						that.log("Input: " + tmpInput);
						that.ActiveIdentifier = that.info[tmpInput]["Identifier"];
						that.TelevisionService.getCharacteristic(Characteristic.Active)
							.updateValue(that.active);
						that.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
							.updateValue(that.ActiveIdentifier);
					}
				}
				that.tmp = "updated";
			} else{
				that.log(error + "; body: " + body)
			}
		});
	},
	getActive: function(callback) {
		this.tmp = "";
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
				that.log.debug('getActive error');
				that.log.error(error.message);
				that.tmp = "error";
				return callback(error);
			} else{
				att=JSON.parse(body);
				that.log.debug('HTTP getStatus result: ' + att.power);
				that.active = (att.power=='on');
				that.TelevisionService.getCharacteristic(Characteristic.Active)
					.updateValue((att.power=='on'));
				that.tmp = "success";
				that.TelevisionService.getCharacteristic(Characteristic.Active)
					.updateValue(that.active);
				return callback(null, (att.power=='on'));
			}
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
				that.log.error(error.message);
				return error;
			}
		})
		this.log("Active to " + value);
		if(this.powerOnInput&&value) {// missing: filter for state change
			tmpInput = this.getInputFromString(this.powerOnInput);
			this.log("powerOnInput: " + tmpInput);
			this.setActiveIdentifier(this.info[tmpInput]["Identifier"], callback); //turn on powerOnInput
			that.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
						.updateValue(this.info[tmpInput]["Identifier"]);
		} else{
			callback();
		}
	},
	getActiveIdentifier: function(callback) {
		this.getHttpInput();
		setTimeout(() => {
			this.TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
				.updateValue(this.ActiveIdentifier);
		}, this.updateInterval);
		//while(this.tmp=="");
		this.log.debug("get Active Identifier: " + this.ActiveIdentifier);
		callback(null, this.ActiveIdentifier);
	},
	setActiveIdentifier: function(value, callback) {
		const that = this;
		for(var key in this.info) {
			if (this.info[key]["Identifier"] == value) {
				var newInput = this.info[key]["Command"];
				var tmpInput = newInput;
				this.log("Switch to " + value + ": " + newInput);
			}
		}
		if (tmpInput=="am" || tmpInput=="fm" || tmpInput=="dab") {
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
				that.log.error(error.message);
				return callback(error);
			}
		})
		if (tmpInput=="am" || tmpInput=="fm" || tmpInput=="dab") {
			request({
				url: 'http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tmpInput,
				method: 'GET',
				body: ""
			},
			function (error, response) {
				if (error) {
					that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/tuner/setBand?band=' + tmpInput);
					that.log.error(error.message);
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
				this.setVolumeSelector(0, callback);
				break;
			case 5:
				this.log("remoteKeyPress DOWN");
				this.setVolumeSelector(1, callback);
				break;
			case 6:
				this.log("remoteKeyPress LEFT");
				return callback();
			case 7:
				this.log("remoteKeyPress RIGHT");
				return callback();
			case 8:
				this.log("remoteKeyPress OK");
				return callback();
			case 9:
				this.log("remoteKeyPress BACK");
				return callback();
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
				return callback();
			case 15:
				this.log("remoteKeyPress i");
				return callback();
			default:
				this.log("remoteKeyPress " + value);
				return callback();
		}
	},
	getVolume: function(callback) {
		tmp = this.getHttpInput();
		this.log.debug("get Volume: " + this.volume);
		callback(null, this.volume);
	},
	setVolume: function(value, callback) {
		const that = this;
		if (value<0 || this.maxVol<value) {
			this.log("Volume must be between 0 and " + this.maxVol);
			callback();
			return;
		}
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value,
		method: 'GET',
		body: ""
		},
		function (error, response) {
			if (error) {
				that.log.debug('http://' + this.ip + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + value);
				that.log.error(error.message);
				return error;
			}
		})
		this.volume = value;
		this.log("Volume to " + value);
		callback();
	},
	setVolumeSelector: function(value, callback) {
		//this.getHttpInput();
		this.log.debug("VolumeSelector: " + value + ", current Volume: " + this.volume);
		if (value == 0) {
			this.setVolume(this.volume+1, callback);
			//setTimeout(this.setVolume, 1000, this.volume+1, callback);
		}else if (value == 1){
			this.setVolume(this.volume-1, callback);
		}
	},
	
	getServices: function() {
		let informationService = new Service.AccessoryInformation();
		informationService
			.setCharacteristic(Characteristic.Manufacturer, "homebridge-musiccast-tv")
			.setCharacteristic(Characteristic.Model, this.model)
			.setCharacteristic(Characteristic.SerialNumber, "123-456-789")
			.setCharacteristic(Characteristic.FirmwareRevision, this.version);
		this.informationService = informationService;
		
		ServiceList = [];
		ServiceList.push(informationService);
		
		const that = this;
		request({
		url: 'http://' + this.ip + '/YamahaExtendedControl/v1/system/getFeatures',
	        method: 'GET',
		headers: {
			'X-AppName': 'MusicCast/1.0',
			'X-AppPort': '41100',
		}
		},
		function (error, response, body) {
			if (error) {
        			that.log.debug('getServices HTTP error');
        			that.log.error(error.message);
			} else {
				that.features=JSON.parse(body);
				that.log.debug("func_list: " + JSON.stringify(that.features.system.func_list) + 
					", zone_num: " + JSON.stringify(that.features.system.zone_num));
				that.log.debug("zone: " + JSON.stringify(that.features.zone));
			}
		});
		
		let TelevisionService = new Service.Television(this.name);
		TelevisionService
			.setCharacteristic(Characteristic.ConfiguredName, this.name);
		TelevisionService
			.setCharacteristic(Characteristic.SleepDiscoveryMode, 1);
		TelevisionService
			.getCharacteristic(Characteristic.Active)
				.on('get', this.getActive.bind(this))
				.on('set', this.setActive.bind(this));
		 TelevisionService
			.getCharacteristic(Characteristic.ActiveIdentifier)
				.on('get', this.getActiveIdentifier.bind(this))
				.on('set', this.setActiveIdentifier.bind(this));
		TelevisionService
			.getCharacteristic(Characteristic.RemoteKey)
				.on('set', this.remoteKeyPress.bind(this));
		setInterval(() => {
			this.getHttpInput();
			TelevisionService.getCharacteristic(Characteristic.Active)
				.updateValue(this.active);
			TelevisionService.getCharacteristic(Characteristic.ActiveIdentifier)
				.updateValue(this.ActiveIdentifier);
		}, this.updateInterval);
		/*TelevisionService
			.getCharacteristic(Characteristic.PowerModeSelection)//unused
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
		this.TelevisionService = TelevisionService;
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
			.getCharacteristic(Characteristic.Mute) //not triggered via home app
				.on('get', this.getMute.bind(this))
				.on('set', this.setMute.bind(this));
		TelevisionSpeakerService
			.getCharacteristic(Characteristic.Volume) //not triggered via home app
				.on('get', this.getVolume.bind(this))
				.on('set', this.setVolume.bind(this));
		TelevisionService.addLinkedService(TelevisionSpeakerService);
		this.TelevisionSpeakerService = TelevisionSpeakerService;
		ServiceList.push(TelevisionSpeakerService);
		
		for(var key in this.inputs) {
			this.log.debug("processing input " + key);
			tmpInput = this.getInputFromString(key);
			//tmpService = this.getInputService(tmpInput)
			
			switch (tmpInput) {
				case "airplay":
					this.airplayService = this.getInputService("airplay");
					TelevisionService.addLinkedService(this.airplayService);
					ServiceList.push(this.airplayService);
					break;
				case "phono":
					this.phonoService = this.getInputService("phono");
					TelevisionService.addLinkedService(this.phonoService);
					ServiceList.push(this.phonoService);
					break;
				case "line_cd":
					this.line_cdService = this.getInputService("line_cd");
					TelevisionService.addLinkedService(this.line_cdService);
					ServiceList.push(this.line_cdService);
					break;
				case "line1":
					this.line1Service = this.getInputService("line1");
					TelevisionService.addLinkedService(this.line1Service);
					ServiceList.push(this.line1Service);
					break;
				case "line2":
					this.line2Service = this.getInputService("line2");
					TelevisionService.addLinkedService(this.line2Service);
					ServiceList.push(this.line2Service);
					break;
				case "line3":
					this.line3Service = this.getInputService("line3");
					TelevisionService.addLinkedService(this.line3Service);
					ServiceList.push(this.line3Service);
					break;
				case "fm":
					this.fmService = this.getInputService("fm");
					TelevisionService.addLinkedService(this.fmService);
					ServiceList.push(this.fmService);
					break;
				case "am":
					this.amService = this.getInputService("am");
					TelevisionService.addLinkedService(this.amService);
					ServiceList.push(this.amService);
					break;
				case "dab":
					this.dabService = this.getInputService("dab");
					TelevisionService.addLinkedService(this.dabService);
					ServiceList.push(this.dabService);
					break;
				case "net_radio":
					this.net_radioService = this.getInputService("net_radio");
					TelevisionService.addLinkedService(this.net_radioService);
					ServiceList.push(this.net_radioService);
					break;
				case "server":
					this.serverService = this.getInputService("server");
					TelevisionService.addLinkedService(this.serverService);
					ServiceList.push(this.serverService);
					break;
				case "bluetooth":
					this.bluetoothService = this.getInputService("bluetooth");
					TelevisionService.addLinkedService(this.bluetoothService);
					ServiceList.push(this.bluetoothService);
					break;
				case "usb":
					this.usbService = this.getInputService("usb");
					TelevisionService.addLinkedService(this.usbService);
					ServiceList.push(this.usbService);
					break;
				case "optical1":
					this.optical1Service = this.getInputService("optical1");
					TelevisionService.addLinkedService(this.optical1Service);
					ServiceList.push(this.optical1Service);
					break;
				case "optical2":
					this.optical2Service = this.getInputService("optical2");
					TelevisionService.addLinkedService(this.optical2Service);
					ServiceList.push(this.optical2Service);
					break;
				case "coaxial1":
					this.coaxial1Service = this.getInputService("coaxial1");
					TelevisionService.addLinkedService(this.coaxial1Service);
					ServiceList.push(this.coaxial1Service);
					break;
				case "coaxial2":
					this.coaxial2Service = this.getInputService("coaxial2");
					TelevisionService.addLinkedService(this.coaxial2Service);
					ServiceList.push(this.coaxial2Service);
					break;
				case "hdmi1":
					this.hdmi1Service = this.getInputService("hdmi1");
					TelevisionService.addLinkedService(this.hdmi1Service);
					ServiceList.push(this.hdmi1Service);
					break;
				case "hdmi2":
					this.hdmi2Service = this.getInputService("hdmi2");
					TelevisionService.addLinkedService(this.hdmi2Service);
					ServiceList.push(this.hdmi2Service);
					break;
				case "hdmi3":
					this.hdmi3Service = this.getInputService("hdmi3");
					TelevisionService.addLinkedService(this.hdmi3Service);
					ServiceList.push(this.hdmi3Service);
					break;
				case "hdmi4":
					this.hdmi4Service = this.getInputService("hdmi4");
					TelevisionService.addLinkedService(this.hdmi4Service);
					ServiceList.push(this.hdmi4Service);
					break;
				case "hdmi5":
					this.hdmi5Service = this.getInputService("hdmi5");
					TelevisionService.addLinkedService(this.hdmi5Service);
					ServiceList.push(this.hdmi5Service);
					break;
				case "hdmi6":
					this.hdmi6Service = this.getInputService("hdmi6");
					TelevisionService.addLinkedService(this.hdmi6Service);
					ServiceList.push(this.hdmi6Service);
					break;
				case "hdmi7":
					this.hdmi7Service = this.getInputService("hdmi7");
					TelevisionService.addLinkedService(this.hdmi7Service);
					ServiceList.push(this.hdmi7Service);
					break;
				case "hdmi8":
					this.hdmi8Service = this.getInputService("hdmi8");
					TelevisionService.addLinkedService(this.hdmi8Service);
					ServiceList.push(this.hdmi8Service);
					break;
				case "aux":
					this.aux1Service = this.getInputService("aux");
					TelevisionService.addLinkedService(this.auxService);
					ServiceList.push(this.auxService);
					break;
				case "aux1":
					this.aux1Service = this.getInputService("aux1");
					TelevisionService.addLinkedService(this.aux1Service);
					ServiceList.push(this.aux1Service);
					break;
				case "aux2":
					this.aux2Service = this.getInputService("aux2");
					TelevisionService.addLinkedService(this.aux2Service);
					ServiceList.push(this.aux2Service);
					break;
				case "av1":
					this.aux1Service = this.getInputService("av1");
					TelevisionService.addLinkedService(this.av1Service);
					ServiceList.push(this.av1Service);
					break;
				case "spotify":
					this.spotifyService = this.getInputService("spotify");
					TelevisionService.addLinkedService(this.spotifyService);
					ServiceList.push(this.spotifyService);
					break;
				case "deezer":
					this.deezerService = this.getInputService("deezer");
					TelevisionService.addLinkedService(this.deezerService);
					ServiceList.push(this.deezerService);
					break;
				case "napster":
					this.napsterService = this.getInputService("napster");
					TelevisionService.addLinkedService(this.napsterService);
					ServiceList.push(this.napsterService);
					break;
				case "qobuz":
					this.qobuzService = this.getInputService("qobuz");
					TelevisionService.addLinkedService(this.qobuzService);
					ServiceList.push(this.qobuzService);
					break;
				case "juke":
					this.jukeService = this.getInputService("juke");
					TelevisionService.addLinkedService(this.jukeService);
					ServiceList.push(this.jukeService);
					break;
				case "tidal":
					this.tidalService = this.getInputService("tidal");
					TelevisionService.addLinkedService(this.tidalService);
					ServiceList.push(this.tidalService);
					break;
				case "pandora":
					this.pandoraService = this.getInputService("pandora");
					TelevisionService.addLinkedService(this.pandoraService);
					ServiceList.push(this.pandoraService);
					break;
				case "sirusxm":
					this.siriusxmService = this.getInputService("siriusxm");
					TelevisionService.addLinkedService(this.siriusxmService);
					ServiceList.push(this.siriusxmService);
					break;
				case "radiko":
					this.radikoService = this.getInputService("radiko");
					TelevisionService.addLinkedService(this.radikoService);
					ServiceList.push(this.radikoService);
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
		
		return ServiceList;
	}
}
