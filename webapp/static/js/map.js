document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar el mapa
    const map = L.map('map').setView([-1.8312, -78.1834], 7);

    // 2. Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 3. Asignar color por nivel de riesgo predictivo
    function getColor(riesgo) {
        if (!riesgo) return '#94a3b8';
        switch (riesgo.trim().toLowerCase()) {
            case 'alto': return '#ef4444';   // Rojo
            case 'medio': return '#f97316';  // Naranja
            case 'bajo': return '#22c55e';   // Verde
            default: return '#94a3b8';       // Gris
        }
    }

    // 4. Estilo dinámico para los polígonos
    function style(feature) {
        const riesgo = feature.properties ? feature.properties.riesgo_rip : null;
        return {
            fillColor: getColor(riesgo),
            weight: 1.5,
            opacity: 1,
            color: '#ffffff',
            dashArray: '3',
            fillOpacity: 0.65
        };
    }

    // 5. Panel de Información Flotante para el Hover
    const infoPanel = L.control({ position: 'topright' });

    infoPanel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info-panel');
        this.update();
        return this._div;
    };

    // Método para actualizar el contenido del panel según la parroquia sobre la que esté el mouse
    infoPanel.update = function (props) {
        this._div.innerHTML = `
            <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #cbd5e1; min-width: 200px; font-family: sans-serif; line-height: 1.5;">
                <h4 style="margin: 0 0 8px 0; color: #1e293b; font-size: 15px; border-bottom: 2px solid #3b82f6; padding-bottom: 4px;">Información de Ubicación</h4>
                ${props ? `
                    <strong>Parroquia:</strong> <span style="color:#2563eb;">${props.parroquia_rip || 'N/A'}</span><br/>
                    <strong>Cantón:</strong> ${props.canton_rip || 'N/A'}<br/>
                    <strong>Provincia:</strong> ${props.provincia_rip || 'N/A'}
                ` : '<span style="color:#64748b; font-style:italic;">Pasa el cursor sobre una parroquia</span>'}
            </div>
        `;
    };

    infoPanel.addTo(map);

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        const grades = ['Alto', 'Medio', 'Bajo'];
        const labels = [];

        // Contenedor principal 
        div.style.background = 'white';
        div.style.padding = '10px 14px';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        div.style.border = '1px solid #cbd5e1';
        div.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        div.style.fontSize = '12px';
        div.style.lineHeight = '20px';
        div.style.color = '#334155';

        // Título de la leyenda
        div.innerHTML = `<h4 style="margin: 0 0 6px 0; color: #0f172a; font-size: 13px; font-weight: 600; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">Simbología</h4>`;

        // Generar un cuadro de etiqueta
        grades.forEach(grade => {
            const color = getColor(grade);
            labels.push(`
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <i style="width: 16px; height: 16px; float: left; margin-right: 8px; background-color: ${color}; border-radius: 4px; opacity: 0.7; border: 1px solid ${color}40;"></i>
                    <span style="font-weight: 500;">Riesgo ${grade}</span>
                </div>
            `);
        });

        div.innerHTML += labels.join('');
        return div;
    };

    legend.addTo(map);

    // 6. Configurar eventos para cada polígono (Hover y Click)
    function onEachFeature(feature, layer) {
        const p = feature.properties;
        
        if (p) {
            // Convertir y formatear la probabilidad
            let rawProb = parseFloat(p.probabilidad_rip || 0);
            // Si viene en formato 0-1 (ej: 0.7118), lo pasamos a 0-100 para la barra
            let porcBarra = rawProb <= 1 ? (rawProb * 100).toFixed(2) : rawProb.toFixed(2);
            
            
            let aproximadoEscenarios = Math.round(porcBarra / 10);
            if (aproximadoEscenarios === 0 && porcBarra > 0) aproximadoEscenarios = 1;

            const colorRiesgo = getColor(p.riesgo_rip);

            // Contenido del Popup 
            const popupContent = `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 13px; line-height: 1.5; min-width: 230px; color: #334155;">
                    <!-- Cabecera de Ubicación -->
                    <h4 style="margin: 0 0 2px 0; color: #0f172a; font-size: 15px; font-weight: 600;">${p.parroquia_rip || 'N/A'}</h4>
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 500;">
                        ${p.canton_rip || 'N/A'} &bull; ${p.provincia_rip || 'N/A'}
                    </span>
                    
                    <hr style="margin: 10px 0; border: 0; border-top: 1px solid #e2e8f0;">
                    
                    <!-- Métrica de Riesgo Predictivo -->
                    <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <strong>Riesgo Predicho:</strong>
                        <span style="background-color: ${colorRiesgo}20; color: ${colorRiesgo}; font-weight: 700; padding: 2px 8px; border-radius: 4px; font-size: 12px; border: 1px solid ${colorRiesgo}40;">
                            ${p.riesgo_rip || 'N/A'}
                        </span>
                    </div>

                    <!-- Métrica de Confianza del Clasificador -->
                    <div style="margin-bottom: 4px; display: flex; justify-content: space-between; font-weight: 500;">
                        <span>Certeza de la Categoría:</span>
                        <span style="color: #0f172a; font-weight: 600;">${porcBarra}%</span>
                    </div>

                    <!-- BARRA DE PROGRESO UX: Confianza del Algoritmo -->
                    <div style="width: 100%; background-color: #f1f5f9; border-radius: 10px; height: 6px; margin-bottom: 4px; overflow: hidden; border: 1px solid #e2e8f0;">
                        <div style="width: ${porcBarra}%; background-color: ${colorRiesgo}; height: 100%; border-radius: 10px; transition: width 0.5s ease-in-out;"></div>
                    </div>
                    
                    <!-- Nota técnica sutil aclaratoria -->
                    <span style="font-size: 10px; color: #94a3b8; font-style: italic; display: block; text-align: right;">
                        Confianza estadística del modelo de IA.
                    </span>
                </div>
            `;
            
            layer.bindPopup(popupContent, {
                maxWidth: 260,
                className: 'custom-pulcro-popup' // Por si luego quieres añadir CSS global
            });

            // Control de Eventos de Mouse 
            layer.on({
                mouseover: function (e) {
                    const l = e.target;
                    l.setStyle({
                        weight: 2.5,
                        color: '#334155',
                        fillOpacity: 0.8
                    });
                    
                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        l.bringToFront();
                    }

                    infoPanel.update(p);
                },
                mouseout: function (e) {
                    geojsonLayer.resetStyle(e.target);
                    infoPanel.update();
                }
            });
        }
    }

    let geojsonLayer;

    // 7. Carga de datos desde la API filtrada en Python
    fetch('/api/v1/map-data')
        .then(response => {
            if (!response.ok) throw new Error('Error al conectar con la API');
            return response.json();
        })
        .then(geojsonData => {
            if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
                console.warn("La API no devolvió features válidas.");
                return;
            }

            // Renderizar la capa geográfica con interacciones activas
            geojsonLayer = L.geoJSON(geojsonData, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);

            // Ajustar automáticamente la cámara en Ecuador
            const bounds = geojsonLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
        })
        .catch(error => {
            console.error('Error cargando el mapa predictivo:', error);
        });
});