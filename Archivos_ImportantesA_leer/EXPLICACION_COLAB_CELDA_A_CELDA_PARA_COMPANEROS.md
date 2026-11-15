# 🍎 GUÍA PRÁCTICA DE GOOGLE COLAB: EXPLICACIÓN CELDA A CELDA CON PERAS Y MANZANAS
## Proyecto: Machine Learning para Importaciones San José S.R.L. (APF3)
**Para:** Frank Erick Campomanes Vergara y equipo de desarrollo (Huayaney, Ronal, Kevin, Leonardo)  
**Propósito:** Que todo el grupo entienda exactamente qué hace cada celda del cuaderno de Google Colab (`Importaciones_San_Jose_APF3.ipynb`), qué significan los gráficos y tablas, y cómo redactarlo con palabras claras en el informe Word para el docente Econ. Richard Camán Sánchez.

---

## 💡 1. LA IDEA CENTRAL EN CRISTIANO (PARA EXPLICARLE AL GRUPO)

> *"Imaginen que la tienda de **Puente Piedra es la nave nodriza** (el almacén central). Cada lunes, la supervisora tiene que llenar camionetas con cajas de productos para mandarlas a Los Olivos, Comas, Ventanilla y Villasol.  
> Hoy en día, ella mira el almacén y dice: 'Manda 20 jarras a Los Olivos porque tengo muchas'. Llegan las 20 jarras a Los Olivos y nadie las compra; se llenan de polvo y estorban en los estantes. Pero en Los Olivos todas las chicas piden esponjas de maquillaje, y como solo mandaron 3, se acabaron el martes por la mañana. Las clientas se van con las manos vacías y la tienda pierde plata.  
> **¿Qué hace nuestra Inteligencia Artificial en Google Colab?**  
> Analiza todas las ventas que se hicieron en el último mes por producto, por día y por sede, y le dice a la supervisora:  
> 👉 'Para la próxima semana en Los Olivos manda 18 esponjas de maquillaje y solo 4 jarras'.  
> Así nunca falta mercadería donde se vende, ni se llena de cosas estancadas donde no rotan."*

---

## 🥊 2. EL TORNEO DE LOS 5 MODELOS: ¿QUIÉN ES QUIÉN?

El profesor exige comparar varios modelos vistos en la Unidad 3 de clase frente a una regla tradicional. Aquí está la analogía para entenderlos:

| # | Modelo Técnico | Nombre para el Grupo | ¿Cómo piensa el modelo? | Analogía de la vida real |
|:--:|---|---|---|---|
| **0** | **Línea Base (Promedio Móvil 4 semanas)** | *El método tradicional del supervisor* | "Suma lo que se vendió en las últimas 4 semanas y saca el promedio. Manda exactamente eso." | Es como manejar mirando solo por el espejo retrovisor; no sabe si es fin de semana o si viene quincena. |
| **1** | **Regresión Lineal Regularizada (Ridge/Lasso)** | *La fórmula matemática con freno* | "Calcula una ecuación matemática que le da un peso a cada dato, pero con un 'freno' para que ningún dato exagere la predicción." | Como una báscula calibrada que ajusta el peso según varios factores sin dispararse. |
| **2** | **KNN sin Normalizar (`KNeighborsRegressor`)** | *El vecino parecido sin regla* | "Busca ventas del pasado que se parezcan a hoy, pero como los precios van de 1 a 35 y los días van de 1 a 7, los números grandes marean al algoritmo." | Es como comparar a una persona por su peso en gramos (70,000 g) y su altura en metros (1.75 m); el gramo gana por goleada aunque no sea más importante. |
| **3** | **KNN Normalizado (`StandardScaler`)** | *El vecino parecido bien medido* | "Primero pone todos los datos en la misma escala (de 0 a 1 o estándar) y luego busca los días más parecidos." | Demuestra cómo la normalización de datos arregla el error del modelo anterior. |
| **4** | **Árbol de Decisión (`DecisionTreeRegressor`)** | *El mapa de preguntas lógicas* | "Hace preguntas sucesivas: ¿Es sábado? Si es sí: ¿Es en Puente Piedra? Si es sí: ¿Es categoría Cocina? Entonces la demanda estimada es 16." | Como un diagrama de flujo con ramas; muy fácil de explicar a cualquier persona de la tienda. |
| **5** | **Gradient Boosting Regressor** | *El equipo de árboles que corrigen errores* | "Entrena un primer árbol. Mira dónde falló. Entrena un segundo árbol especializado en corregir los errores del primero, y así sucesivamente." | Como un grupo de alumnos donde cada uno se especializa en revisar y corregir lo que el anterior hizo mal, logrando el resultado más exacto. |

---

## 📏 3. LAS MÉTRICAS: ¿CÓMO SABEMOS CUÁL MODELO ES MEJOR?

1. **MAE (Error Medio Absoluto) — La métrica de oro para la tienda:**
   - Se mide en **unidades físicas de producto**.
   - *Ejemplo:* Si el MAE es `1.8`, significa que, en promedio, el modelo se equivoca por menos de 2 unidades de producto (por ejemplo, predijo 15 esponjas y se vendieron 17, o predijo 10 y se vendieron 8).
   - Para el encargado es facilísimo de entender: *"El sistema solo falla por una o dos piecitas"*.

2. **RMSE (Raíz del Error Cuadrático Medio):**
   - Penaliza los errores grandes. Si un modelo en un producto se equivocó por 15 unidades de golpe, el RMSE se dispara.
   - Nos sirve para asegurarnos de que la tienda nunca sufra un desabastecimiento masivo imprevisto.

3. **WAPE (Weighted Absolute Percentage Error):**
   - Es el porcentaje de error ponderado sobre toda la venta de la cadena.
   - Permite decir en el informe: *"La supervisora al ojo tenía un error del 28%, y nuestro modelo de Gradient Boosting redujo el error al 12%"*.

---

## 🔬 4. DESGLOSE PASO A PASO DE LAS 19 CELDAS DE GOOGLE COLAB

Aquí está la guía completa de lo que hará el notebook para que tus compañeros sepan qué poner en cada sección del informe:

### 🧩 BLOQUE 1: PREPARACIÓN Y AUDITORÍA DE DATOS (Celdas 1 y 2)
- **Celda 1:** Instala e importa las librerías científicas (`pandas`, `numpy`, `matplotlib`, `seaborn`, `scikit-learn`, `joblib`).
- **Celda 2:** Carga el archivo `dataset_demanda_san_jose.csv`.
  - *Qué muestra la celda:* Un cuadro de texto con las primeras 5 filas (`df.head()`) y el conteo de la columna `origen`:
    - Registros con `real`: las ventas de la prueba piloto de octubre.
    - Registros con `simulado`: el historial complementario de 30 días.
  - *Para el informe Word:* Captura de pantalla de la auditoría que demuestra ante el profesor que los datos no contienen nombres ni DNIs (cumplimiento Ley N° 29733) y que el origen está 100% transparentado.

### 📊 BLOQUE 2: ANÁLISIS EXPLORATORIO DE DATOS - EDA (Celdas 3 y 4)
- **Celda 3 (Ventas por Categoría):**
  - *Qué gráfica genera:* Un gráfico de barras horizontales de colores mostrando las ventas totales en soles y unidades por cada una de las 7 categorías (`Cocina y Menaje`, `Hogar y Limpieza`, `Belleza y Cuidado Personal`, `Juguetes y Educación`, `Novedades y Temporada`, `Moda, Accesorios y Calzado`, `Electrónica y Tecnología`).
  - *Interpretación para el Word:* Demuestra que las categorías de alta rotación (Hogar, Cocina y Belleza) concentran más del 60% del volumen, lo que justifica abastecerlas prioritariamente.
- **Celda 4 (Días de Semana vs. Fin de Semana):**
  - *Qué gráfica genera:* Un gráfico de barras comparando de lunes a domingo.
  - *Interpretación para el Word:* Muestra visualmente que sábados y domingos alcanzan picos de 55 a 65 ventas diarias frente a 38-46 en días laborables. Esto demuestra matemáticamente por qué el modelo necesita saber si un día es fin de semana.

### ⚙️ BLOQUE 3: INGENIERÍA DE CARACTERÍSTICAS Y PARTICIÓN (Celdas 5, 6 y 7)
- **Celda 5 (Agregación Semanal):**
  - Agrupa la información por `(semana_iso, id_sede, id_producto)` y suma las cantidades para calcular `demanda_semanal`.
  - *Para el informe:* Esta es la transformación que convierte ventas individuales en la serie temporal para la supervisora.
- **Celda 6 (Feature Engineering):**
  - Crea variables numéricas interpretables: precio promedio, costo promedio, margen porcentual, banderas de sede y variables de calendario.
- **Celda 7 (Partición Cronológica Estricta 70 / 15 / 15):**
  - Divide el dataset por fechas:
    - **70% Entrenamiento:** Las primeras 3 semanas.
    - **15% Validación:** Primera mitad de la cuarta semana (para ajustar los modelos).
    - **15% Prueba (Test):** La última semana (se prueba una sola vez al final).
  - *Para el informe Word:* Resaltar que **NO se utilizó `train_test_split(shuffle=True)`**, porque mezclar datos del futuro con el pasado genera *Data Leakage* (trampa metodológica que el profesor desaprueba).

### 🏆 BLOQUE 4: EL TORNEO DE MODELOS (Celdas 8 a 13)
- **Celda 8 (Línea Base - Promedio Móvil):**
  - Calcula la predicción promediando las 4 semanas previas.
  - *Resultado:* Arroja el MAE base (ej. ~3.5 a 4.0 unidades). Esta es la marca a batir.
- **Celda 9 (Modelo 1 - Ridge / Lasso):**
  - Entrena la regresión con regularización. Reduce el error respecto a la línea base y muestra qué variables tienen pendiente positiva.
- **Celda 10 (Modelo 2 - KNN sin escalar):**
  - Entrena KNN con datos crudos. Da un error relativamente alto debido a las diferencias de escala entre precios (S/ 35) y semanas (semana 42).
- **Celda 11 (Modelo 3 - KNN con StandardScaler):**
  - Aplica `StandardScaler` y reentrena KNN.
  - *Para el informe Word:* Demostración pedagógica del impacto directo del escalado en modelos basados en distancias euclidianas.
- **Celda 12 (Modelo 4 - Árbol de Decisión Podado):**
  - Entrena un `DecisionTreeRegressor` probando profundidades (`max_depth = 3, 5, 7`) para evitar sobreajuste (*overfitting*). Muestra las reglas lógicas de decisión.
- **Celda 13 (Modelo 5 - Gradient Boosting Regressor):**
  - Entrena el ensamble secuencial. Registra el menor MAE y RMSE del torneo.

### 📈 BLOQUE 5: COMPARACIÓN Y ANÁLISIS DE NEGOCIO (Celdas 14, 15 y 16)
- **Celda 14 (Tabla Resumen del Torneo):**
  - *Qué tabla genera:* Un cuadro resumen con:
    `Modelo | MAE (unidades) | RMSE | WAPE (%) | Mejora vs. Línea Base`
  - *Para el informe Word:* Esta tabla es el corazón del APF3; evidencia con números que el modelo ganador supera ampliamente al cálculo tradicional del supervisor.
- **Celda 15 (Análisis de Fallos - 3 Casos Reales):**
  - Filtra los 3 productos donde el modelo cometió su mayor error de predicción.
  - *Hipótesis de negocio para el Word:*
    1. *Caso 1 (Novedad viral en TikTok):* Un labial o juguete que se agotó súbitamente porque una clienta se llevó 10 unidades juntas para revender.
    2. *Caso 2 (Feriado o corte de luz imprevisto en sede):* Un día donde la sede Ventanilla cerró temprano, vendiendo menos de lo esperado.
    3. *Caso 3 (Producto estacional):* Pantuflas que tuvieron baja demanda en un fin de semana caluroso.
- **Celda 16 (Importancia de Variables - Feature Importances):**
  - *Qué gráfica genera:* Gráfico de barras horizontal que ordena qué factores influyeron más en la predicción (historial de ventas, día de la semana, precio unitario, sede).

### 🚀 BLOQUE 6: INFERENCIA Y GOBERNANZA (Celdas 17, 18 y 19)
- **Celda 17 (Exportación con Joblib):**
  - Ejecuta `joblib.dump(mejor_modelo, 'modelo_demanda_san_jose.joblib')` generando el archivo binario para el backend.
- **Celda 18 (Demo de Inferencia Interactiva):**
  - Función de prueba: Le pones `ID_Sede = 2 (Los Olivos)` y `ID_Producto = 12 (Esponja de Maquillaje)` y el sistema imprime:
    *"Demanda estimada para la próxima semana: 18 unidades. Recomendación de despacho: Enviar 20 unidades considerando stock de seguridad."*
- **Celda 19 (Hoja de Gobernanza y Ética - Ley N° 31814):**
  - Tabla de cumplimiento ético: garantiza que la IA no opera sola, sino bajo la **supervisión humana** de la Supervisora Central de Puente Piedra, protegiendo además los datos de los clientes según la Ley N° 29733.

---

## 📝 5. CÓMO DEBEN COPIARLO AL WORD TUS COMPAÑEROS

1. **Capturas de pantalla ordenadas:**
   - Foto del gráfico de barras de categorías (Celda 3) → En la sección 2 (EDA).
   - Foto del gráfico de fines de semana (Celda 4) → En la sección 2 (EDA).
   - Tabla de métricas comparativas (Celda 14) → En la sección 3 (Evaluación).
   - Gráfico de importancia de variables (Celda 16) → En la sección 4 (Interpretación).
   - Ejemplo de inferencia (Celda 18) → En la sección de Integración con el MVP.
2. **Textos explicativos:** Utilizar los argumentos de este documento para redactar la justificación económica, el porqué del MAE en unidades físicas y las 3 hipótesis de negocio de la Celda 15.
