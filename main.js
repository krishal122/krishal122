const { app, BrowserWindow, ipcMain, dialog } = require('electron');

app.disableHardwareAcceleration();

const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('save-note', async (event, text) => {
  const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
  fs.writeFileSync(filePath, text, 'utf-8');
  return { success: true };
});
ipcMain.handle('load-note', async () => {
  const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return '';
});
// NEW: Save As handler
ipcMain.handle('save-as', async (event, text) => {
  const result = await dialog.showSaveDialog({
    defaultPath: 'mynote.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (result.canceled) {
    return { success: false };
  }

  fs.writeFileSync(result.filePath, text, 'utf-8');
  return { success: true, filePath: result.filePath };
});
// NEW: New Note handler
ipcMain.handle('new-note', async (event) => {
  const result = await dialog.showMessageBox({
    type: 'warning',
    buttons: ['Discard Changes', 'Cancel'],
    defaultId: 1,
    title: 'Unsaved Changes',
    message: 'You have unsaved changes. Start a new note anyway?'
  });

  // result.response === 0 means user chose 'Discard Changes'
  return {confirmed: result.response === 0};
});
// NEW: Open file handler
ipcMain.handle('open-file', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  });

  if (result.canceled) {
    return { success: false };
  }

  const filePath = result.filePaths[0];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return { success: true, filePath: filePath, content: fileContent };
});

// Move Note to Trash
ipcMain.handle('move-to-trash', async (event, text) => {

  const trashPath = path.join(
    app.getPath('documents'),
    'trashnote.txt'
  );

  fs.writeFileSync(trashPath, text, 'utf-8');

  return { success: true };
});

// Restore Note from Trash
ipcMain.handle('restore-note', async () => {

  const trashPath = path.join(
    app.getPath('documents'),
    'trashnote.txt'
  );

  if (fs.existsSync(trashPath)) {

    const content =
      fs.readFileSync(trashPath, 'utf-8');

    return {
      success: true,
      content: content
    };
  }

  return { success: false };
});

// Empty Trash Permanently
ipcMain.handle('empty-trash', async () => {

  const trashPath = path.join(
    app.getPath('documents'),
    'trashnote.txt'
  );

  if (fs.existsSync(trashPath)) {
    fs.unlinkSync(trashPath);
  }

  return { success: true };
});