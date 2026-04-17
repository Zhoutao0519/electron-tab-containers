/* eslint-disable no-unused-vars */
import { BrowserWindow, IpcMainEvent, ipcMain } from 'electron'
import { GDTabPageContainer } from '../pages'

export class DesktopService {
  private static instance: DesktopService

  static get shared(): DesktopService {
    if (!DesktopService.instance) {
      DesktopService.instance = new DesktopService()
    }
    return DesktopService.instance
  }

  public init() {
    ipcMain.handle('desktop:service', async (event: any, params?: any) => {
      const type = params['type']
      const data = params['data']
      const func = functionMap[type]
      if (!func) {
        throw new Error(type + ' 方法未实现')
      }
      return func(event, data)
    })
  }
}

const closeTabOnTabPage = async (_event: any, { id = -1 }) => {
  GDTabPageContainer.shared.closeTab(id)
  return {}
}

const frameDidReadyOnTabPage = async (_event: any) => {
  GDTabPageContainer.shared.setFrameReady()
  return {}
}

const switchTabOnWindow = (_: IpcMainEvent, { id = -1 }) => {
  GDTabPageContainer.shared.switchTabWithId(id, false)
}

const createTabOnWindow = (_: IpcMainEvent, { url = '' }) => {
  GDTabPageContainer.shared.createTab(url)
}

const getWindowFromEvent = (event: IpcMainEvent): BrowserWindow | null => {
  return BrowserWindow.fromWebContents(event.sender)
}

const minimizeWindow = (event: IpcMainEvent) => {
  const window = getWindowFromEvent(event)
  window?.minimize()
}

const toggleFullscreenWindow = (event: IpcMainEvent) => {
  const window = getWindowFromEvent(event)
  if (!window) return
  window.setFullScreen(!window.isFullScreen())
}

const closeWindow = (event: IpcMainEvent) => {
  const window = getWindowFromEvent(event)
  window?.close()
}

const functionMap: any = {
  closeTabOnTabPage: closeTabOnTabPage,
  frameDidReadyOnTabPage: frameDidReadyOnTabPage,
  switchTabOnWindow: switchTabOnWindow,
  createTabOnWindow: createTabOnWindow,
  minimizeWindow: minimizeWindow,
  toggleFullscreenWindow: toggleFullscreenWindow,
  closeWindow: closeWindow,
}
