import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'
// import DriverEnRoute from './components/DriverEnRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* <DriverEnRoute /> */}
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
