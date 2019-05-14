# JS barcode scanner

A simple barcode scanner with support for shift modifier key.

This package is specifically written for the Rakinda RD4500R USB barcode scanner, but can be used with other 'wedge' usb barcodescanners

Note: Since a wedge scanner is seen as a keyboard on the OS you need elevated rights on macOS or Linux to use the package. You can also specify a udev rule in Linux to own the scanner.

## Installation

Use npm to install the package

## Usage

```js
const UsbScanner = require();


const scanner = new UsbQRScanner() 
```