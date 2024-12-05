import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import ('../styles/Login.css')

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`¡Hola, ${username}! Iniciaste sesión exitosamente.`);
  };

  return (
    <div className="login-container">
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <div className="input-group">
        <label htmlFor="username">Usuario</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="login-btn">
        <span>Iniciar sesión</span>
      </button>
      <button className="google-login-btn">
        <FcGoogle style={{ marginRight: '8px' }} />
        Ingresa con tu correo de Tecsup
      </button>
      <p className="signup-prompt">
        ¿No tienes cuenta? <a href="/Register">Regístrate</a>
      </p>
    </form>
  </div>
  ); 
}
export default Login;