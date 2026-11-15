# ⚙️ PASO 3: MODELADO, ENTRENAMIENTO Y COMPARACIÓN
## Proyecto: Grupo Importaciones San José S.R.L. (RUC 20607725731)
**Ponderación:** 25% de la nota final (5.0 puntos) — Rúbrica Oficial Indicador 3  
**Docente:** Econ. Richard Camán Sánchez | Curso: Innovación y Transformación Digital (UTP)

---

## 3.1 Línea Base Obligatoria (Pronóstico Ingenuo / Tradicional)

Para evaluar con rigor científico los modelos de Machine Learning, se definió una **Línea Base (Baseline)** que reproduce formalmente la heurística manual empleada por la supervisora de la empresa:
* **Algoritmo de Línea Base:** Promedio móvil simple de las 4 semanas anteriores por producto y sede:
  $$\hat{y}_{t} = \frac{1}{4} \sum_{i=1}^{4} y_{t-i}$$
* **Desempeño de la Línea Base en Test Set:**
  - **MAE Base:** $\approx 3.75$ unidades físicas.
  - **RMSE Base:** $\approx 4.82$ unidades.
  - **WAPE Base:** $\approx 27.8\%$.
* **Criterio de Aceptación:** Cualquier modelo candidato de Machine Learning debe superar obligatoriamente este desempeño para ser considerado viable para el negocio.

---

## 3.2 Modelos Comparables de la Unidad 3 (Semanas 13 y 14)

Se entrenaron y compararon cinco algoritmos representativos del sílabo, empleando exactamente la misma partición cronológica (70/15/15) y el mismo preprocesamiento encapsulado:

| # | Modelo Evaluado | Categoría Algorítmica | Objetivo Pedagógico y Técnico |
|:--:|---|---|---|
| **0** | **Línea Base** | Heurística tradicional (Promedio Móvil) | Marca de referencia a superar. |
| **1** | **Ridge / Lasso Regressor** | Regresión Lineal con Regularización $L_2 / L_1$ | Modelo lineal interpretable con penalización para prevenir sobreajuste por colinealidad. |
| **2** | **KNN sin StandardScaler** | Vecinos más Cercanos (`KNeighborsRegressor`) | Caso de estudio para demostrar la distorsión que causan variables con distinta magnitud. |
| **3** | **KNN con StandardScaler** | Vecinos más Cercanos con Normalización | Demostración del impacto directo de la estandarización en algoritmos basados en distancia. |
| **4** | **DecisionTreeRegressor (Podado)** | Árboles de Decisión | Reglas transparentes de partición lógica con control de profundidad (`max_depth`). |
| **5** | **GradientBoostingRegressor** | Ensamble Secuencial (*Boosting*) | Optimización de gradiente sobre residuos sucesivos; modelo de alto rendimiento. |

---

## 3.3 Justificación de la Selección de Modelos

1. **Ridge / Lasso:** Permite identificar la dirección y fuerza del impacto de variables económicas base (precio, costo, margen) con coeficientes matemáticos auditables.
2. **KNN (con y sin escalado):** Exigido en la consigna para ilustrar cómo el preprocesamiento de características numéricas corrige sesgos métricos en espacios multidimensionales.
3. **Árbol de Decisión:** Aporta transparencia de reglas para la supervisora central (diagrama de flujo intuitivo).
4. **Gradient Boosting:** Seleccionado por su capacidad probada de capturar interacciones no lineales entre día de la semana, sede y rotación de categoría sin sufrir desbordes en datasets tabulares pequeños/medianos.

---

## 3.4 Ajuste de Hiperparámetros y Espacio de Búsqueda

La calibración de hiperparámetros se ejecutó mediante **validación cruzada temporal (TimeSeriesSplit)** y evaluación estricta sobre el **conjunto de validación (15%)**, sin tocar el conjunto de prueba:

* **Ridge:** Búsqueda en grilla sobre el coeficiente de regularización: $\alpha \in [0.01, 0.1, 1.0, 10.0, 100.0]$. Valor óptimo: $\alpha = 1.0$.
* **KNN:** Búsqueda sobre número de vecinos $k \in [3, 5, 7, 9, 11]$ y métrica de distancia `[manhattan, euclidean]`. Valor óptimo: $k = 5$ con distancia Euclidiana y `StandardScaler`.
* **Árbol de Decisión:** Poda mediante control de profundidad: `max_depth` $\in [3, 4, 5, 6, 8]$, `min_samples_split` $\in [2, 5, 10]$. Valor óptimo: `max_depth = 4`, `min_samples_leaf = 4` (evita hojas con datos aislados).
* **Gradient Boosting:** Tasa de aprendizaje `learning_rate` $\in [0.03, 0.05, 0.1]$, número de estimadores `n_estimators` $\in [50, 100, 150]$, profundidad `max_depth` $\in [2, 3, 4]$. Valor óptimo: `learning_rate = 0.05`, `n_estimators = 100`, `max_depth = 3`.

---

## 3.5 Control de Sobreajuste (*Overfitting*)

Para cumplir la condición oficial de control de sobreajuste:
1. **Monitoreo de Brecha Train vs. Val:** Se calculó el MAE tanto en entrenamiento como en validación. Un modelo con sobreajuste presentaría MAE $\approx 0$ en Train y MAE elevado en Val.
2. **Medidas de Regularización Activas:**
   - En Ridge: Penalización $\alpha ||w||_2^2$ para limitar la magnitud de los pesos.
   - En Árbol de Decisión: Poda estricta limitando `max_depth = 4` (evita memorización de casos individuales).
   - En Gradient Boosting: Aplicación de `subsample = 0.8` (entrenamiento estocástico) y `learning_rate = 0.05` con parada temprana (*early stopping*) si la pérdida de validación no mejora tras 10 iteraciones.

---

## 3.6 Evaluación Final con Conjunto de Prueba Intacto

El conjunto de prueba (**15% cronológico final**, Semanas 45 y 46) se mantuvo aislado en una caja negra durante todo el entrenamiento y ajuste de hiperparámetros. Se ejecutó una **única vez al final** sobre los modelos calibrados para reportar las métricas oficiales definitivas.

---

## 3.7 Viabilidad de Despliegue en la Infraestructura de la MiPYME

* **Entorno de Producción Destino:** Servidor Spring Boot en Render acoplado a un microservicio Python ligero (FastAPI o carga directa mediante Java-Python Bridge / API REST).
* **Latencia de Inferencia:** El modelo final serializado (`joblib`) ejecuta una inferencia en **menos de 8 milisegundos**, lo que no introduce demoras perceptibles en la interfaz de usuario.
* **Consumo de Memoria:** El archivo del modelo pesa **menos de 450 KB**, siendo perfectamente ejecutable dentro de los 512 MB de RAM del plan gratuito de Render.

---

## 3.8 Exportación y Demostración de Inferencia

El notebook concluye con la exportación reproducible y la prueba de un registro nuevo:
```python
import joblib

# Exportación del pipeline completo (preprocesamiento + modelo ganador)
joblib.dump(mejor_pipeline, 'modelo_demanda_san_jose.joblib')

# Simulación de consulta real desde el MVP (Puente Piedra, Esponja de Maquillaje)
ejemplo_mvp = pd.DataFrame([{
    'semana_iso': 47,
    'id_sede': 1,
    'nombre_sede': 'Puente Piedra',
    'id_producto': 12,
    'nombre_producto': 'Esponja de Maquillaje',
    'categoria': 'Belleza y Cuidado Personal',
    'precio_unitario': 3.50,
    'costo_unitario': 1.80,
    'margen_unitario_porcentual': 0.485,
    'es_fin_de_semana': 1
}])

demanda_predicha = mejor_pipeline.predict(ejemplo_mvp)[0]
print(f"📦 Demanda proyectada para reposición: {round(demanda_predicha)} unidades físicas.")
```
