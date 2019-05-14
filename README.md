# JS barcode scanner

A simple barcode scanner with support for shift modifier key.

This package is specifically written for the Rakinda RD4500R USB barcode scanner, but can be used with other 'wedge' usb barcodescanners

Note: Since a wedge scanner is seen as a keyboard on the OS you need elevated rights on macOS or Linux to use the package. You can also specify a udev rule in Linux to own the scanner.

## Installation

Use npm to install the package

```bash
npm install @isirthijs/barcode-scanner
```

## Usage

### Initialize

create a new instance of a scanner by passing the productID/vendorID or the path of the scanner into the constructor

```js
const UsbScanner = require('@isirthijs/barcode-scanner');

// Using vendorID and ProductID
const options = {
	vendorID:  1234,
	productID: 5678
}
// Using path
const options = {
	path: 'IOService:/AppleACPI....'
}

const scanner = new UsbScanner(options)
```

### Reading barcodes

```js
scanner.on('data', (data) => {
	/// your code
	console.log(data);
});

scanner.startScanning()
```

## Complete API

### scanner = new UsbScanner({vid, pid})

* Creates a new scanner using the VendorID and ProductID

### scanner = new UsbScanner({path})

* Creates a new scanner using at the specified path

### scanner.startScanning()

* Starts listening for barcodes

### scanner.on('data', functions(data) {})

* listen for the `data` event to receive the barcode
* `data` - a `string` containing the barcode as readable text from the scanner