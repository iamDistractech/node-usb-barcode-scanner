const UsbScanner = require('../index');
require('dotenv').config();

const options = {
	vendorID: process.env.VENDOR_ID,
	productID: process.env.PRODUCT_ID,
	path: undefined
};

const scanner = new UsbScanner(options);

scanner.on('data', (data) => console.log(data)); //eslint-disable-line

let devices = UsbScanner.showDevices();
console.log(devices); 

scanner.startScanning();