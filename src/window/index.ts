import { BrowserWindow, app } from 'electron'
import path from 'path'
import { getPreloadPath, getSendEventJS, handleOpenWindow, startDevToolsIfNeed } from '../helpers/web'
import { GNBEventBus } from '../helpers/event-bus'
import { eventKey } from '../const'

export let mainWindow: BrowserWindow

export function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
    },
  })

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../render/index.html'))
  } else {
    win.loadURL('http://localhost:9080')
  }

  const handler = (data: any) => {
    win.webContents?.executeJavaScript(getSendEventJS(eventKey, data))
  }
  GNBEventBus.shared.subscribe(handler)

  handleOpenWindow(win.webContents)

  startDevToolsIfNeed(win.webContents)

  mainWindow = win
}
