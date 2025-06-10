import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './index.css' // Tailwind 등을 사용하는 경우

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)