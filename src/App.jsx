import { Routes, Route } from 'react-router-dom'
import Navbar from "./pages/Navbar"
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Login from './pages/Login'
import Register from './pages/Register'
import Buscar from './pages/Buscar'


export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar/>} >
          <Route index element={<Home />} />
          <Route path='categoria' element={<Categoria />} />
          <Route path='buscar' element={<Buscar />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </>
  )
}

