mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcjQ0MyIsImEiOiJjaWt5c3EwMWcwNnp2dWFtM3I5bW45MmhtIn0.7N2dsfrg4l7cYRVlq7cu7Q';

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaiser443/cit7fmjzd00292xmfxcsxo2or',
	center: [-76.993, 38.907],
	maxBounds: [
	    [-90.0, 41.0],
	    [-72.0, 35.0]
	],
	zoom: 10.5,
	attributionControl: {
		position: 'bottom-right'
	}
});

var url = 'https://spreadsheets.google.com/feeds/list/1yWkezH8V-7bDAO_vBTwMTMB8zUazokBDcKXWqb7zTY4/1/public/basic?alt=json';

var garden_template_string = "<% if (garden.garden) { %><p><strong><%= garden.garden %></strong></p><% } %><% if (garden.address) { %><p><%= garden.address %></p><% } %><% if (garden.plots) { %><p><%= garden.plots %> plots</p><% } %><% if (garden.web) { %><p><a href = <%= garden.web %>>Website</a></p><% } %>";
var garden_template = _.template(garden_template_string, {variable: 'garden'});
map.on('load', function() {
	
	mapboxgl.util.getJSON(url, function(err, data) {
		document.body.classList.remove('loading');
		if (err) return console.warn(err);
		var geojson = {
			type: 'FeatureCollection',
			features: []
		};
		
		data.feed.entry.forEach(function(d) {
			var fields = d.content.$t.split(', ');
			var lng = parseFloat(fields[13].split(': ')[1]);
			var lat = parseFloat(fields[12].split(': ')[1]);
			var address = fields[0].split(': ')[1];
			var contact = fields[1].split(': ')[1];
			var web = fields[5].split(': ')[1];
			var plots = parseInt(fields[10].split(': ')[1], 10);
			var garden = fields[8].split(': ')[1];
			
			geojson.features.push({
				type: 'Feature',
				properties: {
					name: d.title.$t,
					address: address,
					contact: contact,
					web: web,
					plots: plots,
                    garden: garden					
				},
				geometry: {
					type: 'Point',
					coordinates: [lng, lat]
				}
			});
		});
	
	
	map.addSource('data', {
		type: 'geojson',
		data: geojson
	});
	
	map.addLayer({
		id: 'point',
		type: 'circle',
		source: 'data',
		paint: {
			'circle-radius': {
				property: 'plots',
				stops: [
				    [10, 3],
					[25, 8],
					[75, 15]
				]
			},
			'circle-color': {
				property: 'plots',
				stops: [
				    [10, "#80FFB8"],
					[215, "#397F4D"]
				]
			}
		}
	});
});

map.on('click', function(e) {
	var features = map.queryRenderedFeatures(e.point, {
		layers: ['point']
	});
	
	if (!features.length) {
		return;
	}
	
	var feature = features[0];
	var ttip = new mapboxgl.Popup()
	    .setLngLat(feature.geometry.coordinates)
		    .setHTML(garden_template(features[0].properties))
			.addTo(map);
});

map.on('mousemove', function(e) {
	var features = map.queryRenderedFeatures(e.point, {
		layers: ['point']
	});
	map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});


});