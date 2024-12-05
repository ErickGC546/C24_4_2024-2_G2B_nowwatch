import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Login from './pages/Login'
import Register from './pages/Register'

export const App = () => {
  return (
    <>
       <Routes>
        {/* Layout con Navbar */}
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="categoria" element={<Categoria />} />
        </Route>

        {/* Layout sin Navbar */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  );
}
