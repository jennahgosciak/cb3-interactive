console.log("Initialize")
// define access token for mapboxgl
mapboxgl.accessToken = "pk.eyJ1Ijoiamdvc2NpYWsiLCJhIjoiY2t3cG5vanB5MGVwMjJuczJrMXI4MzlsdSJ9.TS0iy75tU2Dam19zeMjv7Q"

let currentYear = 2024;
let currentMonth = 12;
let allCrashData = null; // Will store all crash data
let filteredCrashData = null; // Will store filtered crash data for current date

// Generate array of year/month combinations for the slider
function generateDateRange() {
    const dates = [];
    const startYear = 2023;
    const startMonth = 1;
    const endYear = 2025;
    const endMonth = 5;
    
    for (let year = startYear; year <= endYear; year++) {
        const monthStart = (year === startYear) ? startMonth : 1;
        const monthEnd = (year === endYear) ? endMonth : 12;
        
        for (let month = monthStart; month <= monthEnd; month++) {
            dates.push({ year, month });
        }
    }
    
    return dates;
}

// Function to format date for display
function formatDateDisplay(year, month) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${monthNames[month - 1]} ${year}`;
}

// Function to create the year/month slider
function createCrashDateSlider() {
    console.log("creating crash date slider")
    const controlsContainer = document.getElementById('layer-toggles');
    
    // Create slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    sliderContainer.style.marginTop = '20px';
    sliderContainer.style.padding = '10px';
    sliderContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
    
    // Title
    const sliderTitle = document.createElement('h4');
    sliderTitle.textContent = 'Motor Vehicle Crashes';
    sliderTitle.style.color = 'white';
    sliderTitle.style.margin = '0 0 10px 0';
    sliderContainer.appendChild(sliderTitle);
    
    // Generate date range
    const dateRange = generateDateRange();
    
    // Slider
    const slider = document.createElement('input');
    // slider.type = 'range';
    // slider.id = 'date-slider';
    // slider.style.background = 'white';
    // slider.min = '0';
    // slider.max = (dateRange.length - 1).toString();
    // slider.value = (dateRange.length - 1).toString(); // Default to latest date
    // slider.step = '1';
    // slider.style.width = '100%';
    // slider.style.marginBottom = '10px';

    slider.type = 'range';
    slider.id = 'date-slider';
    slider.min = '0';
    slider.max = (dateRange.length - 1).toString();
    slider.value = (dateRange.length - 1).toString(); // Default to latest date
    slider.step = '1';
    slider.style.width = '100%';
    slider.style.marginBottom = '10px';

    // Simple white styling with no gradients or shading
    slider.style.background = 'gray';
    slider.style.webkitAppearance = 'none';
    slider.style.appearance = 'none';
    slider.style.height = '6px';
    slider.style.borderRadius = '3px';
    slider.style.outline = 'none';

    // Style the thumb (handle)
    slider.style.setProperty('--thumb-color', 'white');
    const thumbStyle = `
        #${slider.id}::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid #999;
            cursor: pointer;
        }
        #${slider.id}::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: white;
            border: 2px solid #999;
            cursor: pointer;
            -moz-appearance: none;
        }
    `;

    // Add the thumb styling
    const style = document.createElement('style');
    style.textContent = thumbStyle;
    document.head.appendChild(style);
    
    // Value display
    const valueDisplay = document.createElement('div');
    valueDisplay.id = 'date-slider-value';
    valueDisplay.style.color = 'white';
    valueDisplay.style.fontSize = '12px';
    valueDisplay.style.textAlign = 'center';
    valueDisplay.style.fontWeight = 'bold';
    
    // Crash count display
    const crashCountDisplay = document.createElement('div');
    crashCountDisplay.id = 'crash-count-display';
    crashCountDisplay.style.color='white';
    // crashCountDisplay.style.color = '#000';
    // crashCountDisplay.style.fontSize = '11px';
    // crashCountDisplay.style.textAlign = 'center';
    // crashCountDisplay.style.marginTop = '5px';
    
    // Initialize display
    const initialDate = dateRange[dateRange.length - 1];
    currentYear = initialDate.year;
    currentMonth = initialDate.month;
    valueDisplay.textContent = formatDateDisplay(currentYear, currentMonth);
    
    // Date range labels
    const rangeLabels = document.createElement('div');
    rangeLabels.style.display = 'flex';
    rangeLabels.style.justifyContent = 'space-between';
    rangeLabels.style.fontSize = '10px';
    rangeLabels.style.color = '#ccc';
    rangeLabels.style.marginTop = '5px';
    
    const startLabel = document.createElement('span');
    startLabel.textContent = formatDateDisplay(dateRange[0].year, dateRange[0].month);
    
    const endLabel = document.createElement('span');
    endLabel.textContent = formatDateDisplay(dateRange[dateRange.length - 1].year, dateRange[dateRange.length - 1].month);
    
    rangeLabels.appendChild(startLabel);
    rangeLabels.appendChild(endLabel);
    
    // Slider event listener
    slider.addEventListener('input', function() {
        const dateIndex = parseInt(this.value);
        const selectedDate = dateRange[dateIndex];
        currentYear = selectedDate.year;
        currentMonth = selectedDate.month;
        
        valueDisplay.textContent = formatDateDisplay(currentYear, currentMonth);
        
        // Filter and update crash data for new date
        filterCrashDataForDate(currentYear, currentMonth);
    });
    
    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);
    sliderContainer.appendChild(crashCountDisplay);
    sliderContainer.appendChild(rangeLabels);
    controlsContainer.appendChild(sliderContainer);
}

// Function to filter crash data by date
function filterCrashDataForDate(year, month) {
    if (!allCrashData) return;
    
    const filteredFeatures = allCrashData.features.filter(feature => {
        const props = feature.properties;
        return props.crash_year === year && props.crash_month === month;
    });
    
    filteredCrashData = {
        type: 'FeatureCollection',
        features: filteredFeatures
    };
    
    // Update map source
    if (map.getSource('intersection-crashes')) {
        map.getSource('intersection-crashes').setData(filteredCrashData);
    }
}

async function addIntersectionCrashLayer() {
    try {
        // Load crash data from GeoJSON file
        allCrashData = await loadCrashDataFromFile();
        
        // Initialize with current date filter
        filterCrashDataForDate(currentYear, currentMonth);
        
        map.addSource('intersection-crashes', {
            type: 'geojson',
            data: filteredCrashData || {
                type: 'FeatureCollection',
                features: []
            }
        });
    } catch (error) {
        console.error('Error loading crash data:', error);
        // Fallback to empty dataset
        map.addSource('intersection-crashes', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });
    }

    // Add points for individual crashes
    // map.addLayer({
    //     'id': 'crash-points',
    //     'type': 'circle',
    //     'source': 'intersection-crashes',
    //     'layout': {
    //         'visibility': 'none'
    //     },
    //     'paint': {
    //         'circle-radius': [
    //             'case',
    //             ['==', ['get', 'severity'], 'number_of_persons_killed'], 8,
    //             ['==', ['get', 'severity'], 'number_of_persons_injured'], 5,
    //         ],
    //         'circle-color': [
    //             'case',
    //             ['==', ['get', 'severity'], 'number_of_persons_killed'], '#800026',
    //             ['==', ['get', 'severity'], 'number_of_persons_injured'], '#f03b20',
    //         ],
    //         'circle-opacity': 0.8,
    //         'circle-stroke-color': '#000',
    //         'circle-stroke-width': 1
    //     }
    // });

    // Add clustered view for better performance with many points
    map.addLayer({
        'id': 'crash-clusters',
        'type': 'circle',
        'source': 'intersection-crashes',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'circle-radius': [
                'step',
                ['get', 'collision_count'],
                6,  // Default size
                1, 5,   // 1+ crashes
                2, 8,  // 2+ crashes
                3, 10,   // 3+ crashes
                4, 15,   // 4+ crashes
                5, 20,   // 5+ crashes
            ],
            'circle-color': [
                'step',
                ['get', 'collision_count'],
                '#fecc5c',
                1, '#fd8d3c',
                3, '#f03b20',
                5, '#bd0026'
            ],
            'circle-opacity': 0.5
        },
        'filter': ['has', 'collision_count']
    });

    // Add cluster count labels
    map.addLayer({
        'id': 'crash-cluster-count',
        'type': 'symbol',
        'source': 'intersection-crashes',
        'layout': {
            'visibility': 'none',
            'text-field': '{collision_count}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 9,
            'text-anchor': 'center'
        },
        'paint': {
            'text-color': '#000',
        },
        'filter': ['has', 'collision_count']
    });
}

// Function to load crash data from GeoJSON file
async function loadCrashDataFromFile() {
    try {
        console.log("loading crash data")
        const response = await fetch('data/motor_vehicle_collisions.geojson');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate that it's proper GeoJSON
        if (!data.type || data.type !== 'FeatureCollection' || !data.features) {
            throw new Error('Invalid GeoJSON format');
        }
        
        // Validate that features have required properties
        const requiredProperties = ['crash_year', 'crash_month'];
        const validFeatures = data.features.filter(feature => {
            const props = feature.properties;
            return requiredProperties.every(prop => props && props[prop] !== undefined && props[prop] !== null);
        });
        
        if (validFeatures.length === 0) {
            console.warn('No valid crash features found in data');
        }
        
        console.log(`Loaded ${validFeatures.length} crash records from GeoJSON file`);
        
        return {
            type: 'FeatureCollection',
            features: validFeatures
        };
        
    } catch (error) {
        console.error('Failed to load crash data:', error);
        throw error;
    }
}

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
    {id: 'collision_count', name: 'Motor vehicle collisions (monthly average 2023-present)', property: 'collision_count'},
    {id: 'number_of_persons_injured', name: 'Nunber injured in motor vehicle collisons (monthly average 2023-present)', property: 'number_of_persons_injured'},
    {id: 'number_of_persons_killed', name: 'Nunber killed in motor vehicle collisons (monthly average 2023-present)', property: 'number_of_persons_killed'}
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
        'collision_count': ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20'],
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
        'collision_count': [6, 8, 9, 10, 12],
        'number_of_persons_injured': [0, 4, 5, 6, 9],
        'number_of_persons_killed': [0, 0.025, 0.05, 0.1, 0.2]
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
                ['in', property, ['literal', ['collision_count',
                    'number_of_persons_injured', 'number_of_persons_killed']]],
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
            'fill-outline-color': '#8C2232'
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
            'fill-color': '#39BA90', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#39BA90'
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
            'fill-color': '#D64692', 
            'fill-opacity': 0.8,
            'fill-outline-color': '#D64692'
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
            'fill-outline-color': '#8CC75F'
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
        { id: 'ml', label: 'Mitchell-Lama Housing', layers: ['ml-data'] },
        { id: 'crashes', label: 'Motor Vehicle Crashes', layers: ['crash-clusters', 'crash-cluster-count'] }
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

    // Add the crash date slider
    createCrashDateSlider();
}

function handleCrashHover(features, e) {
    console.log('adding hover feature')
    const crashFeature = features.find(f => 
        f.layer.id === 'crash-clusters'
    );
    
    console.log(features)
    if (crashFeature) {
        const properties = crashFeature.properties;
        
        if (properties.collision_count) {
            // This is a cluster
            return `
                <div class="popup-content">
                    <h4>Motor Vehicle Crashes</h4>
                    <p><strong>Number of crashes:</strong> ${properties.collision_count}</p> 
                    <p><strong>Injured:</strong> ${properties.number_of_persons_injured}</p> 
                    <p><strong>Fatalities:</strong> ${properties.number_of_persons_killed}</p>
                </div>
            `;
        } else {
            // Individual crash
            return `
                <div class="popup-content">
                    <h4>Motor Vehicle Crash</h4>
                    ${properties.number_of_persons_injured > 0 > 0 ? `<p><strong>Injured:</strong> ${properties.number_of_persons_injured}</p>` : ''}
                    ${properties.number_of_persons_killed > 0 ? `<p><strong>Fatalities:</strong> ${properties.number_of_persons_killed}</p>` : ''}
                </div>
            `;
        }
    }
    
    return null;
}

// Add legend for crash data
function createCrashLegend() {
    console.log("Crash legend")
    const legend = document.getElementById('legend');
    
    // Check if crash layer is visible
    const crashVisible = map.getLayoutProperty('crash-clusters', 'visibility') === 'visible';
    
    if (crashVisible) {
        const crashSection = document.createElement('div');
        crashSection.className = 'legend-section';
        crashSection.id = 'crash-legend';
        
        const title = document.createElement('h4');
        title.textContent = `Intersection Crashes - ${formatDateDisplay(currentYear, currentMonth)}`;
        crashSection.appendChild(title);
        
        const legendItems = [
            { color: '#f03b20', label: 'Injuries', size: '10px' },
            { color: '#800026', label: 'Fatalities', size: '16px' }
        ];
        
        legendItems.forEach(item => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            
            const colorBox = document.createElement('span');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = item.color;
            colorBox.style.borderRadius = '50%';
            colorBox.style.width = item.size;
            colorBox.style.height = item.size;
            colorBox.style.border = '1px solid #000';
            
            const label = document.createElement('span');
            label.textContent = item.label;
            
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            crashSection.appendChild(legendItem);
        });
        
        legend.appendChild(crashSection);
    }
}

// update legend based on visible layers
function updateLegend() {
    console.log('Updating legend')
    const legend = document.getElementById('legend');
    legend.innerHTML = '';
    
    // visible layers
    const visibleLayers = dataLayers
        .filter(layer => map.getLayoutProperty(layer.id, 'visibility') === 'visible');
    
    if (visibleLayers.length === 0 && !crashVisible) {
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
            if (layer.id=='totalpop'|layer.id=='mean_income'|layer.id=='collision_count'|layer.id=='number_of_persons_injured'|layer.id=='number_of_persons_killed') {
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
        if (layer.id=='totalpop'|layer.id=='mean_income'|layer.id=='collision_count'|layer.id=='number_of_persons_injured'|layer.id=='number_of_persons_killed') {
            lastLabel.textContent = `${steps[steps.length - 2].toLocaleString()}+`;
        } else {
            lastLabel.textContent = `${(steps[steps.length - 2]*100).toLocaleString()}%+`;
        }

        lastItem.appendChild(lastColorBox);
        lastItem.appendChild(lastLabel);
        layerSection.appendChild(lastItem);
        
        legend.appendChild(layerSection);
    });

    //createCrashLegend();
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
    console.log("adding crash data")
    addIntersectionCrashLayer();
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
        const additionalLayerIds = ['ml-data', 'sec8-data', 'nycha-data', 'parks-data', 'ej-area', 'crash-clusters'];
        
        additionalLayerIds.forEach(layerId => {
            console.log(layerId)
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
                                <p><strong>Building Name:</strong> ${properties.name|| 'N/A'}</p>
                                <p><strong>Address:</strong> ${properties.Address || 'N/A'}</p>
                                <p><strong>Owner:</strong> ${properties.OwnerName || 'N/A'}</p>
                            </div>
                        `;
                        break;
                        
                    case 'sec8-data':
                        popupContent = `
                            <div class="popup-content">
                                <h4>Section 8 Housing</h4>
                                <p><strong>Development Name:</strong> ${properties.name || 'N/A'}</p>
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
                    case 'crash-clusters':
                        popupContent = handleCrashHover([feature], e);
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
                    
                    // format value based on property
                    let value;
                    let pctDiff_col;
                    let pctDiff_value;
                    let pctChange_col;
                    let pctChange_value;
                    let number_col;
                    let number_value;
                    
                    if (activeLayer.property === 'collision_count' || activeLayer.property === 'number_of_persons_injured' || activeLayer.property === 'number_of_persons_killed') {
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
                        console.log(pctChange_col)
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

                    // add conditional content
                    if (activeLayer.property === 'collision_count' || activeLayer.property === 'number_of_persons_injured' || activeLayer.property === 'number_of_persons_killed') {
                        // no additional info for these
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

        // only update if something actually changed
        const featureChanged = newHoveredFeature !== currentHoveredFeature;
        const layerChanged = newHoveredLayer !== currentHoveredLayer;
        
        if (featureChanged || layerChanged) {
            // reset
            if (currentHoveredLayer === 'main' && hoveredFeatureId !== null) {
                map.setFeatureState(
                    { source: 'cb3-data', id: hoveredFeatureId },
                    { hover: false }
                );
                hoveredFeatureId = null;
            }

            // set new hover state
            if (newHoveredLayer === 'main' && newHoveredFeature !== null) {
                hoveredFeatureId = newHoveredFeature;
                map.setFeatureState(
                    { source: 'cb3-data', id: hoveredFeatureId },
                    { hover: true }
                );
            }

            // update popup
            if (newHoveredFeature !== null && popupContent !== '') {
                popup.setLngLat(e.lngLat).setHTML(popupContent);
                if (!popup._map) {
                    popup.addTo(map);
                }
            } else {
                popup.remove();
            }

            // update tracking
            currentHoveredFeature = newHoveredFeature;
            currentHoveredLayer = newHoveredLayer;
        } else if (newHoveredFeature !== null) {
            // update popup position
            popup.setLngLat(e.lngLat);
        }
    });

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

    // add navigation controls
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
