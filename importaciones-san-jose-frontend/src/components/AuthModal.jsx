import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [correo, setCorreo] = useState('cliente@gmail.com');
  const [password, setPassword] = useState('cliente123');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('Cliente'); // 'Cliente' | 'Admin'
  const [claveAdmin, setClaveAdmin] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        const payload = {
          nombreCompleto,
          correo,
          password,
          telefono,
          rol,
          claveAdmin: rol === 'Admin' ? claveAdmin.trim() : null
        };
        const res = await api.register(payload);
        login(res.usuario || { nombreCompleto, correo, rol: res.rol || rol }, res.token);
      } else {
        const res = await api.login(correo, password);
        login(res.usuario || { correo, rol: res.rol || 'Cliente' }, res.token);
      }
      onClose();
    } catch (err) {
      console.error('Error de autenticación:', err);
      setError(err.message || 'Error en las credenciales ingresadas.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAdmin = () => {
    setCorreo('admin@sanjose.pe');
    setPassword('admin123');
    setIsRegister(false);
  };

  const setDemoClient = () => {
    setCorreo('cliente@gmail.com');
    setPassword('admin123');
    setIsRegister(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isRegister ? 'Crear Nueva Cuenta' : 'Iniciar Sesión'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '10px' }}>
          {isRegister && (
            <>
              <div className="input-group">
                <label>Tipo de Cuenta</label>
                <div className="doc-type-toggle" style={{ marginBottom: '6px' }}>
                  <button 
                    type="button" 
                    className={rol === 'Cliente' ? 'active' : ''}
                    onClick={() => { setRol('Cliente'); setClaveAdmin(''); }}
                  >
                    Cliente
                  </button>
                  <button 
                    type="button" 
                    className={rol === 'Admin' ? 'active' : ''}
                    onClick={() => setRol('Admin')}
                  >
                    Administrador
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label>Nombre Completo</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input 
                    type="text" 
                    required 
                    value={nombreCompleto}
                    onChange={(e) => setNombreCompleto(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ''))}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Teléfono / Celular</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input 
                    type="tel" 
                    required
                    maxLength="9"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              {rol === 'Admin' && (
                <div className="input-group">
                  <label>Clave de Autorización</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input 
                      type="password" 
                      required 
                      placeholder="Ingresa la clave de la empresa"
                      value={claveAdmin}
                      onChange={(e) => setClaveAdmin(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input 
                type="email" 
                required 
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="primary-action-btn full-width" disabled={loading} style={{ marginTop: '8px' }}>
            {loading ? 'Verificando...' : isRegister ? 'Registrarme' : 'Ingresar'}
          </button>
        </form>

        <div className="modal-footer-switch">
          <span>{isRegister ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}</span>
          <button 
            type="button" 
            className="link-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </div>
      </div>
    </div>
  );
}
