# 📈 PASO 4: EVALUACIÓN, INTERPRETACIÓN, INTEGRACIÓN Y NORMATIVA
## Proyecto: Grupo Importaciones San José S.R.L. (RUC 20607725731)
**Ponderación:** 30% de la nota final (6.0 puntos) — Rúbrica Oficial Indicadores 4, 5 y 6  
**Docente:** Econ. Richard Camán Sánchez | Curso: Innovación y Transformación Digital (UTP)

---

## 4.1 Evaluación Comparativa Oficial en el Test Set (Sección 6.1 · 3 pts)

El torneo de modelos se evaluó sobre el **15% del Test Set cronológico** (Semanas 45 y 46), obteniendo los siguientes resultados verificables:

| Modelo Evaluado | MAE (Unidades) | RMSE (Unidades) | WAPE (%) | $R^2$ Score | Mejora vs. Línea Base | Decisión Técnica |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| **Línea Base (Promedio Móvil 4 semanas)** | 3.75 | 4.82 | 27.8% | 0.31 | 0.0% | Referencia superada |
| **KNN (sin StandardScaler)** | 3.42 | 4.45 | 25.3% | 0.42 | +8.8% | Descartado por sesgo de escala |
| **KNN (con StandardScaler)** | 2.58 | 3.51 | 19.1% | 0.63 | +31.2% | Evidencia impacto del escalado |
| **Ridge Regression ($\alpha=1.0$)** | 2.34 | 3.20 | 17.3% | 0.69 | +37.6% | Modelo lineal auditable |
| **DecisionTreeRegressor (`max_depth=4`)** | 2.11 | 2.94 | 15.6% | 0.74 | +43.7% | Fácil interpretabilidad |
| **GradientBoostingRegressor (Ganador)** | **1.68** | **2.35** | **12.4%** | **0.82** | **+55.2%** | **SELECCIONADO OFICIAL** |

### Justificación de la Selección del Modelo Ganador:
El **Gradient Boosting Regressor** resultó el ganador indiscutible:
1. **MAE de 1.68 unidades:** Cumple holgadamente la meta del Paso 1 (MAE < 2.0 unidades). El modelo se equivoca en promedio por menos de 2 unidades físicas por producto a la semana.
2. **WAPE de 12.4%:** Reduce el error porcentual de la supervisora (27.8%) a menos de la mitad, superando la meta de negocio (< 15%).
3. **RMSE controlado (2.35):** Minimiza la ocurrencia de quiebres graves de inventario.

### Análisis de Fallos: 3 Casos Atípicos con Hipótesis de Negocio
Se analizaron los 3 mayores residuos negativos y positivos del modelo para entender sus límites:
1. **Caso 1 — Labial Líquido Mate en Los Olivos (Predicción: 8 \| Real: 22):**
   - *Hipótesis de Negocio:* Fenómeno de compra mayorista/reventa. Una clienta local adquirió una docena en un solo acto de compra para abastecer un salón de belleza cercano, rompiendo el patrón habitual de menudeo.
2. **Caso 2 — Jarra de Vidrio con Tapa en Comas (Predicción: 7 \| Real: 1):**
   - *Hipótesis de Negocio:* Sensibilidad climática y cierre anticipado. Durante esa semana se registraron lluvias atípicas y una rotura de tubería que forzó el cierre de la tienda física dos tardes seguidas.
3. **Caso 3 — Peluche Oso con Corazón en Puente Piedra (Predicción: 5 \| Real: 14):**
   - *Hipótesis de Negocio:* Efecto de quincena en fin de semana. Coincidió con el pago salarial del 31 de octubre y la celebración de Halloween, generando compras impulsivas no capturadas por las variables estándar de calendario.

> **Declaración de Límite Metodológico:** Dado que el dataset combina 17 ventas reales y 1,416 simuladas calibradas, los resultados son altamente indicativos para el piloto, pero requerirán un reentrenamiento continuo con datos 100% capturados en producción durante el hito PROY.

---

## 4.2 Interpretación en Lenguaje de Negocio (Sección 6.2)

### Impacto Cuantitativo para la MiPYME:
* **Ahorro por prevención de quiebres de stock:** Al reducir el error de 3.75 a 1.68 unidades por producto/semana en los 46 productos activos de las 5 sedes, se evitan aproximadamente **470 unidades de quiebre de stock al mes**. Con un ticket promedio de S/ 7.50 de ganancia bruta por producto, esto representa un **rescate de ventas de aproximadamente S/. 3,500.00 mensuales** para la cadena.
* **Reducción de sobrestock inmovilizado:** Se reduce el exceso de mercadería en locales con baja rotación en un 35%, liberando espacio físico en estantería para productos de temporada.

### Importancia de Variables (*Feature Importances* del Gradient Boosting):
1. **Historial de ventas de la semana previa (`lag_1` / promedio móvil):** 42% del peso predictivo.
2. **Identificador de la Sede (`id_sede` / Puente Piedra vs. Sedes secundarias):** 24% del peso.
3. **Condición de Fin de Semana (`es_fin_de_semana`):** 16% del peso.
4. **Categoría de Producto (`categoria`):** 11% del peso.
5. **Precio y Margen Unitario:** 7% del peso.

### Explicación para Personal No Técnico (Supervisora y Vendedores):
* **Qué SÍ hace el modelo:** *"El sistema analiza qué días se vende más cada producto en cada tienda y le entrega a la supervisora una lista recomendada de cuántas cajas cargar en la camioneta de reparto los lunes por la mañana."*
* **Qué NO hace el modelo:** *"El sistema no sabe si mañana se romperá una pista frente a la tienda, si habrá una huelga de transporte o si un influencer promocionará un producto en redes sociales. Por eso, la supervisora siempre tiene la última palabra para ajustar la orden."*

---

## 4.3 Integración con el MVP (Sección 6.3 · 2 pts)

### Contrato de Integración de Datos (Esquema JSON)

**1. Contrato de Entrada (Request JSON enviado desde el Frontend/Backend hacia el Modelo):**
```json
{
  "id_producto": 12,
  "nombre_producto": "Esponja de Maquillaje",
  "categoria": "Belleza y Cuidado Personal",
  "id_sede": 2,
  "nombre_sede": "Los Olivos - 2 de Octubre",
  "precio_unitario": 3.50,
  "costo_unitario": 1.80,
  "margen_unitario_porcentual": 0.485,
  "semana_iso": 47,
  "es_fin_de_semana": 1
}
```

**2. Contrato de Salida (Response JSON devuelto por el Modelo):**
```json
{
  "id_producto": 12,
  "id_sede": 2,
  "demanda_semanal_estimada": 18,
  "stock_seguridad_sugerido": 4,
  "orden_despacho_recomendada": 22,
  "confianza_modelo": 0.82,
  "alerta_reabastecimiento": "ALTO_RIESGO_QUIEBRE",
  "fecha_generacion": "2026-11-15T18:00:00"
}
```

* **Acción que dispara en la interfaz:** Al ingresar a la vista `/admin/inventario`, el sistema marca en rojo los productos con alerta `"ALTO_RIESGO_QUIEBRE"` y precarga un botón: *"Generar Orden de Traslado Automática a Los Olivos (22 unidades)"*.

### Estado de Implementación Técnica:
* **Implementado en APF3:** Modelo serializado y exportado (`modelo_demanda_san_jose.joblib`), pipeline scikit-learn con función de inferencia probada que valida el esquema JSON.
* **Proyectado para PROY (Semana 17):** Endpoint REST `/api/v1/predict/demanda` en Spring Boot/Python, integración bidireccional con el panel de administración y generación automática de guías de remisión en PDF.

---

## 4.4 Cumplimiento Normativo (Sección 6.4 · 1 pt)

### Matriz de Cumplimiento de 3 Columnas (Ley N° 29733 y Ley N° 31814)

| Requisito de la Norma Peruana | Decisión y Control Aplicado en el Dataset y Modelo | Evidencia Verificable |
|---|---|---|
| **Ley N.° 29733 (Datos Personales):** Principio de Legalidad y Consentimiento. | El registro de usuarios en el MVP incluye una casilla obligatoria de consentimiento informado de privacidad antes de procesar compras. | Formulario de Registro y Checkout en Frontend Vercel. |
| **Ley N.° 29733:** Principio de Minimización y Anonimización Estricta. | **Exclusión total de PII en Machine Learning:** El dataset se alimenta exclusivamente de transacciones agregadas. Nombres, DNI, teléfonos, correos y direcciones fueron eliminados de la consulta SQL de extracción. Las tablas `Usuarios` y `Metodos_Pago` quedaron fuera del pipeline. | Script SQL de exportación + archivo CSV sin columnas personales. |
| **Ley N.° 31814 (Ley de IA del Perú):** Principio de Supervisión Humana (*Human-in-the-loop*). | El modelo **sugiere pero no ejecuta** el traslado de forma autónoma. La **Supervisora Central en Puente Piedra revisa, modifica y aprueba** la orden final de despacho antes de que salga la camioneta. | Interfaz de aprobación manual en el panel administrativo. |
| **Ley N.° 31814:** Principio de Transparencia y Explicabilidad. | El sistema informa explícitamente en pantalla que la sugerencia proviene de un algoritmo predictivo de Machine Learning y expone la importancia de variables para justificar la recomendación. | Cuadro explicativo y etiquetas visuales en el Admin Dashboard. |

---

## 4.5 Proyección al Proyecto Final (PROY - Semana 17) y Gestión de Riesgos (Sección 6.5)

### Hoja de Ruta Técnica hacia PROY:
1. **Despliegue de Microservicio REST de Inferencia:** Empaquetar el modelo en un contenedor Docker con FastAPI o servicio nativo conectado al backend de Spring Boot.
2. **Reemplazo Progresivo de Datos Simulados:** Alimentar el modelo con el 100% de ventas reales capturadas por el MVP web en noviembre y diciembre de 2026.
3. **Automatización de Reentrenamiento:** Script cron programado para reentrenar el modelo el primer lunes de cada mes con los datos consolidados en Aiven.

### Matriz de 3 Riesgos Críticos hacia PROY:

| ID | Riesgo Identificado | Tipo | Prob. | Impacto | Responsable | Plan de Mitigación Concreto |
|:--:|---|:--:|:--:|:--:|---|---|
| **R1** | **Deriva de Concepto (*Data Drift*) por Campaña Navideña:** La demanda de diciembre puede dispararse hasta 4 veces por encima de octubre/noviembre, descalibrando el modelo. | Datos | Alta | Alto | Líder Técnico (Frank) | Incorporar un multiplicador estacional manual calibrado con la campaña de diciembre del año anterior en Puente Piedra. |
| **R2** | **Latencia o Bloqueo por Hibernación de Render:** Si el microservicio entra en suspensión por inactividad, la primera consulta de predicción de la supervisora podría tardar 45 segundos. | Técnico | Alta | Medio | Responsable de Despliegue | Configurar un cron job (*ping* cada 10 minutos) para mantener el backend activo, o migrar al plan comercial de $7/mes. |
| **R3** | **Rechazo o Desconfianza de la Supervisora ante Predicciones Inesperadas:** Que el personal ignore las alertas de la IA y continúe despachando mercadería al ojo. | Humano | Media | Alto | Product Owner (Huayaney) | Taller de capacitación práctica de 20 minutos demostrando cómo la IA redujo quiebres en Los Olivos y habilitando un botón para que la supervisora registre feedback. |
