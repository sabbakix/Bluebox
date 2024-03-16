import { HotkeysProvider } from '@blueprintjs/core'

import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/datetime2/lib/css/blueprint-datetime2.css'
import '@blueprintjs/select/lib/css/blueprint-select.css'
import '@blueprintjs/table/lib/css/table.css'

//import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HotkeysProvider>
    <App />
  </HotkeysProvider>
)
/*
  <React.StrictMode>
    <App />
  </React.StrictMode>
*/
