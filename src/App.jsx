<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Importa el nuevo componente de Navbar
import Home from './pages/Home';
import Categoria from './pages/Categoria';
import Login from './pages/Login';
import Register from './pages/Register';
import Buscar from './pages/Buscar';
=======
import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Login from './pages/Login'
import Register from './pages/Register'
import Buscar from './pages/Buscar'

>>>>>>> 2938ce1 (Descripción de los cambios realizados)

export const App = () => {
  return (
    <>
      <Navbar /> {/* Muestra el Navbar en todas las páginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="categoria" element={<Categoria />} />
        <Route path="buscar" element={<Buscar />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </>
  );
}
