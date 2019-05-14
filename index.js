const HID = require('node-hid').HID;
const EventEmitter = require('events');
const hidMap = require('./hidmap');

class UsbQRScanner extends EventEmitter {

	constructor(options) {
		let { vendorID, productID, path } = options;

		super();

		if(path) this.hid = new HID(path);
		else if (vendorID && productID) this.hid = new HID(vendorID, productID);
		else console.error('Device cannot be found, please suply a path or VID & PID'); // eslint-disable-line

		this._hidMap = hidMap.standard;
		this._hidMapShift = hidMap.shift;

		// Bind 'this' to the methods
		this.startScanning = this.startScanning.bind(this);
	}

	startScanning() {
		let barcode = [];

		this.hid.on('data', (data) => {
			const modifierValue = data[0];
			const characterValue = data[2];

			if (characterValue !== 0) {
				if (modifierValue === 2 || modifierValue === 20) {
					barcode.push(this._hidMapShift[characterValue]);
				} else if (characterValue !== 40) {
					barcode.push(this._hidMap[characterValue]);
				} else if (characterValue === 40) {
					let scanResult = barcode.join('');
					barcode = [];
					this.emit('data', scanResult);
				}
			}
		});
	}
}

module.export = UsbQRScanner;