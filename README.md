# Plataforma RIP: Riesgo de Inundación Parroquial

Visualización cartográfica predictiva basada en modelos de Machine Learning (Random Forest optimizado) y desarrollada utilizando una arquitectura desacoplada con Python, Flask y Leaflet.js.

## Características
- **Backend:** Desarrollado en Python con el microframework Flask utilizando una estructura modular (*Application Factory*).
- **Pipeline de Datos:** Procesamiento y depuración automatizada de datos espaciales y probabilísticos (GeoJSON y CSV) mediante Python.
- **Frontend Interactivo:** Visor geográfico dinámico con Leaflet.js que integra mapas de coropletas, controles interactivos (*Hover*), leyendas estáticas y paneles informativos de certeza estadística del clasificador.

##  Equipo de Ingeniería & Roles

* **Arroyo Chuquin Jorge Santiago** — *Data Research Analyst* (Validación de fuentes y consistencia metodológica).
* **Pincay Chilan Daniela Alexandra** — *Data Engineer* (Diseño de pipelines de extracción y unificación de datos).
* **Álvarez Aguayo Miguel Alejandro** — *Feature Engineer* (Transformación de variables, cálculo de proximidades e ingeniería de atributos).
* **Navarrete Ronquillo Jesús Alonso** — *Data Analyst* (Análisis exploratorio, distribuciones probabilísticas y diagnóstico estadístico).
* **Benalcázar Solórzano Ricardo Axel** — *Machine Learning Engineer* (Entrenamiento, tuning de hiperparámetros y optimización del clasificador multinomial).
* **Guadamud Yepez Limber Manuel** — *MLOps & Frontend / Deployment Engineer* (Arquitectura de software, API REST en Flask, UI/UX geoespacial con Leaflet.js y estrategia de despliegue continuo).




## Arquitectura y Acoplamiento del Modelo

El sistema implementa una arquitectura desacoplada que separa el procesamiento de datos en el backend de la visualización interactiva en el frontend

[ prediciones.csv ] + [ limites_parroquiales.geojson ]
                         │
                         ▼
           BACKEND (Flask: api_routes.py)
   • Carga CSV indexado en memoria (Diccionario) -> O(1)
   • Normalización de IDs a 6 dígitos (limpiar_codigo)
                         │
                  (JSON Enriquecido)
                         │
                         ▼
             FRONTEND (Leaflet.js / JS)
   • Consumo asíncrono y renderizado de coropletas


---

## Instrucciones de Ejecución Local

### 1. Requisitos Previos
Asegúrate de tener instalado Python 3.10 o superior en tu sistema.

### 2. Clonar el Proyecto e Instalar Dependencias
```bash
git clone [https://github.com/glimberes-rgb/proyecto_rip.git](https://github.com/glimberes-rgb/proyecto_rip.git)
cd proyecto_rip

# Instalar las librerías necesarias
pip install -r requirements.txt

#Inicia el microservidor de Flask
python app.py

# Accede al navegador web:
http://127.0.0.1:5000/

---

## Estructura del Despliegue

```text
proyecto_rip/
│
├── app.py                  # Punto de entrada principal (Ejecución del Servidor)
├── requirements.txt        # Manifiesto de dependencias de Python
├── README.md               # Documentación de ingeniería del sistema
│
└── webapp/                 # Módulo principal de la aplicación de Flask
    ├── __init__.py         # Inicialización del patrón Application Factory
    ├── routes.py           # Definición de endpoints y enrutamiento de la API REST
    ├── data_processor.py   # Pipeline analítico de limpieza y merge geométrico
    │
    ├── data/               # Almacenamiento de archivos planos (No subidos a producción)
    │   ├── predicciones_mapa_parroquias.csv
    │   └── limites_parroquiales.geojson
    │
    ├── templates/          # Renderizado de Vistas
    │   └── index.html      # Interfaz de usuario y maquetación de créditos corporativos
    │
    └── static/             # Assets Estáticos del Servidor
        ├── css/
        │   └── styles.css  # Reglas de estilos de los paneles contenedores
        └── js/
            └── map.js      # Controlador de mapas (L.map, Leyenda, Hover y Popups)

---


Repositorio de Datos e Ingesta (.CSV)

El pipeline automatizado de datos unifica las siguientes capas de información geográfica indexadas por códigos parroquiales:
1.  **`precipitacion_historica_parroquias_inamhi.csv`**: Registros históricos de pluviosidad acumulada extrema (Fuente: INAMHI).
2.  **`altitud_pendiente_parroquias_costa_copernicus.csv`**: Modelos Digitales de Elevación (DEM) para cálculo de pendientes e inclinación del terreno (Fuente: Copernicus Global DSM).
3.  **`distancia_rios_parroquias.csv`**: Métricas euclidianas de proximidad a cuerpos de agua estables e intermitentes.
4.  **`densidad_poblacional_parroquias_modelo_costa.csv`**: Censos estructurales para evaluación estocástica de vulnerabilidad socioeconómica.
5.  **`uso_suelo_parroquias_mapbiomas.csv`**: Coeficientes de absorción de suelos según cobertura vegetal y parches urbanos (Fuente: MapBiomas).

---
