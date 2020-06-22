# Changelog

## v0.2.1 (22 June 2020)

Changed serial port check from `if (port.manufacturer != undefined)` to `if (port.productId != undefined)`. Using `win.setMinimumSize()` workaround to shrink screen on `win.setSize()`. Changed `nincid.svg` from font-based to path-based. Natively building on all platforms.

## v0.2.0 (17 June 2020)

Implemented custom skins.

## v0.1.1 (15 June 2020)

Removed `"skipTaskbar": true` from `BrowserWindow` constructor to eliminate the app pseudo-closing on Windows.

## v0.1.0 (15 June 2020)

Initial release.