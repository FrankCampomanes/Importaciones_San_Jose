# 🤖 CONTEXTO MAESTRO Y GUÍA INTEGRAL PARA EL NUEVO AGENTE DE IA
## Proyecto: Grupo Importaciones San José S.R.L. — Avance 3 (APF3 Machine Learning)
> **DOCUMENTO PRINCIPAL Y ÚNICA FUENTE DE LA VERDAD (15 de Noviembre de 2026)**
> **ATENCIÓN NUEVO AGENTE:** Lee este archivo completo antes de responderle a Frank. Aquí está absolutamente todo el contexto del negocio, la base de datos real, el MVP en la nube, el informe académico, el plan de Machine Learning y las reglas de trabajo que debes seguir estrictamente.

---

## 🎯 SECCIÓN 1: ¿QUIÉN ES FRANK Y CÓMO DEBES TRABAJAR CON ÉL?

1. **Frank es el Scrum Master y líder técnico del equipo.** Además, **trabajó físicamente en la tienda**, por lo que conoce la operación real al detalle. Lo que él te diga sobre cómo funciona la tienda física, la clientela o las ventas es experiencia real de campo, no teoría inventada.
2. **Nuestras tácticas y metodología de trabajo:**
   - **Paso a paso, NUNCA todo de golpe:** No le arrojes al usuario 500 líneas de código ni intentes hacer todo el avance en un solo mensaje. Vamos fase por fase: primero se exporta el CSV, luego se construye el Google Colab celda por celda o bloque por bloque, explicando qué hace cada parte.
   - **Explicar "con peras y manzanas":** Frank necesita entender el porqué de cada código y gráfica para que él y sus compañeros (Huayaney, Ronal, Kevin, Leonardo) puedan trasladar los resultados al informe en Word y defenderlo en la sustentación ante el docente (Econ. Richard Camán Sánchez).
   - **Cero improvisación técnica:** Siempre pídele confirmación antes de dar el siguiente paso.
   - **100% en la nube, JAMÁS en localhost:** Todo el sistema ya está desplegado en Vercel, Render y Aiven Cloud. No intentes levantar servidores locales ni pruebes puertos en localhost.
   - **Seguridad en Git:** Frank trabaja sobre la rama principal `main`, pero cualquier ajuste en código del frontend/backend debe revisarse minuciosamente antes para no romper lo que ya está en producción.

---

## 🏬 SECCIÓN 2: LA EMPRESA Y LA REALIDAD DE LA TIENDA FÍSICA

### Giro de negocio:
**Grupo Importaciones San José S.R.L.** (RUC 20607725731) se dedica a la importación y comercialización minorista (menudeo / retail) de artículos para el hogar, cocina, limpieza, belleza, cuidado personal, juguetes, novedades y moda/accesorios.
- Precios de menudeo: desde S/. 1.00 (un llavero o esponja) hasta S/. 35.00 o más (mochilas, cafeteras, sets).
- Alta rotación minorista: un cliente puede comprar un artículo de S/. 2.00 y otro puede llevarse un surtido de S/. 80.00 o más.

### Las 5 sedes en Lima Metropolitana:
| ID | Sede | Rol Operativo | Participación Estimada |
|:--:|---|---|:--:|
| **1** | **Puente Piedra** (Mza. B Lote 9, Coop. San Lorenzo) | **Sede Principal + Almacén Central** | ~30% |
| **2** | **Los Olivos - 2 de Octubre** | Sede Secundaria | ~22% |
| **3** | **Los Olivos - Villasol** | Sede Secundaria | ~18% |
| **4** | **Ventanilla - Pachacútec** | Sede Secundaria | ~15% |
| **5** | **Comas - Collique** | Sede Secundaria | ~15% |

> ⚠️ **Aclaración de Transporte y Sedes:** Los envíos a provincias (como Huaraz) se realizan por agencias de carga pesada/encomiendas y **NO forman parte del alcance del MVP** para no distorsionar las métricas urbanas.

### Dinámica del fondo de caja diario (Arqueo de Caja):
- Cada mañana, la sede abre con un **fondo de caja fijo de S/. 200.00** en efectivo (para dar vuelto).
- Al final de la jornada: `Total físico en caja = S/. 200.00 (fondo inicial) + Ventas del día`.
- Al cierre, **se retira la totalidad del dinero a custodia** (incluyendo el fondo inicial). A la mañana siguiente se arranca con un nuevo fondo asignado de S/. 200.00.
- **Ejemplo real:** Si en el día se venden S/. 650.00, la caja cierra físicamente con S/. 850.00. Se retira todo y al día siguiente se vuelve a abrir con S/. 200.00.

### El problema real de negocio que resuelve el Machine Learning:
La **Supervisora Central** (ubicada en Puente Piedra) decide semanalmente qué mercadería enviar a las otras 4 sedes secundarias. Actualmente lo hace "al ojo" (por intuición o viendo qué cajas le sobran en el almacén central).
- **Consecuencia real:** Envía 20 jarras a una sede donde nadie compra jarras (quedan estancadas acumulando polvo y ocupando espacio en tienda) y no envía suficientes esponjas de maquillaje a Los Olivos, donde vuelan el primer día. Las clientas se van con las manos vacías y se pierde la venta.
- **La solución de ML para APF3:** Un modelo predictivo que le indica a la Supervisora: *"La próxima semana en Los Olivos manda 18 esponjas de maquillaje y solo 4 jarras"*.

---

## 📝 SECCIÓN 3: CORRECCIONES ACADÉMICAS OBLIGATORIAS PARA EL INFORME

El informe académico del equipo (Word/PDF que viene de APF1 y APF2) contiene algunos textos que deben ser corregidos y aclarados para que sean coherentes con la realidad:

1. **La supuesta demora de "15 a 20 minutos por pedido":**
   - *Lo que decía el informe:* Que hacer un pedido en la app tardaba 15 a 20 minutos.
   - *La realidad aclarada por Frank:* Antes del MVP **no existía aplicación web**. La demora era **en el mostrador físico de la tienda** (el cliente preguntaba por un producto novedoso, el vendedor no sabía el precio ni el stock en almacén, y tenía que buscar en hojas de Excel dispersas o llamar por teléfono al supervisor). En la práctica real de Frank, esta demora solía ser de **4 a 6 minutos**, no 20 minutos. **La aplicación web del MVP toma menos de 1 minuto.**
   - *Redacción correcta para el informe:* *"La demora en la línea base (4 a 6 minutos en mostrador físico, registrada en entrevistas iniciales como picos de hasta 15-20 min) correspondía a la consulta manual de stock y precios previa a la implementación del MVP web."*

2. **El Delivery es 100% NUEVO:**
   - Si el informe insinúa que la tienda ya hacía delivery antes, hay que corregirlo. La modalidad de entrega a domicilio fue introducida por primera vez gracias al desarrollo de este MVP.

3. **Machine Learning es REGRESIÓN, NO CLASIFICACIÓN:**
   - La variable objetivo es `demanda_semanal` (unidades continuas: 5 unidades, 18 unidades, etc.). Si alguna parte del informe dice "clasificación", se debe corregir inmediatamente a **Regresión sobre Serie Temporal**.

4. **Quién toma las decisiones:**
   - Las decisiones de reabastecimiento no las toman los vendedores locales; las toma la **Supervisora Central** en Puente Piedra. El modelo es una herramienta de apoyo a la decisión para ella.

---

## ☁️ SECCIÓN 4: ARQUITECTURA TÉCNICA Y ACCESOS (100% NUBE)

| Componente | Plataforma / Tecnología | URL / Host | Credenciales / Detalles |
|---|---|---|---|
| **Frontend** | React + Vite (desplegado en Vercel) | `https://importaciones-san-jose.vercel.app/` | Auto-deploy al hacer push a rama `main` en GitHub |
| **Backend** | Spring Boot + JWT (desplegado en Render) | `https://importaciones-san-jose-backend.onrender.com` | Swagger Docs: `/swagger-ui.html`. *Nota: Se suspende tras 15 min de inactividad, tarda ~45s en despertar.* |
| **Base de Datos** | MySQL 8.4.11 en Aiven Cloud | `mysql-34eda8b3-utp-02ac.e.aivencloud.com:10890` | DB: `defaultdb` \| User: `avnadmin` \| Pass: `[SOLICITAR_A_FRANK / Guardado en variables de entorno]` \| SSL: Requerido |
| **Admin de la Tienda** | Panel administrativo web | `https://importaciones-san-jose.vercel.app/admin` | Email: `admin123@sanjose.pe` \| Pass: `ROSES080816` |

---

## 📊 SECCIÓN 5: ESTADO REAL DE LA BASE DE DATOS Y AUDITORÍA DE VENTAS

La base de datos en Aiven cuenta con:
- **46 productos activos** reales del catálogo de la tienda.
- **2 productos de prueba (IDs 36 y 37):** "Producto Prueba Test Stock" y "Producto Prueba Test Deploys" están con `Activo = 0` y tienen **0 ventas registradas**, por lo que **no alteran ni distorsionan el dataset de Machine Learning**.
- **1,433 ventas registradas en 36 días continuos (6 de Octubre al 11 de Noviembre de 2026):**
  - **17 ventas reales** (Oct 6–12, 2026) registradas durante el piloto del MVP (`origen = 'real'`).
  - **1,416 ventas simuladas** (Oct 13 – Nov 11, 2026) calibradas con la escala real del encargado (`origen = 'simulado'`).
  - **2,287 registros de detalle** (`Detalle_Ventas`).
  - **3,208 unidades físicas vendidas**.
  - **Facturación total:** S/. 22,106.49.
  - **Costo total de adquisición:** S/. 13,198.89.
  - **Ganancia bruta total:** S/. 7,106.81 (margen promedio de ~35%).

### 📋 Tabla Oficial de Arqueo de Caja y Ventas Diarias (36 Días Reales de la BD):
Esta tabla contiene los números exactos extraídos directamente de la base de datos de Aiven, con el fondo de caja de S/. 200.00 diario:

| # | Fecha | Día | Tipo | Transacciones | Unidades | Ventas (S/.) | Costo (S/.) | Ganancia (S/.) | Fondo Inicial | Total en Caja al Cierre | Retiro a Custodia |
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | 2026-10-06 | Mar | real | 1 | 18 | S/. 100.00 | S/. 63.80 | S/. 36.20 | S/. 200.00 | S/. 300.00 | S/. 300.00 |
| 2 | 2026-10-07 | Mié | real | 1 | 10 | S/. 180.00 | S/. 117.00 | S/. 63.00 | S/. 200.00 | S/. 380.00 | S/. 380.00 |
| 3 | 2026-10-08 | Jue | real | 1 | 5 | S/. 55.00 | S/. 35.75 | S/. 19.25 | S/. 200.00 | S/. 255.00 | S/. 255.00 |
| 4 | 2026-10-10 | Sáb | real | 8 | 63 | S/. 291.50 | S/. 187.50 | S/. 104.00 | S/. 200.00 | S/. 491.50 | S/. 491.50 |
| 5 | 2026-10-11 | Dom | real | 3 | 20 | S/. 63.00 | S/. 40.50 | S/. 22.50 | S/. 200.00 | S/. 263.00 | S/. 263.00 |
| 6 | 2026-10-12 | Lun | real | 2 | 10 | S/. 41.00 | S/. 26.20 | S/. 14.80 | S/. 200.00 | S/. 241.00 | S/. 241.00 |
| 7 | 2026-10-13 | Mar | simulado | 46 | 91 | S/. 605.10 | S/. 393.48 | S/. 211.62 | S/. 200.00 | S/. 805.10 | S/. 805.10 |
| 8 | 2026-10-14 | Mié | simulado | 43 | 93 | S/. 578.80 | S/. 376.35 | S/. 202.45 | S/. 200.00 | S/. 778.80 | S/. 778.80 |
| 9 | 2026-10-15 | Jue | simulado | 43 | 102 | S/. 720.60 | S/. 468.62 | S/. 251.98 | S/. 200.00 | S/. 920.60 | S/. 920.60 |
| 10 | 2026-10-16 | Vie | simulado | 43 | 82 | S/. 537.70 | S/. 349.64 | S/. 188.06 | S/. 200.00 | S/. 737.70 | S/. 737.70 |
| 11 | 2026-10-17 | Sáb | simulado | 58 | 133 | S/. 993.90 | S/. 646.29 | S/. 347.61 | S/. 200.00 | S/. 1,193.90 | S/. 1,193.90 |
| 12 | 2026-10-18 | Dom | simulado | 65 | 139 | S/. 839.60 | S/. 545.95 | S/. 293.65 | S/. 200.00 | S/. 1,039.60 | S/. 1,039.60 |
| 13 | 2026-10-19 | Lun | simulado | 39 | 84 | S/. 483.80 | S/. 314.63 | S/. 169.17 | S/. 200.00 | S/. 683.80 | S/. 683.80 |
| 14 | 2026-10-20 | Mar | simulado | 39 | 75 | S/. 501.20 | S/. 325.88 | S/. 175.32 | S/. 200.00 | S/. 701.20 | S/. 701.20 |
| 15 | 2026-10-21 | Mié | simulado | 39 | 89 | S/. 575.90 | S/. 374.48 | S/. 201.42 | S/. 200.00 | S/. 775.90 | S/. 775.90 |
| 16 | 2026-10-22 | Jue | simulado | 43 | 102 | S/. 629.80 | S/. 409.56 | S/. 220.24 | S/. 200.00 | S/. 829.80 | S/. 829.80 |
| 17 | 2026-10-23 | Vie | simulado | 46 | 96 | S/. 609.90 | S/. 396.61 | S/. 213.29 | S/. 200.00 | S/. 809.90 | S/. 809.90 |
| 18 | 2026-10-24 | Sáb | simulado | 65 | 133 | S/. 800.50 | S/. 520.58 | S/. 279.92 | S/. 200.00 | S/. 1,000.50 | S/. 1,000.50 |
| 19 | 2026-10-25 | Dom | simulado | 58 | 112 | S/. 663.10 | S/. 431.18 | S/. 231.92 | S/. 200.00 | S/. 863.10 | S/. 863.10 |
| 20 | 2026-10-26 | Lun | simulado | 42 | 81 | S/. 445.20 | S/. 289.54 | S/. 155.66 | S/. 200.00 | S/. 645.20 | S/. 645.20 |
| 21 | 2026-10-27 | Mar | simulado | 43 | 84 | S/. 663.00 | S/. 431.09 | S/. 231.91 | S/. 200.00 | S/. 863.00 | S/. 863.00 |
| 22 | 2026-10-28 | Mié | simulado | 41 | 86 | S/. 668.70 | S/. 434.72 | S/. 233.98 | S/. 200.00 | S/. 868.70 | S/. 868.70 |
| 23 | 2026-10-29 | Jue | simulado | 38 | 77 | S/. 447.50 | S/. 290.92 | S/. 156.58 | S/. 200.00 | S/. 647.50 | S/. 647.50 |
| 24 | 2026-10-30 | Vie | simulado | 38 | 91 | S/. 610.20 | S/. 396.73 | S/. 213.47 | S/. 200.00 | S/. 810.20 | S/. 810.20 |
| 25 | 2026-10-31 | Sáb | simulado | 59 | 117 | S/. 708.40 | S/. 460.59 | S/. 247.81 | S/. 200.00 | S/. 908.40 | S/. 908.40 |
| 26 | 2026-11-01 | Dom | simulado | 60 | 125 | S/. 760.00 | S/. 494.09 | S/. 265.91 | S/. 200.00 | S/. 960.00 | S/. 960.00 |
| 27 | 2026-11-02 | Lun | simulado | 44 | 94 | S/. 517.90 | S/. 336.68 | S/. 181.22 | S/. 200.00 | S/. 717.90 | S/. 717.90 |
| 28 | 2026-11-03 | Mar | simulado | 43 | 78 | S/. 524.50 | S/. 340.97 | S/. 183.53 | S/. 200.00 | S/. 724.50 | S/. 724.50 |
| 29 | 2026-11-04 | Mié | simulado | 38 | 100 | S/. 625.70 | S/. 406.83 | S/. 218.87 | S/. 200.00 | S/. 825.70 | S/. 825.70 |
| 30 | 2026-11-05 | Jue | simulado | 41 | 96 | S/. 634.50 | S/. 412.50 | S/. 222.00 | S/. 200.00 | S/. 834.50 | S/. 834.50 |
| 31 | 2026-11-06 | Vie | simulado | 42 | 115 | S/. 743.10 | S/. 483.16 | S/. 259.94 | S/. 200.00 | S/. 943.10 | S/. 943.10 |
| 32 | 2026-11-07 | Sáb | simulado | 65 | 137 | S/. 898.40 | S/. 584.15 | S/. 314.25 | S/. 200.00 | S/. 1,098.40 | S/. 1,098.40 |
| 33 | 2026-11-08 | Dom | simulado | 64 | 162 | S/. 1,031.90 | S/. 670.98 | S/. 360.92 | S/. 200.00 | S/. 1,231.90 | S/. 1,231.90 |
| 34 | 2026-11-09 | Lun | simulado | 43 | 105 | S/. 639.80 | S/. 416.04 | S/. 223.76 | S/. 200.00 | S/. 839.80 | S/. 839.80 |
| 35 | 2026-11-10 | Mar | simulado | 45 | 100 | S/. 528.60 | S/. 343.68 | S/. 184.92 | S/. 200.00 | S/. 728.60 | S/. 728.60 |
| 36 | 2026-11-11 | Mié | simulado | 43 | 101 | S/. 567.90 | S/. 369.22 | S/. 198.68 | S/. 200.00 | S/. 767.90 | S/. 767.90 |
| **TOTAL** | **36 días** | — | — | **1,433** | **3,208** | **S/. 22,106.49** | **S/. 13,198.89** | **S/. 7,106.81** | — | — | — |

---

## 🔒 SECCIÓN 6: PROTECCIÓN DE DATOS PERSONALES (LEY N° 29733)

El dataset de Machine Learning **cumple estrictamente con la Ley N° 29733 (Ley de Protección de Datos Personales del Perú)**:
- **Exclusión total de PII (Personally Identifiable Information):** No se incluyen `Nombre_Completo`, `Num_Documento_Cliente` (DNI/RUC), `Telefono`, `Correo`, ni direcciones exactas de entrega.
- Las tablas `Usuarios` y `Metodos_Pago` quedan completamente excluidas del dataset de entrenamiento.
- La variable de entrega solo indica si fue `'Recojo en Tienda'` o `'Delivery'`, sin rastrear al usuario individual.

---

## 🚀 SECCIÓN 7: HOJA DE RUTA DETALLADA PARA EL NUEVO AGENTE (QUÉ HACER)

### 📌 PASO 1: Exportar `dataset_demanda_san_jose.csv` desde Aiven
Ejecutar la exportación usando la siguiente consulta SQL verificada contra el esquema real:

```sql
SELECT
    v.ID_Venta,
    v.Fecha_Hora,
    DAYNAME(v.Fecha_Hora)       AS dia_semana,
    CASE WHEN DAYOFWEEK(v.Fecha_Hora) IN (1,7) THEN 1 ELSE 0 END AS es_fin_de_semana,
    WEEK(v.Fecha_Hora, 3)       AS semana_iso,
    CEIL(DAY(v.Fecha_Hora)/7)   AS semana_del_mes,
    v.ID_Sede,
    s.Nombre                    AS nombre_sede,
    dv.ID_Producto,
    p.Nombre                    AS nombre_producto,
    p.Categoria                 AS categoria,
    dv.Precio_Unitario           AS precio_unitario,
    COALESCE(dv.Costo_Unitario, p.Costo_Adquisicion) AS costo_unitario,
    dv.Cantidad                 AS cantidad,
    v.Metodo_Entrega            AS metodo_entrega,
    CASE 
        WHEN v.Fecha_Hora <= '2026-10-12 23:59:59' THEN 'real' 
        ELSE 'simulado' 
    END AS origen
FROM Ventas v
JOIN Detalle_Ventas dv ON dv.ID_Venta = v.ID_Venta
JOIN Productos p       ON p.ID_Producto = dv.ID_Producto
JOIN Sedes s           ON s.ID_Sede = v.ID_Sede
WHERE v.Estado = 'Completada'
  AND dv.Cantidad > 0
  AND dv.Precio_Unitario >= 0
ORDER BY v.Fecha_Hora ASC;
```
Guardar como: `C:\Users\frank\Downloads\Importaciones_San_Jose\dataset_demanda_san_jose.csv`.

---

### 📌 PASO 2: Construir el Notebook de Google Colab (`Importaciones_San_Jose_APF3.ipynb`)
El notebook debe implementarse **celda por celda** (o en bloques estructurados), explicando con claridad a Frank cada una de las 19 celdas:

| Celda | Propósito Técnico | Qué produce / Gráfico | Explicación para los Compañeros / Word |
|:--:|---|---|---|
| **1** | Instalación de dependencias | Salida de instalación (`pip install`) | Prepara el entorno con scikit-learn, pandas, matplotlib, seaborn y joblib. |
| **2** | Carga del CSV + Auditoría `origen` | Estadísticas descriptivas (`df.describe()`) | Muestra que el dataset tiene 2,287 registros, validando las ventas reales y simuladas. |
| **3** | EDA: Ventas por Categoría | Gráfico de barras horizontales | Demuestra qué categorías rotan más (Hogar, Cocina, Belleza). |
| **4** | EDA: Ventas Hábil vs. Fin de Semana | Gráfico de barras comparativo | Demuestra que los picos ocurren sábados y domingos (55-65 ventas/día). |
| **5** | Agregación Semanal (`demanda_semanal`) | Tabla agregada por `(semana_iso, id_sede, id_producto)` | Calcula la variable objetivo continua que la supervisora necesita saber. |
| **6** | Feature Engineering | One-Hot Encoding de variables categóricas | Transforma texto (sede, categoría) en números interpretables por el modelo. |
| **7** | Partición Cronológica 70/15/15 | Tabla de rangos de fechas (Train, Val, Test) | **Estrictamente cronológica (sin shuffle)** para evitar *Data Leakage*. |
| **8** | Línea Base (Promedio Móvil 4 semanas) | MAE, RMSE y WAPE del supervisor | Simula cómo decide hoy la supervisora; es la cota a superar. |
| **9** | Modelo 1: Ridge / Lasso | Coeficientes e importancia de variables | Regresión lineal regularizada con freno para no sobredimensionar coeficientes. |
| **10** | Modelo 2: KNN sin StandardScaler | MAE, RMSE de KNN sin escalar | Modelo de vecinos cercanos; sirve de contraejemplo pedagógico. |
| **11** | Modelo 3: KNN con StandardScaler | Comparativa con el modelo anterior | Demuestra el impacto positivo de la normalización exigida en el curso. |
| **12** | Modelo 4: Decision Tree Regressor | Árbol con poda (`max_depth`) | Genera reglas lógicas transparentes y comprensibles para el negocio. |
| **13** | Modelo 5: Gradient Boosting Regressor | Curva de optimización y métricas | Ensamble de árboles que corrige errores residuales; suele ser el ganador. |
| **14** | Tabla Comparativa de Modelos | Tabla resumen con MAE, RMSE, WAPE de todos | Evidencia científica del torneo que demuestra la victoria del mejor modelo. |
| **15** | Análisis de Fallos (3 casos de error) | Gráficos de residuos + 3 hipótesis de negocio | Analiza semanas atípicas o quiebres imprevistos (explicabilidad). |
| **16** | Feature Importances | Gráfico de barras con pesos de variables | Identifica qué factores impactan más (historial, día, sede, precio). |
| **17** | Exportación del Modelo | `modelo_demanda_san_jose.joblib` | Archivo binario serializado para su futura puesta en producción. |
| **18** | Función de Inferencia Interactiva | Consulta de prueba: ingresa sede y producto → predice unidades | Simula la decisión semanal: *"Mandar 18 esponjas a Los Olivos"*. |
| **19** | Hoja de Gobernanza y Ética (Ley 31814) | Matriz de cumplimiento y supervisión humana | Justifica que la IA asiste pero la supervisora humana aprueba el despacho. |

---

### 📌 PASO 3: Revisión del Informe Académico
Cuando Frank comparta el borrador del informe en Word o texto, el agente debe contrastar los datos contra `INFORME_ACADEMICO_APF2_Y_CONTRATO_DATOS.md` y verificar que las correcciones de tiempo (4-6 min en mostrador vs 15-20 min), delivery nuevo, y regresión continua queden perfectamente asentadas.

---

## 💬 PRIMER MENSAJE RECOMENDADO PARA EL NUEVO AGENTE:

> *"¡Hola Frank! He leído y comprendido todo el contexto consolidado del proyecto Grupo Importaciones San José S.R.L. Conozco tu experiencia en tienda, las 5 sedes, la caja de S/. 200, las correcciones del informe (4-6 min en tienda física, delivery nuevo, modelo de Regresión), los 46 productos y las 1,433 ventas en Aiven. Sé que trabajaremos paso a paso y con explicaciones claras para tus compañeros. ¿Empezamos exportando el dataset `dataset_demanda_san_jose.csv` desde Aiven o deseas revisar algo antes?"*
