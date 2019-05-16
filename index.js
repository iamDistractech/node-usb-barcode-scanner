const HID = require('node-hid').HID;
const devices = require('node-hid').devices();
const EventEmitter = require('events');
const hidMap = require('./hidmap');

class UsbScanner extends EventEmitter {

	constructor(options) {
		let { 
			vendorID,
			productID,
			path,
			vCardString = true,
			vCardSeperator = '|'
		} = options;
		
		super();

		this._vCardString = vCardString;
		this._vCardSeperator = vCardSeperator;

		if(path) this.hid = new HID(path);
		else if (vendorID && productID) this.hid = new HID(vendorID, productID);
		else console.error('Device cannot be found, please supply a path or VID & PID'); // eslint-disable-line

		this._hidMap = hidMap.standard;
		this._hidMapShift = hidMap.shift;

		// Bind 'this' to the methods
		this.startScanning = this.startScanning.bind(this);
	}

	static showDevices() {
		return devices;
	}


	startScanning() {
		let scanResult = [];
		let vCard = [];

		this.hid.on('data', (data) => {
			const modifierValue = data[0];
			const characterValue = data[2];

			if (characterValue !== 0) {
				if (modifierValue === 2 || modifierValue === 20) {
					scanResult.push(this._hidMapShift[characterValue]);
				} else if (characterValue !== 40) {
					scanResult.push(this._hidMap[characterValue]);
				} else if (characterValue === 40) {
					let barcode = scanResult.join('');
					scanResult = [];

					barcode = removeUTF8(barcode);
					
					if (this._vCardString) {
						if (barcode === 'BEGIN:VCARD') {
							vCard.push(barcode);
						} else if (barcode === 'END:VCARD') {
							vCard.push(barcode);
							vCard = vCard.join(this._vCardSeperator);
							this.emit('data', vCard);
							vCard = [];
						} else if (vCard.length > 0 ) {
							vCard.push(barcode);
						} else this.emit('data', barcode);
					} else {
						this.emit('data', barcode);
					}
				}
			}
		});
	}
}


function removeUTF8(barcode) {
	let utf8 = barcode.slice(0, 7);
	if (utf8 === '\\000026') {
		barcode = barcode.slice(7);
		return barcode;
	} else return barcode;
}

module.exports = UsbScanner;