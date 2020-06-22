<p align="center">
<img src="docs/nincid.png"><br><br>
A multiplatform Electron solution to <a href="https://github.com/jaburns/NintendoSpy">NintendoSpy</a>. Please see their repository for any and all setup of Arduino devices.<br>
Source code for NinCID is available on <a href="https://github.com/slashinfty/nincid">GitHub</a>.
</p>

## Releases

Current Version: 0.2.1

<a href="https://github.com/slashinfty/nincid/releases/latest/download/NinCID_Setup_0.2.0.exe">Windows (.exe)</a><br>
<a href="https://github.com/slashinfty/nincid/releases/latest/download/NinCID-0.2.0.dmg">Mac (.dmg)</a><br>
<a href="https://github.com/slashinfty/nincid/releases/latest/download/nincid_0.2.0_amd64.deb">Linux (.deb)</a><br>
<a href="https://github.com/slashinfty/nincid/releases/latest/download/NinCID-0.2.0.AppImage">Linux (.AppImage)</a>

Note: when launching the .AppImage, add the option `--no-sandbox`

View the [Changelog](changelog.md).

## Skins
Built-in skins are the minimalist versions of the NES, SNES, N64, and GameCube from [Proximity Sound](https://proximitysound.com/skins/). There is an additional Super Game Boy console skin in the colors of the original Game Boy.

Custom skins require a `skin.json` in the format below with all corresponding images in a single folder (select the folder when loading the custom skin).

```json
{
  "name": "name of skin",
  "author": "name of author",
  "console": "nes",
  "height": 441,
  "width": 981,
  "background": "back.png",
  "buttons": [
    {
      "name": "button name",
      "image": "button.png",
      "x": "200",
      "y": "150",
      "height": "30",
      "width": "30",
      "range": "35"
    },
    {
      "name": "different button",
      "image": "another.png",
      "x": "410",
      "y": "175"
    }
  ]
}
```

Name and author are optional. Console must be `nes`, `snes`, `n64`, `gcn`, or `sgb`. Height and width are mandatory, and should match the background image's dimensions. For buttons, name must be one of the following (corresponding to the button): `a, b, x, y, z, l, r, start, select, up, down, left, right, stick, cup, cdown, cleft, cright, cstick`. Image, x, and y are mandatory. Height and width are optional, but allow you to reuse the same image for multiple buttons of different sizes. Range is mandatory for analog sticks, and not allowed for buttons.

## Cloning
```bash
# Clone repository
git clone https://github.com/slashinfty/nincid.git && cd nincid

# Install
yarn install

# If permissions are not set on chrome-sandbox when attempting to start
sudo chown root node_modules/electron/dist/chrome-sandbox && sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

# If there is an error about bindings and node versions after starting
rm yarn.lock && rm -rf node_modules/serialport node_modules/@serialport
yarn install
./node_modules/.bin/electron-rebuild # For Linux/Mac
# For Windows:
# .\node_modules\.bin\electron-rebuild.cmd 

# Start
yarn start
```