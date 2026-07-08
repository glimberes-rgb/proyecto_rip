import json
import os
import pandas as pd
from flask import current_app

def merge_geojson_with_predictions():
    csv_path = current_app.config['CSV_PATH']
    geojson_path = current_app.config['GEOJSON_PATH']
    
    try:
        df = pd.read_csv(csv_path, sep=',', dtype={'codigo_parroquia': str})
        df.columns = df.columns.str.strip()
    except Exception as e:
        raise Exception(f"Error al leer el archivo CSV: {str(e)}")

    predictions_dict = {
        str(row['codigo_parroquia']).strip(): {
            'riesgo': str(row['riesgo_predicho']).strip().capitalize(),
            'probabilidad': round(float(row['probabilidad_prediccion']), 4),
            'canton': str(row['canton']).strip().title(),
            'provincia': str(row['provincia']).strip().title(),
            'parroquia_nombre': str(row['parroquia']).strip().title()
        }
        for _, row in df.iterrows()
    }
        
    with open(geojson_path, 'r', encoding='utf-8') as f:
        geojson_data = json.load(f)
        
    
    features_filtradas = []
    
    for feature in geojson_data.get('features', []):
        properties = feature.get('properties', {})
        codigo_geojson = properties.get('codigo_parroquia') or properties.get('DPA_PARROQ') or properties.get('codigo')
        
        if codigo_geojson:
            codigo_geojson = str(codigo_geojson).strip()
            
            if codigo_geojson in predictions_dict:
                data_modelo = predictions_dict[codigo_geojson]
                properties['riesgo_rip'] = data_modelo['riesgo']
                properties['probabilidad_rip'] = data_modelo['probabilidad']
                properties['canton_rip'] = data_modelo['canton']
                properties['provincia_rip'] = data_modelo['provincia']
                properties['parroquia_rip'] = data_modelo['parroquia_nombre']
                
                features_filtradas.append(feature) # Solo entra si es válida
                
    
    geojson_data['features'] = features_filtradas
    return geojson_data