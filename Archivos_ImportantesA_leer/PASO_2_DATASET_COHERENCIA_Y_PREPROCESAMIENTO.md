# 📁 PASO 2: DATASET, COHERENCIA DE DATOS Y PREPROCESAMIENTO
## Proyecto: Grupo Importaciones San José S.R.L. (RUC 20607725731)
**Ponderación:** 20% de la nota final (4.0 puntos) — Rúbrica Oficial Indicador 2  
**Docente:** Econ. Richard Camán Sánchez | Curso: Innovación y Transformación Digital (UTP)

---

## 2.1 Descripción y Trazabilidad del Dataset

### Origen de los Datos
El dataset proviene directamente de la base de datos MySQL 8.4 en **Aiven Cloud**, combinando:
1. **Datos Reales del Piloto MVP:** 17 ventas completadas registradas en producción durante la primera semana operativa (del 6 al 12 de octubre de 2026), etiquetadas con `origen = 'real'`.
2. **Datos Simulados Calibrados:** 1,416 ventas complementarias (del 13 de octubre al 11 de noviembre de 2026), etiquetadas obligatoriamente con `origen = 'simulado'`.
- **Total Registros:** 1,433 ventas que generan **2,287 líneas de detalle de producto** en 36 días continuos, superando con holgura el mínimo de 200 filas exigido por la rúbrica.

### Tabla de Trazabilidad con el Contrato de Datos de APF2

| Elemento | Contrato de Datos Preliminar (APF2) | Dataset Obtenido en APF3 | Estado y Justificación del Cambio |
|---|---|---|---|
| **Variable Objetivo** | `demanda_semanal`: suma de `Detalle_Ventas.Cantidad` por producto/sede/semana. | `demanda_semanal`: agregación semanal exacta. | ✅ **Idéntico.** Mantiene 100% la trazabilidad. |
| **Campos Base** | `ID_Producto`, `Categoria`, `Precio_Unitario`, `Costo_Unitario`, `ID_Sede`, `Fecha_Hora`, `Cantidad`, `Metodo_Entrega`. | `id_venta`, `fecha_hora`, `dia_semana`, `es_fin_de_semana`, `semana_iso`, `semana_del_mes`, `id_sede`, `nombre_sede`, `id_producto`, `nombre_producto`, `categoria`, `precio_unitario`, `costo_unitario`, `cantidad`, `metodo_entrega`, `origen`. | ✅ **Ampliación trazable.** Se añadieron variables de calendario derivadas y la columna obligatoria `origen`. |
| **Fuente de Datos** | Tablas `Ventas`, `Detalle_Ventas`, `Productos`, `Sedes`. | Base de datos MySQL Aiven Cloud (`defaultdb`). | ✅ **Idéntico.** Misma fuente relacional. |
| **Volumen** | Estimado: 400 a 600 ventas/mes en Puente Piedra. | Obtenido: **1,433 ventas (2,287 detalles)** en toda la cadena de 5 sedes. | ✅ **Cumplido con creces.** Escala multisede calibrada. |
| **Privacidad (Ley 29733)** | Exclusión de tablas `Usuarios` y `Metodos_Pago`, sin DNI, teléfono ni nombres. | Ninguna columna de PII fue incluida en la consulta SQL ni en el CSV. | ✅ **Cumplimiento estricto.** Cero filtración de datos sensibles. |

### Procedimiento de Calibración de Datos Simulados
- **Fuente verificable de calibración:** Entrevista operativa del 18 de septiembre de 2026 con el encargado del local de Puente Piedra y validación de campo de Frank (quien laboró en la tienda).
- **Parámetros aplicados:**
  - Volumen diario en días laborables (lunes a viernes): 38 a 46 ventas distribuidas en la cadena (Puente Piedra absorbe ~15–20 transacciones diarias).
  - Volumen diario en fines de semana (sábado y domingo): 55 a 65 ventas diarias (pico comercial).
  - Precios unitarios: acotados estrictamente a la lista de precios de los 46 productos reales de Aiven (S/ 1.00 a S/ 35.00).
  - Semilla fija (`seed = 42`) para garantizar reproducibilidad exacta.

### Diccionario de Datos del Dataset Extraído (`dataset_demanda_san_jose.csv`)

| Variable | Tipo | Unidad | Descripción | Rango Válido |
|---|---|---|---|---|
| `fecha_hora` | Datetime | Fecha/Hora | Momento exacto de la transacción | 2026-10-06 a 2026-11-11 |
| `dia_semana` | String | Texto | Nombre del día (Lunes a Domingo) | Categorías válidas |
| `es_fin_de_semana`| Integer | Binario (0/1) | 1 si es Sábado o Domingo; 0 si es laborable | [0, 1] |
| `semana_iso` | Integer | Número | Semana del año calendario (ISO 8601) | [41, 46] |
| `semana_del_mes` | Integer | Número | Semana ordinal dentro del mes calendario | [1, 5] |
| `id_sede` | Integer | ID categórico | Identificador único de la sede | [1, 5] |
| `nombre_sede` | String | Texto | Nombre de la sucursal | 5 nombres de sedes |
| `id_producto` | Integer | ID categórico | Identificador único del producto | [1, 49] (excluye inactivos) |
| `nombre_producto`| String | Texto | Descripción comercial del artículo | Catálogo oficial |
| `categoria` | String | Texto | Categoría del catálogo | 6 categorías activas |
| `precio_unitario`| Decimal | Nuevos Soles (S/)| Precio de venta al público | S/ 1.00 a S/ 35.00 |
| `costo_unitario` | Decimal | Nuevos Soles (S/)| Costo de adquisición unitario | S/ 0.60 a S/ 22.00 |
| `cantidad` | Integer | Unidades físicas| Cantidad vendida en la transacción | Entero > 0 (1 a 10) |
| `metodo_entrega` | String | Categórico | Modalidad de despacho | 'Recojo en Tienda', 'Delivery' |
| `origen` | String | Categórico | Auditoría de procedencia del dato | 'real', 'simulado' |

---

## 2.2 Ficha de Coherencia de Datos (7 Criterios Oficiales de la Sección 4.2)

| Criterio Oficial | Qué se Verifica | Evidencia en el Proyecto y Código |
|---|---|---|
| **1. Escala del Negocio** | Ventas diarias acordes al tamaño de la MiPYME declarado en APF1. | Puente Piedra registra 15 a 20 pedidos diarios; el total de la cadena genera 38–65 pedidos diarios. Facturación total mensual de S/. 22,106.49 para 5 locales (promedio S/ 4,400 por local/mes), coherente con menudeo. |
| **2. Rangos y Unidades** | Sin valores imposibles (stock < 0, precios negativos, fechas futuras). | Filtros SQL y aserciones de código: `dv.Cantidad > 0`, `dv.Precio_Unitario >= 0`, `Fecha_Hora <= '2026-11-11'`. Cero violaciones. |
| **3. Consistencia Lógica y Temporal** | Fechas en orden secuencial; total = suma de líneas; categorías válidas. | Fechas ordenadas cronológicamente del 6 de Octubre al 11 de Noviembre de 2026. Los subtotales coinciden con `Cantidad * Precio_Unitario`. |
| **4. Relaciones Plausibles** | Al menos 2 relaciones reales esperadas por el negocio observadas en el EDA. | **Relación 1:** Picos claros de demanda los sábados y domingos (55-65 ventas vs 38-46 entre semana).<br>**Relación 2:** Las categorías `Hogar y Cocina`, `Belleza y Cuidado Personal` y `Moda y Accesorios` concentran el mayor volumen de rotación en las sedes físicas. |
| **5. Señal ni Nula ni Perfecta** | El target depende de las variables sin llegar a métricas imposibles ($R^2 \ge 0.98$). | El Gradient Boosting alcanza $R^2 \approx 0.78$–$0.84$ con MAE $\approx 1.6$–$1.8$ unidades. Ni es ruido blanco ($R^2 \approx 0$) ni separación trivial ($R^2 > 0.98$). |
| **6. Coherencia con APF2** | Mismos campos, tipos y fuentes del Contrato de Datos preliminar. | Se mantiene la estructura exacta aprobada en APF2, agregando únicamente variables de calendario y etiqueta de auditoría. |
| **7. Mezcla Real + Simulado** | Los datos simulados no contradicen la distribución de los reales. | Los precios promedio y tickets medios de las ventas reales (Oct 6–12) presentan medias de S/ 14.50 por ticket, consistentes con la media de S/ 15.42 de las ventas simuladas. |

---

## 2.3 Análisis Exploratorio de Datos (EDA)

1. **Visualización 1 — Demanda por Categoría de Producto:**
   - *Hallazgo:* `Hogar y Cocina` lidera con 955 transacciones (41.8%), seguida por `Novedades y Temporada` con 462 transacciones (20.2%) y `Belleza y Cuidado Personal` con 434 transacciones (19.0%). `Juguetería y Niños` (12.3%) y `Útiles y Papelería` (6.7%) completan el catálogo.
   - *Implicancia para el modelado:* La variable `categoria` tiene un poder predictivo cardinal; se debe codificar adecuadamente (One-Hot Encoding) para que los modelos reconozcan la velocidad diferencial de reposición por rubro.
2. **Visualización 2 — Estacionalidad Semanal (Laborables vs. Fin de Semana):**
   - *Hallazgo:* Los días sábados y domingos experimentan un incremento promedio del 42% en la cantidad de transacciones y un 38% más de unidades físicas movilizadas.
   - *Implicancia para el modelado:* Las variables binarias `es_fin_de_semana` y el número de semana son determinantes para predecir los picos de abastecimiento.

---

## 2.4 Limpieza y Transformación de Datos

* **Tratamiento de Nulos y Costos:** Imputación de costos faltantes en registros históricos mediante la función `COALESCE(dv.Costo_Unitario, p.Costo_Adquisicion, 0)`.
* **Codificación Categórica:** Aplicación de One-Hot Encoding (`OneHotEncoder(handle_unknown='ignore')`) sobre `categoria` y `nombre_sede` para preservar la interpretabilidad en modelos lineales y evitar sesgos ordinales.
* **Escalado de Características:** Aplicación de `StandardScaler` en variables numéricas continuas exclusivamente dentro de pipelines scikit-learn para los modelos sensibles a escala (KNN y Ridge/Lasso).
* **Ingeniería de Características (Variable Derivada Justificada):**
  - **Variable derivada creada:** `margen_unitario_porcentual = (precio_unitario - costo_unitario) / precio_unitario`.
  - *Justificación de negocio:* Los productos de mayor margen relativo presentan una rotación más elástica y permiten a la MiPYME definir prioridades de despacho para no sacrificar rentabilidad bruta ante restricciones de espacio en transporte.

---

## 2.5 Partición de Datos y Prevención de Fuga de Información (*Data Leakage*)

* **Estrategia Obligatoria: PARTICIÓN CRONOLÓGICA ESTRICTA (SIN SHUFFLE):**
  - Siendo un problema de serie temporal, la partición aleatoria tradicional (`train_test_split(shuffle=True)`) está prohibida por generar fuga de datos del futuro hacia el pasado.
  - **70% Entrenamiento (Train):** Semanas ISO 41 a 43 (6 de Octubre al 27 de Octubre de 2026).
  - **15% Validación (Val):** Semana ISO 44 (28 de Octubre al 3 de Noviembre de 2026), utilizada exclusivamente para calibración de hiperparámetros.
  - **15% Prueba (Test):** Semanas ISO 45 y 46 (4 de Noviembre al 11 de Noviembre de 2026), **mantenida completamente intacta** y evaluada una única vez al final del torneo.
* **Pipeline de Scikit-Learn:** Todo escalador y codificador se ajusta (`fit`) **únicamente con el conjunto de entrenamiento**, aplicándose por transformación (`transform`) a validación y prueba.
* **Variables con riesgo de fuga excluidas:** Subtotal, IGV y Total de la venta se excluyeron del dataset porque solo se conocen después de concretada la venta.
