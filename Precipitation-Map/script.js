var LAYER = 'precipitation.geojson',
    METRIC = 'total',
	COLORS = ['#1a9641', '#3fa74b', '#64b956', '#89cb61', '#abdb6f', '#c3e586', '#dbef9d', '#f3f9b4', '#fef4b3', '#fede9a', '#fdc980', '#fdb367', '#f59053', '#eb6840', '#e1402e', '#d7191c'],
	BREAKS = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0],
	NAMES = ['pot1', 'pot2', 'pot3', 'pot4', 'pot5', 'pot6', 'pot7', 'pot8', 'pot9', 'pot10', 'pot11', 'pot12', 'pot13', 'pot14', 'pot16'],
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

var huc_template_string = "<% if (huc.huc_name) { %><p><strong>Watershed: </strong><%= huc.huc_name %></p><% } %><% if (huc.total) {%><p><strong>Rainfall (inches): </strong><%= huc.total %></p><% } %>";
var huc_template = _.template(huc_template_string, {variable: 'huc'});

map.on('load', function () {
	map.addSource('precipitation', {
	  type: 'geojson',
	  data: 'precipitation.geojson',
	
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
			source: 'precipitation',
			interactive: true,
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
		source: 'precipitation',
		interactive: true,
		layout: {},
		filter: ['==', 'huc_code', ''],		
		paint: {
			'line-color': "#000000",
			'line-width': 2
		},

	});

	map.on("mousemove", function(e) {
		var features = map.queryRenderedFeatures(e.point);
        document.getElementById('tooltip').innerHTML = "Watershed: " + features[0].properties.huc_name + "<br />Total Rainfall (in): " + features[0].properties.total;		
	});

    map.on("mousemove", function(e) {
	    var features = map.queryRenderedFeatures(e.point);
	    if (features.length) {
		    map.setFilter("hover", ["==", "huc_code", features[0].properties.huc_code]);
	    } else {
		    map.setFilter("hover", ["==", "huc_code", ""]);
	    }
    });
	
	map.on("click", function (e) {
	    var features = map.queryRenderedFeatures(e.point);
		
	    if (!features.length) {
			return;
		}	
		
	    var feature = features[0];
		
	    var popup = new mapboxgl.Popup()
	        .setLngLat(map.unproject(e.point))
		    .setHTML(huc_template(feature.properties))
		    .addTo(map);
		    	
    });


    map.addControl(new mapboxgl.Navigation());
	
    var yesterday = new Date();
	var dd = yesterday.getDate() - 1;
	var mm = yesterday.getMonth() + 1;
	var yyyy = yesterday.getFullYear();
    document.getElementById('time').innerHTML = mm + "/" + dd + "/" + yyyy;

	

});



