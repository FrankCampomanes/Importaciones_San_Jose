# 📄 INFORME ACADÉMICO APF2, BACKLOG, CONTRATO DE DATOS Y CORRECCIONES PARA APF3
## Proyecto: Grupo Importaciones San José S.R.L. (RUC 20607725731)
**Curso:** Innovación y Transformación Digital — Universidad Tecnológica del Perú (UTP)  
**Docente:** Econ. Richard Camán Sánchez  
**Scrum Master:** Frank Erick Campomanes Vergara  
**Estado:** Documento base del informe entregado en APF2 con las correcciones operativas y técnicas para el informe final de APF3.

---

## 🏬 1. ALCANCE Y OBJETIVO DEL MVP (SECCIÓN 1 DEL INFORME)

### 1.1 Alcance del MVP
> *"El MVP se implementa y valida en el local de Puente Piedra. El sistema está diseñado para que cada sede gestione de forma independiente su propio stock y sus propias ventas, por lo que puede replicarse en las demás sedes (Los Olivos - 2 de Octubre, Los Olivos - Villasol, Ventanilla - Pachacútec y Comas - Collique)."*

### 1.2 Objetivo del MVP
> *"Para el personal (administrador) y los clientes del local de Puente Piedra de Importaciones San José, el MVP permitirá buscar un producto por nombre o categoría, ver de inmediato su precio y stock, y registrar la compra de forma centralizada con descuento automático del stock, con el propósito de eliminar la espera por la revisión manual del Excel o la consulta al supervisor, medido mediante el tiempo promedio de consulta y registro del pedido."*
> - **Línea base original:** 15 a 20 minutos (según entrevista preliminar).
> - **Aclaración y corrección de campo (Frank):** La demora real en el mostrador físico previa al MVP promediaba **4 a 6 minutos** por cliente (con picos de 15-20 min cuando se requería llamar al supervisor o no había sistema). **La aplicación web del MVP resuelve la consulta y registro en menos de 1 minuto.**
> - **Meta del equipo:** Menos de 1 minuto (< 60 segundos).

### 1.3 Idea Seleccionada para el MVP
> *"Se seleccionó la **Idea 1 (Sistema de consulta y registro de pedidos)**, porque ataca de forma directa las demoras descritas por el encargado en el mostrador físico. El Product Backlog final cubre además las necesidades de catálogo digital, control de inventario por sede y pedidos con entrega o recojo."*

---

## ⚙️ 2. DEFINICIÓN TÉCNICA Y COMPONENTES DEL MVP

| Componente | Definición Técnica del MVP | Evidencia Verificable |
|---|---|---|
| **Interfaz** | Aplicación web en React + Vite, adaptable a celulares (responsive design), desplegada en Vercel. | `https://importaciones-san-jose.vercel.app/` |
| **Lógica de Negocio** | API REST en Spring Boot alojada en Render con autenticación segura JWT. La venta se procesa en una transacción atómica que valida y descuenta el stock en tiempo real. | Backend Render + Swagger Docs: `https://importaciones-san-jose-backend.onrender.com/swagger-ui.html` |
| **Persistencia** | Base de datos relacional MySQL 8.4.11 gestionada en Aiven Cloud (`defaultdb`) con conexión cifrada SSL (migrada desde Render MySQL por restricción de retención de 30 días). Tablas: `Configuracion`, `Usuarios`, `Sedes`, `Productos`, `Inventario_Sedes`, `Metodos_Pago`, `Ventas` y `Detalle_Ventas`. | Host: `mysql-34eda8b3-utp-02ac.e.aivencloud.com:10890` |
| **Validaciones** | Validación de campos obligatorios, formato de correo, control de stock insuficiente, transacciones ACID y manejo de errores de red. | Pruebas de integración P-01 a P-07. |
| **Despliegue Continuo** | CI/CD automático desde la rama `main` en GitHub hacia Vercel (frontend). | Repositorio GitHub con build passing. |

---

## 📋 3. PRODUCT BACKLOG COMPLETO (HISTORIAS DE USUARIO US01 – US15)

| ID | Rol (Como) | Funcionalidad (Quiero) | Beneficio (Para) | Story Points | Prioridad MoSCoW | Estado en MVP / APF3 |
|:--:|---|---|---|:--:|:--:|:--:|
| **US01** | Cliente | Registrarme e iniciar sesión con correo y contraseña. | Tener un perfil seguro y consultar mi historial de compras. | 3 | Must | **Implementado** |
| **US02** | Cliente | Buscar un producto por nombre o categoría y ver sus existencias por sede. | Saber en qué sede de Lima hay stock sin revisar local por local. | 5 | Must | **Implementado** |
| **US03** | Cliente | Filtrar el catálogo por una sede específica. | Ver solo los productos disponibles en esa tienda física. | 3 | Should | **Implementado** |
| **US04** | Administrador | Registrar y modificar el stock de cada producto por sede. | Reflejar la rotación periódica de la mercadería y nuevos ingresos. | 5 | Must | **Implementado** |
| **US05** | Cliente | Elegir entre "Recojo en tienda" o "Delivery en Lima". | Decidir cómo recibiré mi pedido. *(Funcionalidad 100% nueva)* | 5 | Should | **Implementado** |
| **US06** | Cliente | Que se aplique envío gratuito si supero el monto mínimo, o tarifa plana si no lo supero. | Conocer el costo total transparente antes de pagar. | 3 | Could | **Implementado** |
| **US07** | Cliente | Registrar un método de pago simulado mediante token. | Comprar de forma ágil sin exponer datos bancarios reales. | 5 | Should | **Implementado** |
| **US08** | Administrador | Que cada venta se procese en una transacción atómica que descuente stock en tiempo real. | Evitar sobreventas cuando dos usuarios compran la última unidad simultáneamente. | 8 | Must | **Implementado** |
| **US09** | Cliente | Recibir un comprobante digital (boleta o factura) generado automáticamente. | Validar mi compra con un documento formal de venta. | 3 | Must | **Implementado** |
| **US10** | Cliente | Escanear el código QR de un producto físico con la cámara del celular y agregarlo al carrito. | Comprar y consultar más rápido dentro de la tienda física. | 5 | Could | **Implementado** |
| **US11** | Administrador | Ver un dashboard con ventas totales, ingresos netos e IGV recaudado, filtrable por día, semana o mes. | Liquidar y cuadrar la caja diaria de la tienda. | 5 | Should | **Implementado** |
| **US12** | Administrador | Comparar las ventas y la rotación de productos entre las 5 sedes. | Optimizar la distribución del inventario intersede. | 5 | Could | **Implementado** |
| **US13** | Cliente | Buscar un producto aunque escriba el nombre de forma incompleta o con errores ortográficos. | Encontrar lo que busco sin conocer el nombre técnico exacto. | 3 | Should | *Pendiente para APF3 / Evolutivo* |
| **US14** | Cliente | Dejar de forma opcional mi número de WhatsApp al hacer el pedido. | Que el local pueda contactarme rápidamente sobre el estado del despacho. | 5 | Could | *Pendiente para APF3 / Evolutivo* |
| **US15** | Administrador | Ver alertas visibles automáticas cuando un producto tiene poco stock en sede. | Reponer inventario antes de que ocurra un quiebre de stock. | 5 | Should | *Integrado con el modelo ML en APF3* |

---

## ⚖️ 4. MATRIZ DE CUMPLIMIENTO NORMATIVO (SECCIÓN 4.2)

| Requisito de la Norma | Funcionalidad o Proceso del MVP que lo Resuelve | Evidencia en el Sistema |
|---|---|---|
| **Ley N.° 29733 y D.S. 016-2024-JUS:** Consentimiento previo, expreso e informado del titular para el tratamiento de datos personales. | Casilla obligatoria *"Acepto la política de privacidad y tratamiento de datos"* antes de registrarse o confirmar el pedido. | Formulario de Checkout y Registro en frontend. |
| **Ley N.° 29733:** Medidas de seguridad técnica y organizativa sobre datos personales. | Contraseñas encriptadas con algoritmos seguros de hash (BCrypt), tokens de sesión JWT con expiración, control de acceso basado en roles (Administrador y Cliente), y datos de pago tokenizados sin almacenar números de tarjeta. Exclusión total de PII en el dataset de ML. | Código Spring Boot Security + script de exportación sin PII. |
| **Ley N.° 28015 (Ley MYPE):** Facilitación de comprobantes y reportes de ventas sin sobrecarga administrativa. | US09 genera automáticamente boleta o factura con desglose de subtotal, IGV (18%) y total. US11 presenta reportes de liquidación diaria para el arqueo de caja. | Módulo de Comprobantes y Reportes de Caja. |
| **Normativa de Comprobantes SUNAT:** Numeración correlativa única y datos de emisión. | Cada venta genera un `Numero_Comprobante` único con formato serie-correlativo (B001-XXXX o F001-XXXX). En el MVP es simulación interna; integración con PSE/OSE proyectada para PROY. | Campo `Numero_Comprobante` único en tabla `Ventas`. |
| **Ley N.° 31814 (Ley de Inteligencia Artificial):** Principios de transparencia, explicabilidad y supervisión humana. | El modelo de Machine Learning es estrictamente una **herramienta de apoyo a la decisión**: predice la demanda sugerida, pero la **Supervisora Central en Puente Piedra valida y aprueba** la orden final de traslado. Se informa que la sugerencia proviene de un algoritmo predictivo. | Interfaz de predicción y Hoja de Gobernanza en Colab. |

---

## 📊 5. CONTRATO DE DATOS PRELIMINAR (PRE-APF3 / SECCIÓN 4.3)

| Elemento | Definición Técnica Comprometida |
|---|---|
| **Variable Objetivo (Target)** | **`demanda_semanal`**: Suma de unidades físicas vendidas (`Detalle_Ventas.Cantidad`) agrupadas por `(semana_iso, id_sede, id_producto)` para ventas con `Estado = 'Completada'`. **Problema de Regresión sobre Serie Temporal.** |
| **Campos del Dataset** | `fecha_hora`, `dia_semana`, `es_fin_de_semana`, `semana_iso`, `semana_del_mes`, `id_sede`, `nombre_sede`, `id_producto`, `nombre_producto`, `categoria`, `precio_unitario`, `costo_unitario`, `cantidad`, `metodo_entrega`, `origen`. |
| **Fuente de Datos** | Base de datos MySQL Aiven: tablas `Ventas`, `Detalle_Ventas`, `Productos`, `Sedes`. |
| **Privacidad (Ley N.° 29733)** | **Exclusión total de PII:** No se incluyen `Nombre_Completo`, `Correo`, `Telefono`, `Num_Documento_Cliente` ni direcciones exactas. Tablas `Usuarios` y `Metodos_Pago` quedan fuera del pipeline de Machine Learning. |
| **Volumen de Datos** | El encargado reportó 15 a 20 pedidos diarios en Puente Piedra (400-600 ventas/mes). En la BD de Aiven se cuenta con **1,433 ventas en 36 días** (17 ventas reales del piloto del 6 al 12 de octubre + 1,416 ventas simuladas calibradas del 13 de octubre al 11 de noviembre), superando holgadamente el volumen estadístico necesario para entrenar. |
| **Calidad y Limpieza** | Excluir ventas canceladas; asegurar `Cantidad > 0` y precios no negativos; verificar correlatividad de fechas; imputar costos mediante `COALESCE(dv.Costo_Unitario, p.Costo_Adquisicion)`. |
| **Partición de Datos** | **Cronológica estricta (SIN shuffle):** 70% Entrenamiento (semanas 1–3), 15% Validación (semana 4 primera mitad), 15% Prueba (semana 4 segunda mitad). Impide totalmente el *Data Leakage*. |
| **Modelos Candidatos** | **Línea Base:** Promedio Móvil de 4 semanas (cálculo tradicional del supervisor).<br>**Modelos ML:** Ridge/Lasso, KNN (con y sin escalado), Decision Tree Regressor (con poda), Gradient Boosting Regressor. |
| **Métricas de Evaluación** | **MAE** (Error Medio Absoluto en unidades físicas), **RMSE** (penalización de errores grandes), **WAPE** (error porcentual ponderado). El modelo se aprueba si su MAE es significativamente inferior a la Línea Base. |
| **Impacto en Negocio** | Anticipar la reposición intersede cada semana, evitando quiebres de stock y disminuyendo consultas fallidas en tienda física. |

---

## 🛡️ 6. GESTIÓN DE RIESGOS DEL PROYECTO (SECCIÓN 4.4)

| ID | Riesgo Identificado | Tipo | Prob. | Impacto | Responsable | Plan de Mitigación Implementado |
|:--:|---|:--:|:--:|:--:|---|---|
| **R1** | Sobreventa por compras simultáneas de la última unidad de stock. | Técnico | Media | Alto | Responsable Backend | Implementación de transacciones ACID con aislamiento y bloqueo a nivel de fila (`SELECT ... FOR UPDATE` en Spring Boot, US08). |
| **R2** | El backend en Render se suspende tras 15 minutos de inactividad en su plan free y demora ~45-60s en reactivarse durante la sustentación. | Técnico | Alta | Medio | Responsable Despliegue | "Calentar" la API abriendo la URL del Swagger 5 minutos antes de la sustentación; disponer de capturas de respaldo. En producción real se adquiere el plan de $7/mes. |
| **R3** | La base de datos PostgreSQL/MySQL gratuita de Render expira a los 30 días sin copias de seguridad automáticas. | Técnico | Media | Alto | Responsable BD | **MITIGADO AL 100%:** Se migró toda la base de datos a **Aiven Cloud MySQL 8.4** con respaldos automáticos, alta disponibilidad y SSL obligatorio. |
| **R4** | Caída de la conexión WiFi en la tienda física durante la atención al cliente. | Externo | Media | Medio | Líder de Equipo | Diseño web responsive adaptable a celulares: el personal utiliza sus datos móviles 4G/5G para seguir registrando ventas. |
| **R5** | Resistencia al cambio por parte del personal de mostrador y almacén acostumbrado a hojas de papel y Excel. | Humano | Alta | Alto | Líder de Equipo | Capacitación práctica de 15 minutos en el uso del catálogo web y visualización rápida del stock; interfaces intuitivas de un solo clic. |
| **R6** | Restricción de uso comercial en planes gratuitos de Vercel y Render. | Externo | Media | Medio | Responsable Despliegue | Uso de planes gratuitos estrictamente para validación académica y pruebas piloto; plan de migración a hosting comercial antes del escalamiento masivo. |

---

## 📌 7. CUADRO RESUMEN DE CORRECCIONES PARA EL WORD DE APF3

| # | Texto en Borrador Anterior | Corrección Definitiva para el Word | Justificación Operativa |
|:--:|---|---|---|
| **1** | *"Demora de 15 a 20 minutos por pedido en la app"* | *"Demora de 4 a 6 minutos en el mostrador físico de la tienda previa al MVP web (con picos de 15 a 20 min en consultas complejas al supervisor)."* | La web no demoraba 15 min; la lentitud ocurría en la tienda física antes de crear el MVP. La web tarda < 1 min. |
| **2** | *"El delivery ya operaba de forma tradicional"* | *"El servicio de Delivery en Lima Metropolitana es una innovación introducida íntegramente por el MVP."* | Antes del MVP solo existía compra física en tienda. |
| **3** | *"Modelo de clasificación para ver si hay demanda"* | *"Modelo de Regresión sobre Serie Temporal para predecir la cantidad exacta de unidades demandadas (`demanda_semanal`)."* | La variable objetivo es numérica continua, no binaria. |
| **4** | *"Los administradores de cada sede piden mercadería libremente"* | *"La reposición intersede es decidida y despachada de manera centralizada por la Supervisora en la sede Puente Piedra."* | Refleja la jerarquía operativa real de la empresa San José S.R.L. |
