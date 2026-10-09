import React, { useState } from 'react';
import { X, Camera, QrCode, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function QrScannerModal({ isOpen, onClose, products }) {
  const { addToCart } = useCart();
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [matchedProduct, setMatchedProduct] = useState(null);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSimulateScan = (codeToScan) => {
    const code = (codeToScan || qrCodeInput).trim().toUpperCase();
    if (!code) return;

    // Search product by QR code (e.g. SJ-PROD-001 or id)
    const found = products.find(p => 
      p.codigoQr?.toUpperCase() === code || 
      `SJ-PROD-${String(p.id).padStart(3, '0')}` === code ||
      String(p.id) === code
    );

    if (found) {
      setMatchedProduct(found);
      addToCart(found);
      setFeedback({ type: 'success', message: `¡Escaneado! "${found.nombre}" se agregó al carrito.` });
    } else {
      setMatchedProduct(null);
      setFeedback({ type: 'error', message: `No se encontró ningún producto con el código ${code}` });
    }
  };

  const sampleCodes = [
    { label: 'Guantes para lavar (001)', code: 'SJ-PROD-001' },
    { label: 'Jarras de vidrio (002)', code: 'SJ-PROD-002' },
    { label: 'Dispensador giratorio (006)', code: 'SJ-PROD-006' },
    { label: 'Arrocera Silver Crest (068)', code: 'SJ-PROD-068' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex-align-gap">
            <QrCode size={22} className="brand-red" />
            <h3>Escaneo de Código QR Físico</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="scanner-body">
          {/* Visual Camera Simulation Viewfinder */}
          <div className="camera-viewfinder">
            <div className="scanner-laser-line"></div>
            <div className="viewfinder-corner top-left"></div>
            <div className="viewfinder-corner top-right"></div>
            <div className="viewfinder-corner bottom-left"></div>
            <div className="viewfinder-corner bottom-right"></div>
            <div className="camera-overlay-text">
              <Camera size={32} />
              <span>Apunta la cámara al código QR del producto en tienda</span>
            </div>
          </div>

          {feedback && (
            <div className={`scan-feedback ${feedback.type}`}>
              {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Manual Input / Simulation */}
          <div className="manual-scan-box">
            <label>Código QR o ID detectado:</label>
            <div className="search-bar-row">
              <input 
                type="text" 
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSimulateScan()}
              />
              <button 
                className="primary-action-btn"
                onClick={() => handleSimulateScan()}
              >
                Escanear
              </button>
            </div>
          </div>

          {/* Quick Demo QR buttons */}
          <div className="quick-qrs-box">
            <small>Acceso rápido a códigos del catálogo:</small>
            <div className="tags-row">
              {sampleCodes.map(c => (
                <button 
                  key={c.code} 
                  className="qr-tag-btn"
                  onClick={() => {
                    setQrCodeInput(c.code);
                    handleSimulateScan(c.code);
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
