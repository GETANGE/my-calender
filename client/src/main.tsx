import React from 'react'
import ReactDOM from 'react-dom/client'
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
  </React.StrictMode>
)