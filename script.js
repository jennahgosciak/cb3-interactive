console.log("Initialize")
// define access token for mapboxgl
mapboxgl.accessToken = "pk.eyJ1Ijoiamdvc2NpYWsiLCJhIjoiY2t3cG5vanB5MGVwMjJuczJrMXI4MzlsdSJ9.TS0iy75tU2Dam19zeMjv7Q"

// init/create popup
const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
});

let hoveredFeatureId = null;
let currentHoveredLayer = null;
let currentHoveredFeature = null;

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
    { id: 'poverty_status_inpoverty_pct', name: 'In poverty (%)', property: 'poverty_status_inpoverty_pct' },
    {id: 'inpoverty_75over_pct', name: 'In poverty, 75+ (%)', property: 'inpoverty_75over_pct'},
    { id: 'nh_white_pct', name: 'White population (%)', property: 'nh_white_pct'},
    {id: 'nh_black_pct', name: 'Black population (%)', property: 'nh_black_pct'},
    {id: 'nh_asian_pct', name: 'Asian population (%)', property: 'nh_asian_pct'},
    {id: 'nh_nhpi_pct', name: 'NHPI population (%)', property: 'nh_nhpi_pct'},
    {id: 'nh_aian_pct', name: 'American Indian or Alaskan Native population (%)', property: 'nh_aian_pct'},
    {id: 'nh_other_pct', name: 'Other race population (%)', property: 'nh_other_pct'},
    {id: 'hisp_pct', name: 'Hispanic/Latino population (%)', property: 'hisp_pct'},
    {id: 'mean_income', name: 'Mean income', property: 'mean_income'},
    {id: 'total_foreign_pct', name: 'Total foreign born (%)', property: 'total_foreign_pct'},
    {id: 'renter_occ_pct', name: 'Renter occupied households (%)', property: 'renter_occ_pct'},
    {id: 'total_bachelorsgradproff_pct', name : "Bachelor's, Graduate, or Professional Degree (%)",
        property: 'total_bachelorsgradproff_pct'
    },
    {id: 'hh_gt65_pct', name: 'Households with at least one member over 65', property: 'hh_gt65_pct'},
    {id: 'hh_lt18_pct', name: 'Households with at least one member under 18', property: 'hh_lt18_pct'},
    {id: 'number_of_persons_injured', name: 'Monthly average injured in motor vehicle collisons YTD', property: 'number_of_persons_injured'},
    {id: 'number_of_persons_killed', name: 'Monthly average killed in motor vehicle collisons YTD', property: 'number_of_persons_killed'}
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
        'hh_lt18_pct': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'number_of_persons_injured': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
        'number_of_persons_killed': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20']
    };
    
    return colorScales[dataLayer] || colorScales["nh_white_pct"];
}

// set value ranges for each data type
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
        'hh_lt18_pct': [0, 0.07, 0.15, 0.2, 0.5],
        'number_of_persons_injured': [0, 2, 4, 6, 9],
        'number_of_persons_killed': [0, 0.1, 0.2, 0.3, 1]
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

    // add hover effect
    map.addLayer({
        'id': `${id}-hover`,
        'type': 'line',
        'source': 'cb3-data',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'line-color': '#484848',  // Bright red
            'line-width': ['case', ['boolean', ['feature-state','hover'], false], 3, 0],
            'line-opacity': 1
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
                ['in', property, ['literal', ['number_of_persons_injured', 'number_of_persons_killed']]],
                ['concat',
                    ['number-format', 
                        ['to-number', ['get', property]],
                        {
                            'locale': 'en-US',
                            'min-fraction-digits': 1,
                            'max-fraction-digits': 1
                        }
                    ]
                ],
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

function addNYCHALayer() {
    console.log('adding nycha')
    map.addLayer({
        'id': 'nycha-data',
        'type': 'fill',
        'source': 'nycha',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': '#8C2232', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#006400'
        },
    });
}

function addSec8Layer() {
    map.addLayer({
        'id': 'sec8-data',
        'type': 'fill',
        'source': 'sec8',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': '#807BA1', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#006400'
        },
    });
}

function addMLLayer() {
    map.addLayer({
        'id': 'ml-data',
        'type': 'fill',
        'source': 'ml',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': '#807BA1', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#006400'
        },
    });
}

function addParksLayer() {
    map.addLayer({
        'id': 'parks-data',
        'type': 'fill',
        'source': 'parks',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-color': '#8CC75F', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#006400'
        },
    });
}

const dataSources = {
    '2013': "data/acs_2013_mapbox.geojson",
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
    document.getElementById('toggle-2013').classList.toggle('active', year === '2013');
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
        console.log('updating hover')
        map.setLayoutProperty(activeLayerId, 'visibility', 'visible');
        map.setLayoutProperty(`${activeLayerId}-hover`, 'visibility', 'visible');
        map.setLayoutProperty(`${activeLayerId}-text`, 'visibility', 'visible');
        
        // update the dropdown selection to match
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

    
    // legend update
    updateLegend();
  }

function setupLayerToggles() {
    console.log('Update layer toggles')
    const toggleContainer = document.getElementById('layer-toggles');
    toggleContainer.innerHTML = '<h3 id="layer-title">Map Layers</h3>';
    
    const layerSelect = document.createElement('select');
    layerSelect.id = 'layer-dropdown';
    layerSelect.className = 'layer-dropdown';

    // additional css styles
    layerSelect.style.width = '100%';             // Make dropdown full width of container
    layerSelect.style.maxWidth = '250px';         // Set maximum width
    layerSelect.style.overflow = 'hidden';        // Hide overflow
    layerSelect.style.textOverflow = 'ellipsis';  // Add ellipsis for text that's too long
    layerSelect.style.fontSize = '14px';          // Reduce font size from default


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
    });
    layerSelect.addEventListener('change', (e) => {

        // hide all layers
        dataLayers.forEach(layer => {
            map.setLayoutProperty(layer.id, 'visibility', 'none');
            map.setLayoutProperty(`${layer.id}-text`, 'visibility', 'none');
            map.setLayoutProperty(`${layer.id}-hover`, 'visibility', 'none');
        });
        
        // show only the selected layer
        const selectedLayerId = e.target.value;
        if (selectedLayerId) {
            map.setLayoutProperty(selectedLayerId, 'visibility', 'visible');
            map.setLayoutProperty(`${selectedLayerId}-hover`, 'visibility', 'visible');
            map.setLayoutProperty(`${selectedLayerId}-text`, 'visibility', 'visible');
        }
        
        updateLegend();
    });
    
    toggleContainer.appendChild(layerSelect);

    const spacer = document.createElement('div');
    spacer.style.height = '20px';
    toggleContainer.appendChild(spacer);
    
    // additional layers to toggle on vs. off
    const additionalLayers = [
        { id: 'ej', label: 'Environmental Justice Area', layers: ['ej-area'] },
        { id: 'parks', label: 'Parks', layers: ['parks-data'] },
        { id: 'nycha', label: 'NYCHA Housing', layers: ['nycha-data'] },
        { id: 'sec8', label: 'Section 8 Housing', layers: ['sec8-data'] },
        { id: 'ml', label: 'Mitchell-Lama Housing', layers: ['ml-data'] }
    ];

    additionalLayers.forEach(layerInfo => {
        const toggleContainer = document.createElement('div');
        toggleContainer.className = 'toggle';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${layerInfo.id}-toggle`;
        
        const label = document.createElement('label');
        label.htmlFor = `${layerInfo.id}-toggle`;
        label.textContent = layerInfo.label;
        label.style.color = 'white';
        label.style.marginLeft = '8px';
        
        checkbox.addEventListener('change', function() {
            const visibility = this.checked ? 'visible' : 'none';
            
            // Set visibility for associated layers
            layerInfo.layers.forEach(layer => {
                map.setLayoutProperty(layer, 'visibility', visibility);
            });
        });
        
        toggleContainer.appendChild(checkbox);
        toggleContainer.appendChild(label);
        document.getElementById('layer-toggles').appendChild(toggleContainer);
    });
}

// update legend based on visible layers
function updateLegend() {
    console.log('Updating legend')
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    
    // visible layers
    const visibleLayers = dataLayers
        .filter(layer => map.getLayoutProperty(layer.id, 'visibility') === 'visible');
    
    if (visibleLayers.length === 0) {
        const noLayersMsg = document.createElement('p');
        noLayersMsg.textContent = 'No layers selected';
        legend.appendChild(noLayersMsg);
        return;
    }
    
    // legend for each visible layer
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
            if (layer.id=='totalpop'|layer.id=='mean_income'|layer.id=='number_of_persons_injured'|layer.id=='number_of_persons_killed') {
                label.textContent = `${steps[i].toLocaleString()} - ${steps[i+1].toLocaleString()}`;
            } else {
                label.textContent = `${(steps[i]*100).toLocaleString()}% - ${(steps[i+1]*100).toLocaleString()}%`;
            }
            
            item.appendChild(colorBox);
            item.appendChild(label);
            layerSection.appendChild(item);
        }
        
        // add last legend item
        const lastItem = document.createElement('div');
        lastItem.className = 'legend-item';
        
        const lastColorBox = document.createElement('span');
        lastColorBox.className = 'color-box';
        lastColorBox.style.backgroundColor = colorScale[colorScale.length-1];
        
        const lastLabel = document.createElement('span');
        console.log(layer.id)
        if (layer.id=='totalpop'|layer.id=='mean_income'|layer.id=='number_of_persons_injured'|layer.id=='number_of_persons_killed') {
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

    console.log("Loaded map")
  // make a pointer cursor
  map.getCanvas().style.cursor = "default"

  // add data
    map.addSource('cb3-data', {
        type: 'geojson',
        data: dataSources[activeYear],
        promoteId: 'sectors' 
    });

    map.addSource('ej-data', {
        type: 'geojson',
        data: "data/dac_area.geojson"
    })

    map.addSource('parks', {
        type: 'geojson',
        data: "data/parks.geojson"
    })

    map.addSource('nycha', {
        type: 'geojson',
        data: "data/nycha.geojson"
    })

    map.addSource('sec8', {
        type: 'geojson',
        data: "data/sec8.geojson"
    })

    map.addSource('ml', {
        type: 'geojson',
        data: "data/ml.geojson"
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
    addParksLayer();
    addNYCHALayer();
    addSec8Layer();
    addMLLayer();
    dataLayers.forEach(layer => {
        addTextLayer(layer.id, layer.name, layer.property);
    });

    // set up layer toggles
    setupLayerToggles();

    map.on('mousemove', (e) => {
        const visibleLayers = dataLayers.filter(layer => 
            map.getLayoutProperty(layer.id, 'visibility') === 'visible'
        );

        // check for visibility of additional layers
        const additionalVisibleLayers = [];
        const additionalLayerIds = ['ml-data', 'sec8-data', 'nycha-data', 'parks-data', 'ej-area'];
        
        additionalLayerIds.forEach(layerId => {
            if (map.getLayoutProperty(layerId, 'visibility') === 'visible') {
                additionalVisibleLayers.push(layerId);
            }
        });

        // query all visible layers
        const allVisibleLayers = [...additionalVisibleLayers, ...visibleLayers.map(layer => layer.id)];
        const features = map.queryRenderedFeatures(e.point, {
            layers: allVisibleLayers
        });

        let newHoveredFeature = null;
        let newHoveredLayer = null;
        let popupContent = '';

        if (features.length > 0) {
            const feature = features[0];
            const layerId = feature.layer.id;
            
            if (additionalLayerIds.includes(layerId)) {
                newHoveredLayer = 'additional';
                newHoveredFeature = `${layerId}-${feature.id || 0}`;
                
                const properties = feature.properties;
                
                switch(layerId) {
                    case 'ml-data':
                        popupContent = `
                            <div class="popup-content">
                                <h4>Mitchell-Lama Housing</h4>
                                <p><strong>Address:</strong> ${properties.Address || 'N/A'}</p>
                                <p><strong>Owner:</strong> ${properties.OwnerName || 'N/A'}</p>
                            </div>
                        `;
                        break;
                        
                    case 'sec8-data':
                        popupContent = `
                            <div class="popup-content">
                                <h4>Section 8 Housing</h4>
                                <p><strong>Address:</strong> ${properties.Address || 'N/A'}</p>
                                <p><strong>Owner:</strong> ${properties.OwnerName || 'N/A'}</p>
                            </div>
                        `;
                        break;
                        
                    case 'nycha-data':
                        popupContent = `
                            <div class="popup-content">
                                <h4>NYCHA Housing</h4>
                                <p><strong>Development Name:</strong> ${properties.development|| 'N/A'}</p>
                                <p><strong>Address:</strong> ${properties.Address || 'N/A'}</p>
                                <p><strong>Owner:</strong> ${properties.OwnerName || 'N/A'}</p>
                            </div>
                        `;
                        break;
                }
            } 
            // check for data layers
            else if (visibleLayers.length > 0) {
                newHoveredLayer = 'main';
                newHoveredFeature = feature.properties.sectors;
                
                if (newHoveredFeature !== null && newHoveredFeature !== undefined) {
                    const activeLayer = visibleLayers[0];
                    const properties = feature.properties;
                    
                    // Format value based on property type
                    let value;
                    let pctDiff_col;
                    let pctDiff_value;
                    let pctChange_col;
                    let pctChange_value;
                    let number_col;
                    let number_value;
                    
                    if (activeLayer.property === 'number_of_persons_injured' || activeLayer.property === 'number_of_persons_killed') {
                        number_col = activeLayer.property;
                        number_value = properties[number_col].toLocaleString();
                        value = number_value;
                    } else if (activeLayer.property === 'mean_income' || activeLayer.property === 'totalpop') {
                        value = Number(properties[activeLayer.property]).toLocaleString();
                        if (activeLayer.property === 'mean_income') {
                            value = '$' + value;
                        }
                        pctChange_col = activeLayer.property + '_pct_change'; 
                        pctChange_value = (Number(properties[pctChange_col]) * 100).toFixed(1) + '%';
                    } else {
                        value = (Number(properties[activeLayer.property]) * 100).toFixed(1) + '%';
                        pctDiff_col = activeLayer.property + '_diff'; 
                        pctDiff_value = (Number(properties[pctDiff_col]) * 100).toFixed(1) + '%';
                        pctChange_col = activeLayer.property + '_change';
                        pctChange_value = (Number(properties[pctChange_col]) * 100).toFixed(1) + '%';
                        number_col = activeLayer.property.replace('_pct', '');
                        number_value = properties[number_col].toLocaleString();
                        value = number_value + '\n(' + value + ')';
                    }
                    
                    popupContent = `
                        <div class="popup-content">
                            <h4>Sector: ${properties.sectors}</h4>
                            <p><strong>${activeLayer.name}:</strong> ${value}</p>
                    `;

                    // Add conditional content
                    if (activeLayer.property === 'number_of_persons_injured' || activeLayer.property === 'number_of_persons_killed') {
                        // No additional info for these
                    } else if (activeYear == '2023' && (activeLayer.property === 'mean_income' || activeLayer.property === 'totalpop')) {
                        popupContent += `<p class="year-specific-info">Percent change from 2014-2018: ${pctChange_value}</p>`;
                    } else if (activeYear == '2023') {
                        popupContent += `
                            <p class="year-specific-info">Percent change from 2014-2018: ${pctChange_value}</p>
                            <p class="year-specific-info">Percentage point difference from 2014-2018: ${pctDiff_value}</p>
                        `;
                    } else if (activeYear == '2018' && (activeLayer.property === 'mean_income' || activeLayer.property === 'totalpop')) {
                        popupContent += `<p class="year-specific-info">Percent change from 2009-2013: ${pctChange_value}</p>`;
                    } else if (activeYear == '2018') {
                        popupContent += `
                            <p class="year-specific-info">Percent change from 2009-2013: ${pctChange_value}</p>
                            <p class="year-specific-info">Percentage point difference from 2009-2013: ${pctDiff_value}</p>
                        `;
                    }
                    
                    popupContent += `</div>`;
                }
            }
        }

        // Only update if something actually changed
        const featureChanged = newHoveredFeature !== currentHoveredFeature;
        const layerChanged = newHoveredLayer !== currentHoveredLayer;
        
        if (featureChanged || layerChanged) {
            // Reset previous hover state only if it was a main layer feature
            if (currentHoveredLayer === 'main' && hoveredFeatureId !== null) {
                map.setFeatureState(
                    { source: 'cb3-data', id: hoveredFeatureId },
                    { hover: false }
                );
                hoveredFeatureId = null;
            }

            // Set new hover state
            if (newHoveredLayer === 'main' && newHoveredFeature !== null) {
                hoveredFeatureId = newHoveredFeature;
                map.setFeatureState(
                    { source: 'cb3-data', id: hoveredFeatureId },
                    { hover: true }
                );
            }

            // Update popup
            if (newHoveredFeature !== null && popupContent !== '') {
                popup.setLngLat(e.lngLat).setHTML(popupContent);
                if (!popup._map) {
                    popup.addTo(map);
                }
            } else {
                popup.remove();
            }

            // Update tracking variables
            currentHoveredFeature = newHoveredFeature;
            currentHoveredLayer = newHoveredLayer;
        } else if (newHoveredFeature !== null) {
            // Same feature, just update popup position
            popup.setLngLat(e.lngLat);
        }
    });

    // Add mouseleave handler for cleaner exit behavior
    map.on('mouseleave', () => {
        if (currentHoveredLayer === 'main' && hoveredFeatureId !== null) {
            map.setFeatureState(
                { source: 'cb3-data', id: hoveredFeatureId },
                { hover: false }
            );
            hoveredFeatureId = null;
        }
        
        popup.remove();
        currentHoveredFeature = null;
        currentHoveredLayer = null;
    });

    // Add navigation controls to the map
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    document.getElementById('toggle-2013').addEventListener('click', function() {
        switchYear('2013');
    });
    
    document.getElementById('toggle-2018').addEventListener('click', function() {
        switchYear('2018');
    });
      
    document.getElementById('toggle-2023').addEventListener('click', function() {
    switchYear('2023');
    });
})
