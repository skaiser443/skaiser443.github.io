  mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';
  var linkGroup = document.getElementById('link-group');
  var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaisericprb/cim6j0i0e00mu9jm0vuivuzbl',
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
  
  map.addControl(new mapboxgl.Navigation());

  //lodash template
  var station_template_string = "<strong><h3>HAB Monitoring Location</h3></strong><% if (station.Source) { %><p><strong>Agency: </strong><%= station.Source %></p><% } %><% if (station.Site_Name) { %><p><strong>Station Name: </strong><%= station.Site_Name %></p><% } %><% if (station.Parameters) { %><p><strong>Parameters: </strong><%= station.Parameters %></p><% } %>";  

  var station_template = _.template(station_template_string, {variable: 'station'});
  
  map.on('style.load', function() {
    map.on('click', function (e) {
      var features = map.queryRenderedFeatures(e.point, {
	    layers: ['hab-0', 'hab-1']
	  });
	  
	  if (!features.length) {
	    return;
	  }
	  
    console.log(features);
	  
	  var ttip = new mapboxgl.Popup()
	    .setLngLat(features[0].geometry.coordinates)
		.setHTML(station_template(features[0].properties))
		.addTo(map);
	}); 	
	
  });
 	
  addLayer('HAB Long-Term Monitoring', 'hab-1');
  addLayer('HAB Response Monitoring', 'hab-0');
  
  function addLayer(name, id) {
    var link = document.createElement('input');
	link.type = 'checkbox';
	link.checked = true;
	link.className = 'link-group';
	link.textContent = name;
	linkGroup.appendChild(link);
	
	var label = document.createElement('link-group');
	label.setAttribute('for', id);
	label.textContent = name;
	linkGroup.appendChild(label);
	
	link.addEventListener('click', function(e) {
	  map.setLayoutProperty(id, 'visibility',
	    e.target.checked ? 'visible' : 'none');
	});
	
	var layer = document.getElementById('link-group');
	layer.appendChild(link);
	
  };