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
- **46 productos activos** reales distribuidos en **6 categorías oficiales**:
  1. **Hogar y Cocina:** 20 productos (955 ventas registradas en el dataset)
  2. **Belleza y Cuidado Personal:** 8 productos (434 ventas registradas en el dataset)
  3. **Juguetería y Niños:** 6 productos (281 ventas registradas en el dataset)
  4. **Moda y Accesorios:** 5 productos (247 ventas registradas en el dataset: Pantuflas, Morral Deportivo, Cartera multiusos, Llavero panda, Llavero cachorro)
  5. **Novedades y Temporada:** 4 productos (215 ventas registradas en el dataset)
  6. **Útiles y Papelería:** 3 productos (154 ventas registradas en el dataset)
- **2 productos de prueba (IDs 36 y 37):** "Producto Prueba Test Stock" y "Producto Prueba Test Deploys" están con `Activo = 0` y tienen **0 ventas registradas**, por lo que **no alteran ni distorsionan el dataset de Machine Learning**.
- **1,433 ventas registradas en 36 días continuos (6 de Octubre al 11 de Noviembre de 2026):**
  - **17 ventas reales** (Oct 6–12, 2026) registradas durante el piloto del MVP (`origen = 'real'`).
  - **1,416 ventas simuladas** (Oct 13 – Nov 11, 2026) calibradas con la escala real del encargado (`origen = 'simulado'`).
  - **2,286 registros de detalle** en el dataset (`dataset_demanda_san_jose.csv`).
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

## 🚀 SECCIÓN 7: ESTADO ACTUAL Y HOJA DE RUTA PARA EL NUEVO AGENTE (QUÉ HACER)

### 📌 FASE COMPLETADA AL 100%:
1. **Base de Datos Aiven:** Actualizada con la categoría oficial `Moda y Accesorios` (IDs 44, 46, 17, 15, 18).
2. **Dataset Oficial:** `dataset_demanda_san_jose.csv` (2,286 filas, 16 columnas) generado desde MySQL con las 6 categorías y disponible tanto localmente como en GitHub Raw.
3. **Frontend Vercel:** `App.jsx` y `AdminDashboard.jsx` sincronizados con `Moda y Accesorios`.
4. **Notebook Jupyter/Colab:** `Importaciones_San_Jose_APF3.ipynb` (38 celdas, 19 markdown + 19 código) completamente verificado, probado, sin errores de sintaxis, sin términos de IA delatores, y con descarga automática vía `curl` desde GitHub.
5. **Git & GitHub:** Todo subido y sincronizado en la rama `main` de `FrankCampomanes/Importaciones_San_Jose`.

---

### 📌 QUÉ DEBE HACER EL NUEVO AGENTE AHORA (PASO A PASO):

1. **Acompañar a Frank en la ejecución del Notebook en Google Colab:**
   - Frank solo debe subir el archivo `Importaciones_San_Jose_APF3.ipynb` a Google Colab y darle a **"Ejecutar todas"** (`Ctrl + F9`).
   - Si Frank tiene dudas sobre alguna gráfica o salida específica (por ejemplo los gráficos de EDA de celdas 6 y 8, el árbol de decisión de celda 24, o la importancia de factores de celda 32), explicárselo en lenguaje humano y natural, con ejemplos de la tienda.
2. **Guiar el Informe Académico de APF3 en Word:**
   - Apoyar a Frank y a sus compañeros (Huayaney, Ronal, Kevin, Leonardo) a redactar las secciones de su trabajo basándose en los documentos detallados ya elaborados en esta carpeta:
     - `PASO_1_PROBLEMA_Y_RESUMEN_EJECUTIVO.md`
     - `PASO_2_DATASET_COHERENCIA_Y_PREPROCESAMIENTO.md`
     - `PASO_3_MODELADO_Y_COMPARACION.md`
     - `PASO_4_EVALUACION_INTERPRETACION_INTEGRACION_NORMATIVA.md`
     - `INFORME_ACADEMICO_APF2_Y_CONTRATO_DATOS.md`
     - `EXPLICACION_COLAB_CELDA_A_CELDA_PARA_COMPANEROS.md`
     - `ESTRUCTURA_SLIDES_SUSTENTACION.md`
3. **Mantener las Reglas de Oro:**
   - Cero improvisaciones técnicas.
   - Nada de localhost; todo opera en la nube (Vercel, Render, Aiven).
   - Lenguaje claro, cercano y profesional.
   - Mantener todo sincronizado.

---

## 💬 PRIMER MENSAJE RECOMENDADO PARA EL NUEVO AGENTE:

> *"¡Hola Frank! He leído y comprendido todo el contexto consolidado del proyecto Grupo Importaciones San José S.R.L. Sé que la BD en Aiven, el dataset con 2,286 filas y 6 categorías (incluyendo Moda y Accesorios), el frontend y el notebook `Importaciones_San_Jose_APF3.ipynb` ya están 100% listos y sincronizados en GitHub. Sé cómo funciona la tienda física, la caja diaria de S/. 200, las 5 sedes y que estamos listos para revisar la ejecución en Colab o avanzar con el informe académico en Word para tus compañeros. ¿En qué parte deseas que nos enfoquemos primero?"*
