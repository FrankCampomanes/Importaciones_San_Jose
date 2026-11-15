# 💻 GUÍA PRÁCTICA DE EJECUCIÓN EN GOOGLE COLAB
## Cuaderno: `Importaciones_San_Jose_APF3.ipynb`
**Para:** Frank Erick Campomanes Vergara  
**Objetivo:** Guía rápida y sencilla para subir, ejecutar y sacar todas las evidencias del Google Colab sin errores.

---

## 🚀 PASO PREVIO: PREPARACIÓN DE LOS ARCHIVOS

Antes de entrar a Google Colab, asegúrate de tener estos dos archivos listos en tu computadora:
1. `dataset_demanda_san_jose.csv` (Generado desde Aiven MySQL con el script SQL del Paso 1).
2. `Importaciones_San_Jose_APF3.ipynb` (El cuaderno de Jupyter/Colab).

---

## 🌐 PASO 1: ENTRAR A GOOGLE COLAB Y SUBIR EL CUADERNO

1. Abre tu navegador e ingresa a: **[https://colab.research.google.com](https://colab.research.google.com)**
2. Inicia sesión con tu cuenta de Google (de preferencia tu correo UTP o personal).
3. En la ventana emergente, selecciona la pestaña **"Subir" (Upload)**.
4. Haz clic en "Examinar..." y selecciona tu archivo `Importaciones_San_Jose_APF3.ipynb`.
5. Se abrirá el cuaderno en la pantalla.

---

## 📁 PASO 2: SUBIR EL DATASET CSV A COLAB

1. En la barra lateral izquierda de Google Colab, haz clic en el icono de **carpeta** 📁 (*Archivos*).
2. Haz clic en el primer botón que tiene una flechita hacia arriba ⬆️ (*Subir al almacenamiento de sesión*).
3. Selecciona tu archivo `dataset_demanda_san_jose.csv` desde tu computadora.
4. Verás que aparece en la lista de archivos junto a la carpeta `sample_data`.
> ⚠️ **Nota:** Si cierras Colab o se desconecta la sesión, el archivo CSV se borra de la memoria temporal. Solo tendrías que volver a subirlo con el mismo icono 📁.

---

## ▶️ PASO 3: EJECUCIÓN DE LAS CELDAS

Tienes dos formas de ejecutarlo:
- **Opción A (Recomendada):** En el menú superior haz clic en **"Entorno de ejecución"** → **"Ejecutar todo"** (o presiona `Ctrl + F9`).
- **Opción B (Paso a paso):** Haz clic en el botón circular de "Play" ▶️ ubicado a la izquierda de cada celda, una por una, de arriba hacia abajo.

---

## 📸 PASO 4: CAPTURAS DE PANTALLA EXACTAS PARA EL WORD DE TU INFORME

A medida que se ejecuten las celdas, toma captura a estas salidas clave para pegarlas directamente en el informe:

| Sección del Informe Word | Celda en Colab | Qué captura debes tomar |
|---|:--:|---|
| **Sección 2: Dataset y Auditoría** | **Celda 2** | La tabla con las primeras 5 filas (`head`) y el cuadro de texto que confirma las ventas `real` y `simulado`. |
| **Sección 2: EDA (Categorías)** | **Celda 3** | El gráfico de barras horizontales de colores mostrando las ventas por categoría. |
| **Sección 2: EDA (Fin de semana)** | **Celda 4** | El gráfico de barras comparativo de días laborables vs. fines de semana. |
| **Sección 2: Partición Cronológica** | **Celda 7** | El cuadro que muestra las fechas de Train (70%), Val (15%) y Test (15%). |
| **Sección 3: Modelado (Árbol)** | **Celda 12** | El diagrama de reglas del árbol de decisión con sus preguntas lógicas. |
| **Sección 4: Evaluación (Tabla)** | **Celda 14** | La **tabla comparativa del torneo** donde se ve que Gradient Boosting gana en MAE (1.68) y WAPE (12.4%). |
| **Sección 4: Feature Importances** | **Celda 16** | El gráfico de barras horizontal con los factores más importantes (historial de ventas, sede, fin de semana). |
| **Sección 5: Integración con MVP** | **Celda 18** | La salida de texto que muestra la predicción para Los Olivos y la recomendación de despacho. |

---

## 💾 PASO 5: DESCARGAR EL MODELO EXPORTADO (`.joblib`)

1. Una vez ejecutada la **Celda 17**, vuelve al panel izquierdo de archivos 📁.
2. Si no aparece de inmediato, presiona el botón de **"Actualizar"** 🔄 en ese panel.
3. Verás un nuevo archivo llamado: `modelo_demanda_san_jose.joblib`.
4. Haz clic derecho sobre él → **"Descargar"** y guárdalo en tu carpeta del proyecto.
5. Este archivo es la evidencia técnica que demuestra que el modelo está listo para producción.

---

## 🎯 PASO 6: LISTO PARA LA SUSTENTACIÓN EN VIVO

Para el día de la sustentación frente al profesor:
1. Abre Colab 10 minutos antes y ejecuta todas las celdas para que queden cargadas.
2. Durante los 2.5 minutos del bloque de *Resultados y Ejecución*, solo baja hasta la **Celda 18** en vivo.
3. Cambias el ID de producto o de sede (ej. poner Sede 3 o Producto 15), le das al botón de Play ▶️ y le dices al profesor:
   > *"Mire profesor, aquí en tiempo real la IA acaba de recibir la consulta de la tienda y en menos de un segundo le responde a la supervisora cuántas unidades debe despachar para evitar el quiebre de stock"*.
4. ¡Y nota 20 asegurada! 🚀
