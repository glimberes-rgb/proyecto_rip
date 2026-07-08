from flask import Blueprint

# Definición de los Blueprints core del proyecto RIP
main_bp = Blueprint('main', __name__)
api_bp = Blueprint('api', __name__, url_prefix='/api/v1')

# Importamos las rutas para asociarlas a los Blueprints
from . import main_routes, api_routes