import os

class Config:
    """Configuración base para el proyecto RIP (Riesgo Inundación Parroquial)"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'clave_secreta_para_desarrollo_local_rip_2026'
    
    # Manejo de rutas 
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATA_DIR = os.path.join(BASE_DIR, 'webapp', 'data')
    
    # Rutas 
    CSV_PATH = os.path.join(DATA_DIR, 'predicciones_mapa_parroquias.csv')
    GEOJSON_PATH = os.path.join(DATA_DIR, 'parroquias.geojson')

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False