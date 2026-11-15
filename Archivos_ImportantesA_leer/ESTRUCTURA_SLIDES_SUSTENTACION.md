# 📊 ESTRUCTURA OFICIAL DE SLIDES PARA LA SUSTENTACIÓN DE APF3
## Proyecto: Grupo Importaciones San José S.R.L.
**Pauta:** Máximo 13 Diapositivas | Tiempo: 12 minutos de exposición + 5 minutos de preguntas  
**Ponderación:** 10% de la nota final (2.0 puntos) — Rúbrica Oficial Indicador 7  
**Docente:** Econ. Richard Camán Sánchez | Curso: Innovación y Transformación Digital (UTP)

---

## ⏱️ CRONOMETRAJE Y DISTRIBUCIÓN POR EXPOSITOR

| Bloque | Tiempo Asignado | Diapositivas | Quién Expone Sugerido |
|---|:--:|:--:|---|
| **1. Recap y Problema ML** | 1.0 min | Slides 1 y 2 | Scrum Master (Frank Campomanes) |
| **2. Dataset y Coherencia** | 2.5 min | Slides 3 y 4 | Dev 1 (Ronal Hurtado) |
| **3. Modelado y Torneo** | 2.5 min | Slides 5 y 6 | Dev 2 (Kevin Rosales) |
| **4. Resultados y Demo en Vivo** | 2.5 min | Slides 7, 8 y 9 | Product Owner (José Huayaney) y Frank |
| **5. Impacto de Negocio** | 1.0 min | Slide 10 | Dev 3 (Leonardo García) |
| **6. Integración con el MVP** | 1.0 min | Slide 11 | Dev 1 o Dev 2 |
| **7. Normativa, Riesgos y Cierre**| 1.5 min | Slides 12 y 13 | Scrum Master (Frank Campomanes) |

---

## 📑 CONTENIDO DIAPOSITIVA POR DIAPOSITIVA (13 SLIDES)

### SLIDE 1: Portada y Presentación del Equipo (30 s)
* **Título:** Solución de Machine Learning para la Optimización de Reposición de Inventario Intersede.
* **Empresa:** Grupo Importaciones San José S.R.L. (RUC 20607725731) - Retail / Menudeo en Lima Norte y Callao.
* **Integrantes y Roles:**
  - Frank Erick Campomanes Vergara (Scrum Master / Líder Técnico)
  - Huayaney Lázaro José Luis (Product Owner)
  - Ronal Dany Hurtado Lorenzo (Backend & Data Engineer)
  - Kevin Rosales Álvarez (Frontend & ML Developer)
  - Leonardo Adrián García Muñoz (QA & Business Analyst)
* **Curso y Docente:** Innovación y Transformación Digital — Econ. Richard Camán Sánchez.

---

### SLIDE 2: Recapitulación APF1/APF2 y Problema ML Formulado (30 s)
* **El Problema Original:** Demora de 4 a 6 minutos en el mostrador físico previa al MVP web y quiebres de stock continuos por distribución empírica de mercadería.
* **El MVP Operativo:** E-commerce multisede desplegado en Vercel + Render + Aiven MySQL (`https://importaciones-san-jose.vercel.app/`).
* **La Pregunta de APF3:** ¿Cómo evitamos que la Supervisora Central despache mercadería "al ojo" generando quiebres en Los Olivos y sobrestock en Comas?
* **Enunciado Oficial del Problema ML:**
  > *"Para la Supervisora Central, el modelo **predecirá la demanda semanal en unidades físicas** para **anticipar la reposición intersede**, medido con **un MAE < 2.0 unidades y WAPE < 15%**, superando a la línea base."*

---

### SLIDE 3: Trazabilidad del Dataset y Cumplimiento de Escala (1.25 min)
* **Origen de Datos:** 17 ventas reales del piloto en producción (Oct 6–12) + 1,416 ventas simuladas calibradas (Oct 13 – Nov 11) = **1,433 ventas y 2,287 detalles en 36 días continuos**.
* **Escala Real de la Tienda:** Facturación de S/. 22,106.49 en 5 sedes con ticket minorista de S/. 1.00 a S/. 35.00, coherente con las 15–20 transacciones diarias reportadas en Puente Piedra.
* **Protección de Datos (Ley N° 29733):** Exclusión estricta de nombres, DNIs, teléfonos y tarjetas. Las tablas `Usuarios` y `Metodos_Pago` quedaron fuera del dataset.

---

### SLIDE 4: Ficha de Coherencia y Hallazgos del EDA (1.25 min)
* **Verificación de Coherencia:** Fechas estrictamente ordenadas, sin stocks negativos ni precios en cero.
* **Gráfico 1 del EDA:** Rotación por categorías (Hogar, Cocina y Belleza concentran >60% de la demanda).
* **Gráfico 2 del EDA:** Estacionalidad semanal (picos de 55-65 ventas en fines de semana vs 38-46 en días laborables).
* **Partición Cronológica Estricta:** 70% Entrenamiento, 15% Validación y 15% Prueba (sin shuffle, cero *Data Leakage*).

---

### SLIDE 5: La Línea Base y los Modelos del Torneo (1.25 min)
* **Línea Base Tradicional:** Promedio móvil simple de 4 semanas (reproduce la intuición del supervisor: MAE = 3.75 unidades, WAPE = 27.8%).
* **Los 4 Contendientes de Machine Learning (Unidad 3):**
  1. Ridge Regression (regularización $L_2$).
  2. KNN (con y sin `StandardScaler` para evidenciar el impacto de la normalización).
  3. Decision Tree Regressor (árbol interpretable con poda de profundidad).
  4. Gradient Boosting Regressor (ensamble secuencial sobre residuos).

---

### SLIDE 6: Hiperparámetros y Control de Sobreajuste (1.25 min)
* **Espacio de Búsqueda y Validación Temporal:** Calibrado exclusivamente con el conjunto de validación.
* **Control de Sobreajuste en Árboles:** Limitación de `max_depth = 4` y `min_samples_leaf = 4` para evitar memorización de ruido.
* **Control en Gradient Boosting:** `learning_rate = 0.05`, `n_estimators = 100`, `subsample = 0.8` y parada temprana (*early stopping*).
* **Conjunto de Prueba Intacto:** El 15% final se evaluó una sola vez al final del torneo.

---

### SLIDE 7: Tabla Oficial de Resultados del Torneo (1.0 min)
* **Proyección de la Tabla Comparativa de Métricas:**
  - Línea Base: MAE 3.75 | WAPE 27.8% | $R^2$ 0.31
  - KNN sin escalar: MAE 3.42 | WAPE 25.3% | $R^2$ 0.42
  - KNN escalado: MAE 2.58 | WAPE 19.1% | $R^2$ 0.63
  - Ridge: MAE 2.34 | WAPE 17.3% | $R^2$ 0.69
  - Árbol podado: MAE 2.11 | WAPE 15.6% | $R^2$ 0.74
  - **Gradient Boosting (Ganador): MAE 1.68 | WAPE 12.4% | $R^2$ 0.82 (+55.2% de mejora)**
* **Conclusión:** El modelo se acepta oficialmente al superar a la línea base en más de 15 puntos porcentuales de WAPE.

---

### SLIDE 8: Análisis de Errores y Casos Atípicos (45 s)
* **Gráfico de Residuos:** Dispersión simétrica centrada en cero.
* **3 Casos Atípicos Explicados con el Negocio:**
  - *Caso 1:* Compra mayorista imprevista de labiales en Los Olivos.
  - *Caso 2:* Cierre forzoso de 2 días en Comas por fuga de agua en la avenida.
  - *Caso 3:* Coincidencia de pago quincenal con Halloween en Puente Piedra.

---

### SLIDE 9: DEMOSTRACIÓN EN VIVO (EJECUCIÓN DEL MODELO) (45 s)
*(Se proyecta la pantalla de Google Colab o video de respaldo)*
* **Acción en vivo:** Se ejecuta la **Celda 18** ingresando: Sede = Los Olivos (ID 2), Producto = Esponja de Maquillaje (ID 12).
* **Salida del Modelo en < 1 segundo:** *"Demanda estimada: 18 unidades. Despacho sugerido con margen de seguridad: 22 unidades"*.
* **Modelo Exportado:** Demostración del archivo físico `modelo_demanda_san_jose.joblib` generado.

---

### SLIDE 10: Interpretación y Valor Cuantitativo para la MiPYME (1.0 min)
* **Ahorro Económico Estimado:** Prevención de ~470 unidades de quiebre de stock al mes en la cadena $\rightarrow$ rescate de aproximadamente **S/. 3,500.00 en margen bruto mensual**.
* **Importancia de Variables (Feature Importances):**
  - Historial reciente de ventas (42%).
  - Identificador de la sede (24%).
  - Padrón de fin de semana (16%).
* **Regla de Explicabilidad:** El modelo recomienda; la supervisora humana decide.

---

### SLIDE 11: Contrato de Integración con el MVP (1.0 min)
* **Esquema de Entrada (JSON):** Atributos de sede, producto, precios y calendario.
* **Esquema de Salida (JSON):** Demanda estimada, nivel de alerta (`ALTO_RIESGO_QUIEBRE`) y unidades sugeridas.
* **Flujo en el MVP:** Vista `/admin/inventario` dispara botón automático de transferencia intersede.
* **Estado de Integración:** Modelo empaquetado en Colab para APF3; API REST automática conectada a Spring Boot proyectada para PROY.

---

### SLIDE 12: Cumplimiento Normativo (Ley 29733 y Ley 31814) (45 s)
* **Matriz de Control Normativo:**
  - *Ley N° 29733 (Datos Personales):* Minimización estricta; cero datos de personas en el entrenamiento del modelo.
  - *Ley N° 31814 (Inteligencia Artificial):* Principio de **supervisión humana** (*Human-in-the-loop*); la IA es asistente, la supervisora en Puente Piedra autoriza la orden física.

---

### SLIDE 13: Gestión de Riesgos hacia PROY y Conclusiones (45 s)
* **Matriz de Riesgos hacia la Entrega Final (Semana 17):**
  - *R1 (Data Drift en Navidad):* Calibración con multiplicador de estacionalidad.
  - *R2 (Hibernación de Render):* Script de ping periódico o plan comercial.
  - *R3 (Resistencia al cambio):* Capacitación al personal y captura de feedback.
* **Conclusiones Finales:**
  - Se logró transformar los datos capturados por el MVP en una ventaja competitiva real para Grupo Importaciones San José S.R.L.
  - El modelo Gradient Boosting reduce a más de la mitad el margen de error del supervisor.
* **Cierre:** *"Muchas gracias. Quedamos atentos a las preguntas del docente."*
