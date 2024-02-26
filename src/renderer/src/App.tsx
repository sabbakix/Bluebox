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

FocusStyleManager.onlyShowFocusOnTabs()

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const [count, setCount] = useState(0)

  function handleClick(e: SyntheticEvent, param: string): void {
    e.preventDefault()
    console.log(e.target, param)
  }

  function handleClick2(): void {
    setCount(count + 1)
  }

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
                      onClick={(e) => handleClick(e, 'param1')}
                      text="New text box"
                    />
                    <MenuItem
                      icon="new-object"
                      onClick={(e) => handleClick(e, 'param2')}
                      text="New object"
                    />
                    <MenuItem
                      icon="new-link"
                      onClick={(e) => handleClick(e, 'param3')}
                      text="New link"
                    />
                  </Menu>}
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
            <MenuDivider />
            <MenuItem text="Settings..." icon="cog" intent="primary">
              <MenuItem icon="tick" text="Save on edit" />
              <MenuItem icon="blank" text="Compile on edit" />
            </MenuItem>
            <MenuDivider />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param4')} text="New link4" />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param5')} text="New link5" />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param6')} text="New link6" />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param7')} text="New link7" />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param8')} text="New link8" />
            <MenuItem icon="new-link" onClick={(e) => handleClick(e, 'param9')} text="New link9" />
          </Menu>
        </aside>
        <main>
          <h2>Main Content</h2>
          <Button icon="refresh" onClick={() => setCount((count) => count + 1)}>
            count:{count}
          </Button>
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
            <li>1</li>
            <li>2</li>
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
        </main>
        <footer>
          <p>&copy; 2024 Bluebox</p>
        </footer>
      </div>
    </>
  )
}

export default App
