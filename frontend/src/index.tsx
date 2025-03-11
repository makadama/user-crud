import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import './index.css';
import App from './App';
import { AuthProvider } from './providers/AuthProvider';
import { ModalProvider } from './providers/ModalProvider';
import { UsersProvider } from './providers/UsersProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UsersProvider>
        <ModalProvider>
          <BrowserRouter>
            <ToastContainer position="top-center" autoClose={3000} />
            <App />
          </BrowserRouter>
        </ModalProvider>
      </UsersProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
