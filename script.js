console.log("Initialize")
// define access token
mapboxgl.accessToken = "pk.eyJ1Ijoiamdvc2NpYWsiLCJhIjoiY2t3cG5vanB5MGVwMjJuczJrMXI4MzlsdSJ9.TS0iy75tU2Dam19zeMjv7Q"

// create map
const map = new mapboxgl.Map({
  container: "map", // container id
  //style: "mapbox://styles/examples/cjgioozof002u2sr5k7t14dim", // map style URL from Mapbox Studio
  style: 'mapbox://styles/mapbox/light-v11',
  center: [-73.991307, 40.721852], // NYC coordinates
  zoom: 13,
})

const dataLayers = [
    { id: 'totalpop', name: 'Total population', property: 'totalpop' },
    { id: 'poverty_status_inpoverty_pct', name: 'Percent in poverty (%)', property: 'poverty_status_inpoverty_pct' },
    { id: 'nh_white_pct', name: 'Percent white (%)', property: 'nh_white_pct'},
    {id: 'nh_black_pct', name: 'Percent Black (%)', property: 'nh_black_pct'},
    {id: 'hisp_pct', name: 'Percent Hispanic/Latino (%)', property: 'hisp_pct' }
];

function getColorScale(dataLayer) {
    const colorScales = {
        'totalpop': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'poverty_status_inpoverty_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_white_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_black_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'hisp_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20']
    };
    
    return colorScales[dataLayer] || colorScales["totalpop"];
}

// Value ranges for each data type
function getValueSteps(dataLayer) {
    const valueSteps = {
        'totalpop': [0, 10000, 15000, 20000, 25000],
        'poverty_status_inpoverty_pct': [0, 0.1, 0.2, 0.3, 0.4],
        'nh_white_pct': [0, 0.15, 0.4, 0.5, 0.6],
        'nh_black_pct': [0, 0.04, 0.08, 0.12, 0.18],
        'hisp_pct': [0, 0.1, 0.2, 0.3, 0.4],
    };
    
    return valueSteps[dataLayer] || valueSteps["totalpop"];
}

function addChoroplethLayer(id, name, property) {
    const colorScale = getColorScale(property);
    const steps = getValueSteps(property);
    console.log(id)
    map.addLayer({
        'id': id,
        'type': 'fill',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', property],
                steps[0], colorScale[0],
                steps[1], colorScale[1],
                steps[2], colorScale[2],
                steps[3], colorScale[3],
            ],
            'fill-opacity': 0.75,
            'fill-outline-color': '#000'
        }
    });

// Add hover effect with highlighting
    map.addLayer({
        'id': `${id}-hover`,
        'type': 'line',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'line-width':  
             ['case', ['boolean', ['feature-state','hover'], false], 3, 0]
        }
    });
}

function setupLayerToggles() {
    console.log('Update layer toggles')
    const toggleContainer = document.getElementById('layer-toggles');
    toggleContainer.innerHTML = '<h3 id="layer-title">Map Layers</h3>';
    
    dataLayers.forEach(layer => {
        console.log(layer.id)
        const toggle = document.createElement('div');
        toggle.className = 'toggle';
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = layer.id;
        // input.checked = layer.id === 'totalpop';
        
        input.addEventListener('change', (e) => {
            const visibility = e.target.checked ? 'visible' : 'none';
            map.setLayoutProperty(layer.id, 'visibility', visibility);
            map.setLayoutProperty(`${layer.id}-hover`, 'visibility', visibility);
            
            updateLegend();
        });
        
        const label = document.createElement('label');
        label.htmlFor = layer.id;
        label.textContent = layer.name;
        
        toggle.appendChild(input);
        toggle.appendChild(label);
        toggleContainer.appendChild(toggle);
    });
}

// Create and update the legend based on visible layers
function updateLegend() {
    console.log('Updating legend')
    const legend = document.getElementById('legend');
    legend.innerHTML = '<h3>Legend</h3>';
    
    // Find visible layers
    const visibleLayers = dataLayers
        .filter(layer => map.getLayoutProperty(layer.id, 'visibility') === 'visible');
    
    if (visibleLayers.length === 0) {
        const noLayersMsg = document.createElement('p');
        noLayersMsg.textContent = 'No layers selected';
        legend.appendChild(noLayersMsg);
        return;
    }
    
    // Create legend for each visible layer
    visibleLayers.forEach(layer => {
        const layerSection = document.createElement('div');
        layerSection.className = 'legend-section';
        
        const title = document.createElement('h4');
        title.textContent = layer.name;
        layerSection.appendChild(title);
        
        const colorScale = getColorScale(layer.property);
        const steps = getValueSteps(layer.property);
        
        for (let i = 0; i < colorScale.length - 1; i++) {
            console.log(colorScale[i])
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = colorScale[i];
            
            const label = document.createElement('span');
            if (layer.id=='totalpop') {
                label.textContent = `${steps[i].toLocaleString()} - ${steps[i+1].toLocaleString()}`;
            } else {
                label.textContent = `${(steps[i]*100).toLocaleString()}% - ${(steps[i+1]*100).toLocaleString()}%`;
            }
            
            item.appendChild(colorBox);
            item.appendChild(label);
            layerSection.appendChild(item);
        }
        
        // Add the highest range
        const lastItem = document.createElement('div');
        lastItem.className = 'legend-item';
        
        const lastColorBox = document.createElement('span');
        lastColorBox.className = 'color-box';
        lastColorBox.style.backgroundColor = colorScale[colorScale.length - 1];
        
        const lastLabel = document.createElement('span');
        if (layer.id=='totalpop') {
            lastLabel.textContent = `${steps[steps.length - 1].toLocaleString()}+`;
        } else {
            lastLabel.textContent = `${(steps[steps.length - 1]*100).toLocaleString()}%+`;
        }

        lastItem.appendChild(lastColorBox);
        lastItem.appendChild(lastLabel);
        layerSection.appendChild(lastItem);
        
        legend.appendChild(layerSection);
    });
}

// wait for map to load before adjusting it
map.on("load", () => {
  // make a pointer cursor
  map.getCanvas().style.cursor = "default"

  // add data
    map.addSource('cb3-data', {
        type: 'geojson',
        data: "data/acs_2023_mapbox.geojson"
    });

    map.addLayer({
        'id': "base-layer",
        'type': 'line',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'line-color': '#000',
            'line-width': 1,
        }
    });

    // add each layer
    dataLayers.forEach(layer => {
        addChoroplethLayer(layer.id, layer.name, layer.property);
    });

    // set up layer toggles
    setupLayerToggles();
    
    // add hover
    let hoveredFeatureId = null;

    map.on('mousemove', (e) => {
        // Find features at pointer
        const features = map.queryRenderedFeatures(e.point, {
            layers: dataLayers.map(layer => layer.id)
        });
        console.log(features)
       
        // Reset hover state
        if (hoveredFeatureId !== null) {
            map.setFeatureState(
                { source: 'cb3-data', id: hoveredFeatureId },
                { hover: false }
            );
        }
        
        // update hover state based on ID
        if (features.length == 1) {
            hoveredFeatureId = features[0].id;
            console.log(hoveredFeatureId)
            map.setFeatureState(
                { source: 'cb3-data', id: hoveredFeatureId },
                { hover: true}
            );

        } else {
            hoveredFeatureId = null;
        }
    });
    
    // Reset hover state when mouse leaves the map
    map.on('mouseout', () => {
        if (hoveredFeatureId !== null) {
            map.setFeatureState(
                { source: 'cb3-data', id: hoveredFeatureId },
                { hover: false }
            );
        }
        hoveredFeatureId = null;
    });
    // Add navigation controls to the map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
})
