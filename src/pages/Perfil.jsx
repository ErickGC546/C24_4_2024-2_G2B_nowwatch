import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Perfil() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No se encontró el token de autenticación');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:8080/profile/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserProfile(res.data);
        setLoading(false);
      } catch (error) {
        setError('No se pudo obtener el perfil');
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Perfil de Usuario</h1>
      {loading && <p className="text-center">Cargando...</p>}
      {error && <p className="text-center text-danger">{error}</p>}
      {userProfile && (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 text-center">
              <img
                  src={userProfile.photo || 'default-photo-url.jpg'}
                  alt="Profile"
                  className="rounded-circle img-fluid mb-3"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
                <h3>{userProfile.first_name} {userProfile.last_name}</h3>
              </div>
              <div className="col-md-8">
                <h4>Información de Contacto</h4>
                <ul className="list-unstyled">
                  <li><strong>Email:</strong> {userProfile.email}</li>
                  <li><strong>Teléfono:</strong> {userProfile.phone || 'No disponible'}</li>
                  <li><strong>Dirección:</strong> {userProfile.address || 'No disponible'}</li>
                </ul>
                <button className="btn btn-primary mt-4">Editar Perfil</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
