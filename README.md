<p align="center">
<img src="docs/nincid.png"><br><br>
A multiplatform Electron solution to <a href="https://github.com/jaburns/NintendoSpy">NintendoSpy</a>. Please see their repository for any and all setup of Arduino devices.
</p>

## Skins
Built-in skins are the minimalist versions of the NES, SNES, N64, and GameCube from [Proximity Sound](https://proximitysound.com/skins/).

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