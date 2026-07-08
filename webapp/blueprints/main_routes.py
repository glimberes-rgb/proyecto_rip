from flask import render_template
from . import main_bp

@main_bp.route('/')
def index():
    """Renderiza la página web principal con el contenedor del mapa Leaflet"""
    return render_template('index.html')