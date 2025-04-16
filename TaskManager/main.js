const { app, BrowserWindow, screen } = require('electron');

let mainWindow;

app.whenReady().then(() => {

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const path = require('path');

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        resizable: true,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false, // Désactive l'accès au système (plus sécurisé)
            contextIsolation: true, // Isole les contextes (renforce la sécurité)
            devTools: false,        // Désactive les outils développeur (Ctrl+Shift+I)
            sandbox: true,          // Active un mode bac à sable sécurisé
        }        
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
