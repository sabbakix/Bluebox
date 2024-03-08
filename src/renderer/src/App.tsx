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
  function ipcHandle(): void {
    return window.electron.ipcRenderer.send('ping')
  }
  const ipc_setTitle = (title: string): void => window.electron.ipcRenderer.send('set-title', title)

  // Pattern 2: Renderer to main (two-way)
  async function handleOpenfileClick(): Promise<boolean> {
    console.log('open file fired')
    const filePath = await window.electron.ipcRenderer.invoke('dialog:openFile')
    const filePathElement = document.getElementById('path1')
    if (filePathElement) {
      {
        filePathElement.innerText = filePath
      }
    }
    return true
  }

  // Pattern 3: Main to renderer
  // Receive messages from the main process
  window.electron.ipcRenderer.on('update-counter', (_, args) => {
    console.log('update-counter', args)
    const counter = document.getElementById('counter')
    if (counter) {
      const oldValue = Number(counter.innerText)
      const newValue = oldValue + args
      counter.innerText = newValue.toString()
    } else {
      console.log('no counter')
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
              onClick={(e) => handleClick(e, 'param1')}
              text="New text box"
            />
            <MenuItem
              icon="new-object"
              onClick={(e) => handleClick(e, 'param2')}
              text="New object"
            />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param3')} text="New link" />
            <MenuItem icon="new-link" onClick={handleOpenfileClick} text="Open File" />
            <MenuDivider />
            <MenuItem text="Imposta Titolo" icon="cog" intent="primary">
              <MenuItem icon="tick" text="Buongiorno" onClick={() => ipc_setTitle('Buongiorno')} />
              <MenuItem icon="blank" text="Buonasera" onClick={() => ipc_setTitle('Buonasera')} />
              <MenuItem icon="blank" text="Hello" onClick={() => ipc_setTitle('Hello')} />
            </MenuItem>
            <MenuDivider />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page1')} text="Main" />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page2')} text="page2" />
            <MenuItem icon="new-link" onClick={(e) => showPage(e, 'page3')} text="page3" />
            <MenuItem icon="comment" onClick={(e) => handleClick(e, 'param9')} text="New link9" />
          </Menu>
        </aside>
        <main>
          <div id="page1" className="page page-show">
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
              <div className="action">
                <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
                  Send IPC
                </a>
              </div>
            </div>
            <Versions></Versions>

            <ul>
              <li>
                Open file: <span id="path1">1</span>
              </li>
              <li>APPDATA: {window.electron.process.env['APPDATA']}</li>
              <li>HOME: {window.electron.process.env['HOME']}</li>
              <li>HOMEDRIVE: {window.electron.process.env['HOMEDRIVE']}</li>
              <li>HOSTNAME: {window.electron.process.env['HOSTNAME']}</li>
              <li>OS: {window.electron.process.env['OS']}</li>
              <li>TEMP: {window.electron.process.env['TEMP']}</li>
              <li>USERNAME: {window.electron.process.env['USERNAME']}</li>
              <li>platform: {window.electron.process.platform}</li>

              <li>4ewrwer</li>
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
              <li>5weriweuroi</li>
              <li>6ddeewr</li>
              <li>4ewrwer</li>
              <li>5weriweuroi</li>
              <li>6ddeewr</li>
              <li>7ddf</li>
              <li>8x</li>
              <li>1</li>
              <li>2</li>
              <li>3r</li>
              <li>4ewrwer</li>
              <li>5weriweuroi</li>
              <li>6ddeewr</li>
              <li>7ddf</li>
              <li>8x</li>
              <li>3r</li>
              <li>4ewrwer</li>
              <li>5weriweuroi</li>
              <li>6ddeewr</li>
              <li>7ddf</li>
              <li>8x</li>
              <li>1</li>
              <li>2</li>
              <li>3r</li>
              <li>4ewrwer</li>
              <li>5weriweuroi</li>
              <li>6ddeewr</li>
              <li>7ddf</li>
              <li>fine</li>
            </ul>
          </div>
          <div id="page2" className="page page-hide">
            <h2> page 2 </h2>
          </div>
          <div id="page3" className="page page-show">
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
