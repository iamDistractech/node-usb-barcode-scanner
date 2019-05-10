const HID = require('node-hid').HID;
const EventEmitter = require('events');
const hidMap = require('./hidmap');

class UsbQRScanner extends EventEmitter {
	/**
	 * Where to look for the USB scanner, give either the VID/PID or the path to the device
	 * @param {object} options
	 * @param {number} options.vendorID The VID of the USB scanner
	 * @param {number} options.productID The PID of the USB scanner
	 * @param {string} options.path The path to the USB scanner
	 */
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

const options = {
	vendorID: 7851,
	productID: 6659
};

const qrScanner = new UsbQRScanner(options);

qrScanner.on('data', (data) =>  console.log(data)); // eslint-disable-line

qrScanner.startScanning();