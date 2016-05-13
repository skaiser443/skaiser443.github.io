var LAYER = 'precip_data',
    METRIC = 'total',
	COLORS = ['#d9160d', '#d96704', '#f2d888', '#bad9c8', '#4988bf', '#033e8c'],
	BREAKS = [0, 0.1, 0.3, 0.5, 0.8, 1.0],
	NAMES = ['pot1', 'pot2', 'pot3', 'pot4', 'pot5', 'pot6'],
	FILTERUSE;

mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaisericprb/cio5p8qoo0001b3m5e29gn28d',
	center: [-78.213233, 38.953640],
	maxBounds: [
	  [-81.309814453125, 41.40153558289846],
	  [-72.57568359375, 35.8356283888737]
	],
	zoom: 7.6,
	attributionControl: {
		position: 'bottom-right'
	}
	
});

map.on('load', function () {
	map.addSource('precip_data', {
	  type: 'vector',
	  url: 'mapbox://skaisericprb.16q0uit8',
	
	});
	for (i=0; i < COLORS.length; i++) {
		if (i < COLORS.length - 1) {
			FILTERUSE = ['all', ['>=', METRIC, BREAKS[i]], ['<', METRIC, BREAKS[i + 1]]];
		} else {
			FILTERUSE = ['>=', METRIC, BREAKS[i]];
		}
		map.addLayer({
			id: NAMES[i],
			type: 'fill',
			source: 'precip_data',
			interactive: true,
			'source-layer': LAYER,
			layout: {},
			filter: FILTERUSE,
			paint: {
				'fill-outline-color': "#ffffff",
				'fill-color': COLORS[i],
				'fill-opacity': 0.35
			}
		});
	}
	map.addLayer({
		id: 'hover',
		type: 'line',
		source: 'precip_data',
		'source-layer': LAYER,
		layout: {},
		paint: {
			'line-color': "#000000",
			'line-width': 2
		},
		filter: ['==', 'huc_code', '']
	});
	
	map.on("mousemove", function(e) {
		var features = map.queryRenderedFeatures(e.point);
        document.getElementById('tooltip').innerHTML = "Watershed: " + features[0].properties.huc_code + "<br />Total Rainfall (in): " + features[0].properties.total;		
		
	});
	
//    map.on("mousemove", function(e) {
//	    var features = map.queryRenderedFeatures(e.point, { 
//		  layers: ["NAMES"]
//		});
//	    if (features.length) {
//		    map.setFilter('hover', ['==', 'huc_code', features[0].properties.huc_code]);
//	    } else {
//		    map.setFilter('hover', ['==', 'huc_code', '']);
//	    }
//    });		
});



