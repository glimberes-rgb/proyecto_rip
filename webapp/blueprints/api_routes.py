from flask import jsonify
from . import api_bp
from webapp.utils.data_processor import merge_geojson_with_predictions

@api_bp.route('/map-data', methods=['GET'])
def get_map_data():
    try:
        merged_data = merge_geojson_with_predictions()
        return jsonify(merged_data), 200
    except Exception as e:
        return jsonify({"error": "Error al procesar los datos geográficos", "details": str(e)}), 500