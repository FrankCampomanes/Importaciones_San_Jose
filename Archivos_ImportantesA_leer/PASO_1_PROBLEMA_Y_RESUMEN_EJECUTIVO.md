# 🎯 PASO 1: RECAPITULACIÓN Y DEFINICIÓN DEL PROBLEMA ML
## Proyecto: Grupo Importaciones San José S.R.L. (RUC 20607725731)
**Ponderación:** 15% de la nota final (3.0 puntos) — Rúbrica Oficial Indicador 1  
**Integrantes:** Frank Erick Campomanes Vergara (Scrum Master), Huayaney Lázaro José Luis (PO), Ronal Hurtado, Kevin Rosales, Leonardo García.  
**Docente:** Econ. Richard Camán Sánchez | Curso: Innovación y Transformación Digital (UTP)

---

## 1.1 Resumen Ejecutivo de APF1 y APF2 (≤ ½ página)

* **MiPYME Seleccionada:** Grupo Importaciones San José S.R.L. (RUC 20607725731), empresa peruana dedicada a la importación y comercialización minorista de artículos para el hogar, cocina, limpieza, cuidado personal, juguetes, novedades y accesorios. Opera a través de su sede principal y almacén central en Puente Piedra (Mza. B Lote 9, Coop. San Lorenzo) y 4 sedes secundarias en Lima Metropolitana (Los Olivos - 2 de Octubre, Los Olivos - Villasol, Ventanilla - Pachacútec y Comas - Collique).
* **Problema de Ingeniería Diagnosticado:** Gestión de inventario empírica y descentralizada que ocasionaba demoras de **4 a 6 minutos en el mostrador físico** (con picos documentados de hasta 15-20 minutos cuando se requería llamar al supervisor o no había sistema) debido a la revisión manual en hojas de cálculo Excel dispersas para verificar precios y existencias, derivando en quiebres de stock recurrentes en sedes secundarias.
* **Tecnología Habilitadora Aplicada:** Cloud Computing mediante una arquitectura distribuida 100% en la nube (Frontend en Vercel, Backend API REST en Render y Base de Datos relacional en Aiven Cloud MySQL 8.4 con SSL).
* **Metodología Aplicada:** Scrum adaptado para entregas ágiles y continuas (Sprints quincenales, Product Backlog priorizado por técnica MoSCoW, historias de usuario US01 a US15).
* **Estado Actual del MVP Desplegado:** Aplicación web fullstack responsive operativa 24/7 en producción:
  - **Frontend:** [https://importaciones-san-jose.vercel.app/](https://importaciones-san-jose.vercel.app/)
  - **Backend API Docs (Swagger):** [https://importaciones-san-jose-backend.onrender.com/swagger-ui.html](https://importaciones-san-jose-backend.onrender.com/swagger-ui.html)
* **Indicador Principal de Negocio y Brecha:**
  - *Línea Base Pre-MVP:* 4 a 6 minutos por consulta/registro en mostrador físico.
  - *Resultado MVP:* Menos de 1 minuto (< 45 segundos) por transacción web centralizada.
  - *Brecha restante hacia APF3:* La asignación de mercadería intersede desde el almacén de Puente Piedra se sigue decidiendo "al ojo", generando desabastecimiento en sedes de alta rotación (ej. esponjas de maquillaje en Los Olivos) y sobrestock de baja rotación en otras (ej. jarras en Comas).

---

## 1.2 Tipificación del Problema de Machine Learning

* **Tipo de Problema:** **REGRESIÓN SOBRE SERIE TEMPORAL** (Predicción de un valor numérico continuo).
* **Justificación técnica:** No se busca clasificar si un producto se venderá o no (clasificación binaria), sino estimar la **cantidad exacta de unidades físicas** que demandará cada producto en cada sede durante la semana siguiente para planificar el despacho semanal de reposición.

---

## 1.3 Variable Objetivo y Unidad de Observación

* **Variable Objetivo (Target):** `demanda_semanal` (Entero no negativo continuo).
  - Representa la suma de unidades vendidas (`Detalle_Ventas.Cantidad`) de todas las transacciones con estado `'Completada'` para un producto dado, en una sede específica, durante una semana ISO de calendario.
* **Unidad de Observación:** Tríada **`[Semana_ISO, ID_Sede, ID_Producto]`**.
  - Cada fila del dataset de modelado representa el comportamiento de demanda consolidada de un producto en una tienda durante una semana completa.
* **Medición actual en la MiPYME:** Hoy la supervisora central no calcula formalmente la demanda; utiliza una estimación subjetiva basada en lo que observa en el almacén de Puente Piedra y su memoria de ventas pasadas.

---

## 1.4 Decisión de Negocio que Habilita el Modelo y Punto de Integración

* **Decisión que automatiza y mejora:** Determinar la **orden semanal de transferencia de inventario** desde el Almacén Central (Puente Piedra) hacia las 4 sedes secundarias. El modelo sugiere cuántas unidades despachar en cada camioneta antes del inicio de la semana operativa.
* **Punto de integración en el MVP:** En el módulo de Administración (`/admin`), dentro de la vista de inventario intersede (vinculado a la historia **US15 - Alertas predictivas de reposición**), mostrando una tabla con: `Sede | Producto | Stock Actual | Demanda Sugerida por IA | Acción Recomendada (Despachar X unidades)`.

---

## 1.5 Métrica de Éxito de Negocio y Meta Observable

* **Línea Base Actual de la MiPYME:** Regla tradicional del supervisor basada en el promedio móvil simple de las últimas 4 semanas, que presenta un error promedio histórico estimado de **25% a 30% en unidades** (equivocándose típicamente en 4 a 6 unidades por producto de alta rotación).
* **Meta de Negocio para el Modelo:**
  - Reducir el **MAE (Error Medio Absoluto) a menos de 2.0 unidades** físicas por producto/sede/semana.
  - Reducir el **WAPE (Weighted Absolute Percentage Error) por debajo del 15%**, superando a la línea base tradicional en más de 10 puntos porcentuales.

---

## 1.6 Costo de los Errores (Justificación de Métricas Técnicas)

En el negocio retail de menudeo de Importaciones San José:

1. **Subestimar la demanda (Predicción < Demanda Real):**
   - **Impacto:** Quiebre de stock (*stockout*). El cliente llega a la sede física o entra a la web y encuentra el producto agotado.
   - **Costo económico:** Venta perdida inmediata, insatisfacción del cliente, pérdida de fidelidad y costo de flete urgente no planificado desde Puente Piedra. **Este es el error más costoso para la MiPYME.**
2. **Sobrestimar la demanda (Predicción > Demanda Real):**
   - **Impacto:** Mercadería acumulada en góndola o almacén de la sede.
   - **Costo económico:** Costo de almacenamiento marginal en tienda física y costo de oportunidad de capital inmovilizado. Dado que son productos no perecibles de bazar/menaje de bajo ticket (S/ 1 a S/ 35), el costo es notablemente inferior al de un quiebre de stock.
3. **Orientación de las Métricas Técnicas:**
   - Se prioriza el **MAE (en unidades físicas)** por su interpretabilidad operativa directa por parte del personal de tienda.
   - Se monitorea el **RMSE** para penalizar de forma cuadrática los errores grandes de subestimación que generarían quiebres masivos.

---

## 📌 EVIDENCIA MÍNIMA REQUERIDA POR LA RÚBRICA (FORMATO OFICIAL):

> *"Para **la Supervisora Central y los encargados de tienda de Puente Piedra y sedes de Grupo Importaciones San José S.R.L.**, el modelo **predecirá** la **Demanda Semanal en unidades físicas (`demanda_semanal`)** con el propósito de **planificar con anticipación la transferencia de inventario intersede y evitar quiebres de stock en el catálogo físico y digital**, medido mediante **un MAE inferior a 2.0 unidades y un WAPE menor al 15%, superando significativamente la línea base del promedio móvil de 4 semanas**."*
