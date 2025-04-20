import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './globals.css'
 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App redirectUrl={import.meta.env.VITE_REDIRECT_URL || ''}
      signInUrl={import.meta.env.VITE_SIGNIN_URL || ''} />
  </React.StrictMode>,
)
