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
    {id: 'totalpop_over75_pct', name: 'Total population over 75 (%)', property: 'totalpop_over75_pct'},
    { id: 'poverty_status_inpoverty_pct', name: 'Percent in poverty (%)', property: 'poverty_status_inpoverty_pct' },
    {id: 'inpoverty_75over_pct', name: 'In poverty, 75+ (%)', property: 'inpoverty_75over_pct'},
    { id: 'nh_white_pct', name: 'Percent white (%)', property: 'nh_white_pct'},
    {id: 'nh_black_pct', name: 'Percent Black (%)', property: 'nh_black_pct'},
    {id: 'nh_asian_pct', name: 'Percent Asian (%)', property: 'nh_asian_pct'},
    {id: 'nh_nhpi_pct', name: 'Percent NHPI (%)', property: 'nh_nhpi_pct'},
    {id: 'nh_aian_pct', name: 'Percent American Indian or Alaskan Native (%)', property: 'nh_aian_pct'},
    {id: 'nh_other_pct', name: 'Percent other race (%)', property: 'nh_other_pct'},
    {id: 'hisp_pct', name: 'Percent Hispanic/Latino (%)', property: 'hisp_pct'},
    {id: 'mean_income', name: 'Mean income', property: 'mean_income'},
    {id: 'total_foreign_pct', name: 'Total foreign born (%)', property: 'total_foreign_pct'},
    {id: 'renter_occ_pct', name: 'Renter occupied households (%)', property: 'renter_occ_pct'},
    {id: 'total_bachelorsgradproff_pct', name : "Bachelor's, Graduate, or Professional Degree (%)",
        property: 'total_bachelorsgradproff_pct'
    },
    {id: 'hh_gt65_pct', name: 'Households with at least one member over 65', property: 'hh_gt65_pct'}
];

function getColorScale(dataLayer) {
    const colorScales = {
        'totalpop': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'mean_income': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'poverty_status_inpoverty_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_white_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_black_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_asian_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_aian_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_nhpi_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'nh_other_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'hisp_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'totalpop_over75_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'total_foreign_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'inpoverty_75over_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'renter_occ_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'total_bachelorsgradproff_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'hh_gt65_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
    };
    
    return colorScales[dataLayer] || colorScales["nh_white_pct"];
}

// Value ranges for each data type
function getValueSteps(dataLayer) {
    const valueSteps = {
        'totalpop': [0, 10000, 15000, 20000, 25000],
        'mean_income': [0, 40000, 100000, 130000, 180000],
        'poverty_status_inpoverty_pct': [0, 0.1, 0.2, 0.3, 0.4],
        'nh_white_pct': [0, 0.15, 0.4, 0.5, 0.6],
        'nh_black_pct': [0, 0.04, 0.08, 0.12, 0.18],
        'nh_aian_pct': [0, 0.0001, 0.0002, 0.005, 0.001],
        'nh_asian_pct': [0, 0.2, 0.4, 0.6, 0.75],
        'nh_nhpi_pct': [0, 0.0001, 0.0002, 0.005, 0.001],
        'nh_other_pct': [0, 0.004, 0.008, 0.01, 0.014],
        'hisp_pct': [0, 0.1, 0.2, 0.3, 0.4],
        'totalpop_over75_pct': [0, 0.062, 0.095, 0.11, 0.14],
        'total_foreign_pct': [0, 0.2, 0.3, 0.5, 0.7],
        'inpoverty_75over_pct': [0, 0.015, 0.026, 0.04, 0.5],
        'renter_occ_pct': [0, 0.8, 0.85, 0.86, 0.9],
        'total_bachelorsgradproff_pct': [0, 0.2, 0.4, 0.5, 0.7],
        'hh_gt65_pct': [0, 0.24, 0.36, 0.41, 0.5],
    };
    
    return valueSteps[dataLayer] || valueSteps["nh_white_pct"];
}

function addChoroplethLayer(id, name, property) {
    const colorScale = getColorScale(property);
    const steps = getValueSteps(property);
    console.log(id)
    console.log(name)
    console.log(property)
    map.addLayer({
        'id': id,
        'type': 'fill',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': [
                'step',
                ['get', property],
                colorScale[0],           
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

function addTextLayer(id, name, property) {
    map.addLayer({
        'id': `${id}-text`,
        'type': 'symbol',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'none',
            'text-field': [
                'case',
                ['==', property, 'mean_income'],
                ['concat',
                    '$',
                    ['number-format', 
                        ['get', property],
                        {
                            'locale': 'en-US',
                            'max-fraction-digits': 0
                        }
                    ],
                ],
                
                // Second condition-output pair
                ['>', ['get', property], 1],
                ['concat',
                    ['number-format', 
                        ['get', property],
                        {'locale': 'en-US', 'max-fraction-digits': 0}
                    ]
                ],
                ['concat',
                    ['number-format', 
                        ['*', ['get', property], 100],
                        {'locale': 'en-US', 'max-fraction-digits': 1}
                    ],
                    '%'
                ]
            ],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 12,
            'text-anchor': 'center',
            'text-allow-overlap': false
        },
        'paint': {
            'text-color': '#000000',
        }
    });
}

function addEnvironmentalJusticeLayer() {
    map.addLayer({
        'id': 'ej-area',
        'type': 'fill',
        'source': 'ej-data',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': '#228B22', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#006400'
        },
    });
}

const dataSources = {
    '2018': "data/acs_2018_mapbox.geojson",
    '2023': "data/acs_2023_mapbox.geojson"
  };
  
  // Current active year
  let activeYear = '2023';
  
  // Function to switch between years
  function switchYear(year) {
    if (year === activeYear) return;
    
    // Update active year
    activeYear = year;
    console.log(activeYear)
    
    // Update button states
    document.getElementById('toggle-2018').classList.toggle('active', year === '2018');
    document.getElementById('toggle-2023').classList.toggle('active', year === '2023');
    
    const visibleLayer = dataLayers.find(layer => 
        map.getLayoutProperty(layer.id, 'visibility') === 'visible'
      );
      
    if (visibleLayer) {
        activeLayerId = visibleLayer.id;
    }

    // Update data source
    map.getSource('cb3-data').setData(dataSources[year]);
    
    dataLayers.forEach(layer => {
      map.setLayoutProperty(layer.id, 'visibility', 'none');
      map.setLayoutProperty(`${layer.id}-text`, 'visibility', 'none');
      map.setLayoutProperty(`${layer.id}-hover`, 'visibility', 'none');
    });

    if (activeLayerId) {
        map.setLayoutProperty(activeLayerId, 'visibility', 'visible');
        map.setLayoutProperty(`${activeLayerId}-text`, 'visibility', 'visible');
        map.setLayoutProperty(`${activeLayerId}-hover`, 'visibility', 'visible');
        
        // Also update the dropdown selection to match
        const layerDropdown = document.getElementById('layer-dropdown');
        if (layerDropdown) {
          for (let i = 0; i < layerDropdown.options.length; i++) {
            if (layerDropdown.options[i].value === activeLayerId) {
              layerDropdown.selectedIndex = i;
              break;
            }
          }
        }
      }

    
    // Update the legend
    updateLegend();
  }

function setupLayerToggles() {
    console.log('Update layer toggles')
    const toggleContainer = document.getElementById('layer-toggles');
    toggleContainer.innerHTML = '<h3 id="layer-title">Map Layers</h3>';
    
    const layerSelect = document.createElement('select');
    layerSelect.id = 'layer-dropdown';
    layerSelect.className = 'layer-dropdown';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a layer';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    layerSelect.appendChild(defaultOption);

    dataLayers.forEach(layer => {
        console.log(layer.id);
        const option = document.createElement('option');
        option.value = layer.id;
        option.textContent = layer.name;
        layerSelect.appendChild(option);

        // console.log(layer.id)
        // const toggle = document.createElement('div');
        // toggle.className = 'toggle';
        
        // const input = document.createElement('input');
        // input.type = 'checkbox';
        // input.id = layer.id;
        
    });
    layerSelect.addEventListener('change', (e) => {

        // First, hide all layers
        dataLayers.forEach(layer => {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
            map.setLayoutProperty(`${layer.id}-text`, 'visibility', 'none');
            map.setLayoutProperty(`${layer.id}-hover`, 'visibility', 'none');
        });
        
        // Show only the selected layer
        const selectedLayerId = e.target.value;
        if (selectedLayerId) {
            map.setLayoutProperty(selectedLayerId, 'visibility', 'visible');
            map.setLayoutProperty(`${selectedLayerId}-text`, 'visibility', 'visible');
            map.setLayoutProperty(`${selectedLayerId}-hover`, 'visibility', 'visible');
        }
        
        updateLegend();
    });
    
    toggleContainer.appendChild(layerSelect);

    // Add spacing
    const spacer = document.createElement('div');
    spacer.style.height = '20px';
    toggleContainer.appendChild(spacer);
    
    // Add environmental justice checkbox
    const ejToggleContainer = document.createElement('div');
    ejToggleContainer.className = 'toggle';
    
    const ejCheckbox = document.createElement('input');
    ejCheckbox.type = 'checkbox';
    ejCheckbox.id = 'ej-toggle';
    
    const ejLabel = document.createElement('label');
    ejLabel.htmlFor = 'ej-toggle';
    ejLabel.textContent = 'Environmental Justice Area';
    ejLabel.style.color = 'white';
    ejLabel.style.marginLeft = '8px';
    
    ejCheckbox.addEventListener('change', function() {
        const visibility = this.checked ? 'visible' : 'none';
        map.setLayoutProperty('ej-area', 'visibility', visibility);
    });
    
    ejToggleContainer.appendChild(ejCheckbox);
    ejToggleContainer.appendChild(ejLabel);
    toggleContainer.appendChild(ejToggleContainer);
}

// Create and update the legend based on visible layers
function updateLegend() {
    console.log('Updating legend')
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    
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
            console.log(i)
            const item = document.createElement('div');
            item.className = 'legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = colorScale[i];
            
            const label = document.createElement('span');
            if (layer.id=='totalpop'|layer.id=='mean_income') {
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
        lastColorBox.style.backgroundColor = colorScale[colorScale.length-1];
        
        const lastLabel = document.createElement('span');
        console.log(layer.id)
        if (layer.id=='totalpop'|layer.id=='mean_income') {
            lastLabel.textContent = `${steps[steps.length - 2].toLocaleString()}+`;
        } else {
            lastLabel.textContent = `${(steps[steps.length - 2]*100).toLocaleString()}%+`;
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
        data: dataSources[activeYear]
    });

    map.addSource('ej-data', {
        type: 'geojson',
        data: "data/dac_area.geojson"
    })

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
    addEnvironmentalJusticeLayer();
    dataLayers.forEach(layer => {
        addTextLayer(layer.id, layer.name, layer.property);
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

    document.getElementById('toggle-2018').addEventListener('click', function() {
        switchYear('2018');
    });
      
    document.getElementById('toggle-2023').addEventListener('click', function() {
    switchYear('2023');
    });
})
