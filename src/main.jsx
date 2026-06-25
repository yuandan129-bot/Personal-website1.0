import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// 生产构建时 basename 为 GitHub Pages repo 名，本地 dev 为 /
const basename = import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL : undefined

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
