import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Buscar from './pages/Buscar'
import Perfil from './pages/Perfil'



export const App = () => {
  return (
    <>
      <Navbar /> {/* Muestra el Navbar en todas las páginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="categoria" element={<Categoria />} />
        <Route path="buscar" element={<Buscar />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </>
  );
}
