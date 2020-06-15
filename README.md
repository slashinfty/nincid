<p align="center">
<img src="docs/nincid.png"><br><br>
A multiplatform Electron solution to <a href="https://github.com/jaburns/NintendoSpy">NintendoSpy</a>. Please see their repository for any and all setup of Arduino devices.<br>
Source code for NinCID is available on <a href="https://github.com/slashinft/nincid">GitHub</a>.
</p>

## Releases

Current Version: 0.1.0

<a href="https://github.com/slashinfty/nincid/releases/latest/download/NinCID_Setup_0.1.0.exe">Windows</a><br>
<a href="https://github.com/slashinfty/nincid/releases/latest/download/nincid_0.1.0_amd64.deb">Linux (.deb)</a><br>
<a href="https://github.com/slashinfty/nincid/releases/latest/download/NinCID-0.1.0.AppImage">Linux (.AppImage)</a>

Note: when launching the .AppImage, add the option `--no-sandbox`

## Skins
Built-in skins are the minimalist versions of the NES, SNES, N64, and GameCube from [Proximity Sound](https://proximitysound.com/skins/). There is an additional Super Game Boy console skin in the colors of the original Game Boy.

Local skin compatibility is a work in progress.

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
./node_modules/.bin/electron-rebuild

# Start
yarn start
```