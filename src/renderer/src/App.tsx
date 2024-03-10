import './assets/App.scss'

import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { useState, SyntheticEvent } from 'react'
import {
  FocusStyleManager,
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Popover
} from '@blueprintjs/core'

// hide focus outine on buttons
FocusStyleManager.onlyShowFocusOnTabs()

function App(): JSX.Element {
  //
  // show/hide pages //
  //
  function showPage(e: SyntheticEvent, id: string): void {
    e.preventDefault()
    // hide al pages
    const pages = document.getElementsByClassName('page') // Creates an HTMLObjectList not an array.
    Array.prototype.forEach.call(pages, function (page) {
      page.classList.remove('page-show')
      page.classList.add('page-hide')
      //console.log('page:', page)
    })
    // show selected page
    const activePage = document.getElementById(id)
    if (activePage) {
      activePage.classList.remove('page-hide')
      activePage.classList.add('page-show')
    }
  }

  //
  // Simple react state
  //
  const [count, setCount] = useState(0)

  function handleClick(e: SyntheticEvent, param: string): void {
    e.preventDefault()
    console.log(e.target, param)
  }

  function handleClick2(): void {
    setCount(count + 1)
  }

  //
  //      IPC channels
  //
  // Pattern 1: Renderer to main (one-way)
  function ipcHandleRendToMain1way(): void {
    return window.electron.ipcRenderer.send('ping')
  }
  const ipc_setTitle = (title: string): void => window.electron.ipcRenderer.send('set-title', title)

  // Pattern 2: Renderer to main (two-way)
  async function ipcHandleRendToMain2way(): Promise<boolean> {
    console.log('open file fired')
    const filePath = await window.electron.ipcRenderer.invoke('dialog:openFile')
    const filePathElement = document.getElementById('filepath')
    if (filePathElement) {
      {
        filePathElement.innerText = filePath
      }
    }
    return true
  }

  // Pattern 3: Main to renderer
  // Receive messages from the main process
  window.electron.ipcRenderer.on('message-m2r', (_, args) => {
    console.log('message-m2r: ', args)
    const elem = document.getElementById('message-from-main')
    if (elem) {
      elem.innerText = args
    }
  })

  return (
    <>
      <div className="container bp5-dark">
        <header>
          <Navbar>
            <NavbarGroup className="bp5-align-left">
              <NavbarHeading>Bluebox</NavbarHeading>
              <NavbarDivider />
              <Button className="bp5-minimal" icon="home" text="Home" />
              <Button className="bp5-minimal" icon="document" text="Files" />
              <Popover
                minimal={true}
                usePortal={false}
                hoverCloseDelay={0}
                hoverOpenDelay={0}
                content={
                  <Menu>
                    <MenuItem
                      icon="new-text-box"
                      onClick={() => ipc_setTitle('Ciao')}
                      text="Cambia titolo in : Ciao"
                    />
                    <MenuItem
                      icon="new-object"
                      onClick={() => ipc_setTitle('Hello')}
                      text="Cambia titolo in: Hello"
                    />
                    <MenuItem
                      icon="new-link"
                      onClick={(e) => handleClick(e, 'param3')}
                      text="New link"
                    />
                  </Menu>
                }
                placement="bottom-start"
              >
                <Button
                  alignText="left"
                  icon="applications"
                  rightIcon="caret-down"
                  text="Edit"
                  minimal={true}
                />
              </Popover>
            </NavbarGroup>
            <NavbarGroup className="bp5-align-right">
              <NavbarDivider />
              <Button className="bp5-button bp5-minimal bp5-icon-user"></Button>
              <Button className="bp5-button bp5-minimal bp5-icon-notifications"></Button>
              <Button className="bp5-button bp5-minimal bp5-icon-cog"></Button>
            </NavbarGroup>
          </Navbar>
        </header>
        <aside>
          <Menu>
            <MenuItem
              icon="new-text-box"
              onClick={(e) => showPage(e, 'page-set-state')}
              text="Set state"
            />
            <MenuItem
              icon="new-text-box"
              onClick={(e) => showPage(e, 'page-ipc-com')}
              text="Ipc Communication"
            />
            <MenuItem
              icon="new-text-box"
              onClick={(e) => showPage(e, 'page-env-vars')}
              text="Environment Vars"
            />
            <MenuItem
              icon="new-text-box"
              onClick={(e) => handleClick(e, 'param1')}
              text="New text box"
            />
            <MenuItem
              icon="new-object"
              onClick={(e) => handleClick(e, 'param2')}
              text="New object"
            />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param3')} text="New link" />
            <MenuItem icon="new-link" onClick={ipcHandleRendToMain2way} text="Open File" />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page1')} text="Main" />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page2')} text="page2" />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page3')} text="page3" />
            <MenuDivider />
            <MenuItem text="Imposta Titolo" icon="cog" intent="primary">
              <MenuItem
                icon="tick"
                text="Set Title Bluebox"
                onClick={() => ipc_setTitle('Bluebox')}
              />
              <MenuItem icon="blank" text="Set Title _box" onClick={() => ipc_setTitle('_box')} />
            </MenuItem>
            <MenuDivider />

            <MenuItem icon="comment" onClick={(e) => handleClick(e, 'param9')} text="New link9" />
          </Menu>
        </aside>
        <main>
          <div id="page-set-state" className="page page-hide">
            <h2>page-set-state</h2>
            <ul>
              <li>
                <Button icon="refresh" onClick={() => setCount((count) => count + 1)}>
                  count:{count}
                </Button>
                <br />
                <br />
              </li>
              <li>
                <Button icon="refresh" onClick={() => setCount((count) => count + 1)}>
                  count:{count}
                </Button>
                <br />
                <br />
              </li>
              <li>
                <Button icon="refresh" onClick={() => setCount((count) => count + 1)}>
                  count:{count}
                </Button>
                <br />
                <br />
              </li>
              <li>{count}</li>
            </ul>
          </div>
          <div id="page-ipc-com" className="page page-hide">
            <h2>page-ipc-com</h2>
            <ul>
              <li>
                <h4>Render to main one-way</h4>
                <p>
                  <Button icon="send-message" onClick={ipcHandleRendToMain1way}>
                    Send Ping
                  </Button>
                </p>
              </li>
              <li>
                <h4>Render to main two-way</h4>
                <p>
                  <Button icon="send-message" onClick={ipcHandleRendToMain2way}>
                    Open File
                  </Button>
                </p>
                <p>
                  File Path: <span id="filepath"></span>
                </p>
              </li>
              <li>
                <h4>Main to render one-way</h4>
                <p>
                  Message from moan process: <span id="message-from-main"></span>
                </p>
              </li>
            </ul>
          </div>
          <div id="page-env-vars" className="page page-show">
            <h2>page-env-vars</h2>
            <ul>
              <li>APPDATA: {window.electron.process.env['APPDATA']}</li>
              <li>HOME: {window.electron.process.env['HOME']}</li>
              <li>HOMEDRIVE: {window.electron.process.env['HOMEDRIVE']}</li>
              <li>HOSTNAME: {window.electron.process.env['HOSTNAME']}</li>
              <li>OS: {window.electron.process.env['OS']}</li>
              <li>TEMP: {window.electron.process.env['TEMP']}</li>
              <li>USERNAME: {window.electron.process.env['USERNAME']}</li>
              <li>platform: {window.electron.process.platform}</li>
              <li>
                ENV:
                <ul>
                  {Object.keys(window.electron.process.env).map((key) => (
                    <li key={key}>
                      {key}: {window.electron.process.env[key]}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
          <div id="page1" className="page page-hide">
            <h2>Main Content</h2>
            <Button icon="refresh" onClick={() => setCount((count) => count + 1)}>
              count:{count}
            </Button>
            <p>
              Current value: <strong id="counter">0</strong>
            </p>
            <img alt="logo" className="logo" src={electronLogo} />
            <div className="creator">Powered by electron-vite</div>
            <div className="text">
              Build an Electron app with <span className="react">React</span>
              &nbsp;and <span className="ts">TypeScript</span>
            </div>
            <div>
              <Button className="button" onClick={handleClick2} text="Hello ">
                {count}
              </Button>
            </div>
            <p className="tip">
              Please try pressing <code>F12</code> to open the devTool
            </p>
            <div className="actions">
              <div className="action">
                <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
                  Documentation
                </a>
              </div>
            </div>
            <Versions></Versions>
          </div>
          <div id="page2" className="page page-hide">
            <h2> page 2 </h2>
          </div>
          <div id="page3" className="page page-hide">
            <h2>Page 3 </h2>
          </div>
        </main>
        <footer>
          <p>&copy; 2024 Bluebox</p>
        </footer>
      </div>
    </>
  )
}

export default App
