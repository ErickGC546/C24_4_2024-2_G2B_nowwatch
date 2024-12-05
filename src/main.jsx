import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { App } from './App'
import './index.css'

const CLIENT_ID = '93151703613-9oa78lt5h7lf7gimrnlluciag49pi4hn.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);