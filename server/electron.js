const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;

let electronWindow;

const isAvailable = function() {
    return app && BrowserWindow;
}

const isDesktop = function() {
    return !!process.env.IS_DESKTOP;
}

const start = function(PORT) {
    if (!isAvailable()) {
        return;
    }

    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    console.log('> window size: ', width, height);

    electronWindow = new BrowserWindow({width, height})
    electronWindow.loadURL(`http://localhost:${PORT}`);
    console.log('> window size: ', width, height);

    electronWindow.on('closed', () => {
        electronWindow = null;
    });
}

const setup = function() {
    return new Promise(function(resolve, reject) {
        if (!isAvailable()) {
            resolve();
        } else {
            app.on('ready', resolve);
            // Quit when all windows are closed.
            app.on('window-all-closed', () => {
                if (process.platform !== 'darwin') {
                    app.quit();
                }
            });

            app.on('activate', () => {
                if (electronWindow === null) {
                    start();
                }
            });
        }
    });
}

module.exports = {
    setup: setup,
    start: start,
    isAvailable: isAvailable,
    isDesktop: isDesktop
};
