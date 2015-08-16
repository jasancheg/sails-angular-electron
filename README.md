# sails-angular-electron

> Basic cross platform desktop application built with [SailsJS](http://sailsjs.org/), [AngularJS](https://angularjs.org/) and [Electron](http://electron.atom.io/)

(currently working on it...)

### Features

- Cross platform desktop application built with Electron (Mac OS, Windows, Linux)
- Rest API built with Sailsjs (server App)
- User interface built in Angularjs (client App)
- *NeDB*, embedded persistent database with no dependency(except npm modules)
- User authentication and session control (JWT, register, login, logout)
- Simple Dashboard
- Custom context menu

## Dev

For use the [electron-packager](https://github.com/maxogden/electron-packager) cli
```
npm i electron-packager -g
```

install root dependencies

```
$ npm install
```

install the server app dependencias (sails)

```
$ cd app/server
$ npm install
```

### Dev Tools

Toggle Dev Tools. Debug features using [electron-debug](https://github.com/sindresorhus/electron-debug).

- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd>

### Reload

Force reload the window.

- OS X: <kbd>Cmd</kbd> <kbd>R</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>R</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>R</kbd>

### Run

```
$ npm start
```

### Build

- Build all bundles: `$ npm run build`
- Build Mac os bundle: `$ npm run build-mac`
- Build Windows 32: `$ npm run build-win32`
- Build Windows 64: `$ npm run build-win64`
- Build linux 32: `$ npm run build-linux32`
- Build linux 64: `$ npm run build-linux64`

Builds the app for OS X, Linux, and Windows, using [electron-packager](https://github.com/maxogden/electron-packager).


## License

MIT © [Jose Antonio Sanchez](https://github.com/jasancheg)
