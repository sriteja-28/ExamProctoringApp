import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const queryParams = new URLSearchParams(window.location.search);
const token = queryParams.get('token');
if (token) {
  console.log('Token received from Google OAuth:', token);
  localStorage.setItem('token', token);
  window.history.replaceState({}, document.title, "/");
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);



//!Testing
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import VideoProctor from './components/VideoProctor';

// const handlePermissions = (granted) => {
//   console.log(`Permissions granted: ${granted}`);
// };

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <VideoProctor onPermissionsGranted={handlePermissions} />
//   </React.StrictMode>
// );
