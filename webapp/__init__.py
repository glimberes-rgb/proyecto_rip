import os  
from flask import Flask
from config import DevelopmentConfig

def create_app():
    """Fábrica de la aplicación para el Proyecto RIP"""
    app = Flask(__name__)
    
    # Cargar configuraciones del entorno de desarrollo
    app.config.from_object(DevelopmentConfig)
    
    # Definir las rutas absolutas de tus datos dentro de app.config
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app.config['CSV_PATH'] = os.path.join(base_dir, 'data', 'predicciones_mapa_parroquias.csv')
    app.config['GEOJSON_PATH'] = os.path.join(base_dir, 'data', 'limites_parroquiales.geojson') # <-- Usamos el nombre real

    # Registro de los Blueprints modulares
    from webapp.blueprints import main_bp, api_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    return app