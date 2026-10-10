import React from 'react';
import { X, ShieldCheck, FileText, Printer, Building2 } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}
      >
        {/* Header Modal */}
        <div className="modal-header" style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#ffe4e6', color: '#e11d48', padding: '8px', borderRadius: '8px', display: 'flex' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Términos, Condiciones y Política de Privacidad</h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                Cumplimiento Ley N.° 29733 y D.S. N.° 016-2024-JUS • Grupo Importaciones San José S.R.L.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              type="button" 
              onClick={handlePrint}
              className="btn-secondary-link"
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              title="Imprimir o guardar como PDF"
            >
              <Printer size={15} />
              <span>Imprimir</span>
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Cuerpo del Documento Legal con Scroll */}
        <div style={{ padding: '24px', overflowY: 'auto', fontSize: '13.5px', lineHeight: '1.65', color: '#334155' }}>
          
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}>
              <Building2 size={16} className="text-rose-600" />
              <span>GRUPO IMPORTACIONES SAN JOSÉ S.R.L. — RUC: 20607725731</span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b' }}>
              Domicilio Legal: Mza. B Lote 9, Coop. San Lorenzo, Puente Piedra, Lima • Teléfono: +51 926 577 602
            </div>
          </div>

          <h4 style={{ color: '#0f172a', fontSize: '15px', marginTop: '16px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            1. Objeto y Aceptación
          </h4>
          <p>
            El presente documento regula el acceso, registro y las transacciones comerciales efectuadas en la plataforma web oficial de <strong>GRUPO IMPORTACIONES SAN JOSÉ S.R.L.</strong> Al registrarse o realizar una compra, el usuario declara haber leído, comprendido y aceptado en su totalidad los presentes Términos y Condiciones y la Política de Privacidad de Datos.
          </p>

          <h4 style={{ color: '#0f172a', fontSize: '15px', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            2. Política de Protección de Datos Personales (Ley N.° 29733 y D.S. N.° 016-2024-JUS)
          </h4>
          <p>
            En estricto cumplimiento de la <strong>Ley de Protección de Datos Personales (Ley N.° 29733)</strong> y su reglamento modificado por <strong>Decreto Supremo N.° 016-2024-JUS</strong>, se informa al usuario:
          </p>
          <ul style={{ paddingLeft: '20px', marginTop: '6px', marginBottom: '12px' }}>
            <li style={{ marginBottom: '6px' }}>
              <strong>Titular del Banco de Datos:</strong> Los datos personales recolectados (nombres, documento de identidad, dirección, teléfono y correo electrónico) son incorporados en el banco de datos de clientes de titularidad de <em>Grupo Importaciones San José S.R.L.</em>
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Finalidad Necesaria:</strong> Los datos se tratan exclusivamente para procesar la creación de la cuenta, validar la identidad del comprador, emitir los comprobantes de pago autorizados por SUNAT (Boleta o Factura), coordinar el recojo en tienda o despacho por delivery, y gestionar el servicio post-venta.
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Consentimiento Libre y Expreso:</strong> El marcado voluntario de la casilla de verificación en el formulario constituye la manifestación previa, libre, expresa, inequívoca e informada del usuario autorizando dicho tratamiento.
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>Ejercicio de Derechos ARCO:</strong> El titular de los datos podrá ejercer en cualquier momento sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) comunicándose a nuestro canal oficial de atención o en cualquiera de nuestras 5 sedes físicas.
            </li>
          </ul>

          <h4 style={{ color: '#0f172a', fontSize: '15px', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            3. Precios, Moneda e Impuestos (SUNAT / INDECOPI)
          </h4>
          <p>
            Todos los precios exhibidos en la plataforma están expresados en <strong>Soles peruanos (S/)</strong> e <strong>incluyen el Impuesto General a las Ventas (IGV - 18%)</strong>. El monto total exhibido en el carrito de compras es exactamente el importe final que el cliente abonará, desglosándose en el comprobante electrónico la base imponible y el débito fiscal conforme a ley.
          </p>

          <h4 style={{ color: '#0f172a', fontSize: '15px', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            4. Disponibilidad Multisede y Modalidades de Entrega
          </h4>
          <p>
            Importaciones San José cuenta con cinco (5) sedes físicas en Lima y Callao (Puente Piedra, Los Olivos 2 de Octubre, Villasol, Ventanilla Pachacútec y Comas). Las compras con modalidad <strong>Recojo en Tienda</strong> son gratuitas y deben retirarse en la sede elegida por el cliente. Las compras con modalidad <strong>Delivery</strong> aplican en distritos autorizados y cuentan con envío gratuito a partir de compras mayores o iguales a S/ 60.00.
          </p>

          <h4 style={{ color: '#0f172a', fontSize: '15px', marginTop: '20px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            5. Cambios y Garantía
          </h4>
          <p>
            Conforme a la Ley N.° 29571 (Código de Protección y Defensa del Consumidor), todo artículo con falla de fábrica cuenta con derecho a cambio o revisión dentro de los siete (7) días hábiles posteriores a la entrega presentando el comprobante de compra y el producto en su empaque original.
          </p>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px dashed #cbd5e1', textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
            © {new Date().getFullYear()} Grupo Importaciones San José S.R.L. • Todos los derechos reservados bajo leyes peruanas.
          </div>
        </div>

        {/* Footer del Modal */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="primary-action-btn"
            onClick={onClose}
            style={{ padding: '8px 20px', fontSize: '13.5px' }}
          >
            Entendido y Acepto
          </button>
        </div>
      </div>
    </div>
  );
}
