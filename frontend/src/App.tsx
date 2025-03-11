import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar'
import './App.css'
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './router/route';





function App() {
  return (
    <div>
        <Navbar />
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />}  />
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<HomePage />}  /> 
            </Route>
        </Routes>
    </div>
  )
}

export default App