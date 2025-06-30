import React, { useState } from 'react';
import { Shield, Globe, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

function App() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [blockedSites, setBlockedSites] = useState([]);

  const API_BASE_URL = 'http://localhost:5000'; // Cambia esto por la URL de tu API

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!domain.trim()) {
      setMessage('Por favor ingresa un dominio válido');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/block-site`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setMessageType('success');
        setBlockedSites(prev => [...prev, { domain: domain.trim(), timestamp: new Date().toLocaleString() }]);
        setDomain('');
      } else {
        setMessage(data.error || 'Error al bloquear el sitio');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error de conexión con la API');
      setMessageType('error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Shield className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">MikroTik Site Blocker</h1>
          </div>
          <p className="text-gray-600 text-lg">Bloquea sitios web directamente desde tu router MikroTik</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de bloqueo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Bloquear Sitio Web</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
                  Dominio a bloquear
                </label>
                <input
                  type="text"
                  id="domain"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="ejemplo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Se bloqueará tanto el dominio como su versión con www
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading || !domain.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Bloqueando...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Bloquear Sitio
                  </>
                )}
              </button>
            </div>

            {/* Mensaje de estado */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg flex items-start ${
                messageType === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-sm ${
                    messageType === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {message}
                  </p>
                  <button
                    onClick={clearMessage}
                    className={`text-xs mt-1 underline ${
                      messageType === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Lista de sitios bloqueados */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sitios Bloqueados</h2>
            
            {blockedSites.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No has bloqueado ningún sitio aún</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSites.map((site, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{site.domain}</p>
                        <p className="text-sm text-gray-500">www.{site.domain}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{site.timestamp}</p>
                        <div className="flex items-center mt-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span className="text-xs text-red-600 font-medium">Bloqueado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Información importante</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">¿Cómo funciona?</h4>
              <ul className="space-y-1">
                <li>• Se agregan entradas DNS estáticas en tu MikroTik</li>
                <li>• Los dominios se redirigen a 127.0.0.1 (localhost)</li>
                <li>• Se bloquea tanto el dominio como su versión www</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Configuración de la API</h4>
              <ul className="space-y-1">
                <li>• API corriendo en: {API_BASE_URL}</li>
                <li>• Router: 192.168.1.1:8728</li>
                <li>• TTL de bloqueo: 1 día</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;