  mapboxgl.accessToken = "pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g";
  var map = new mapboxgl.Map({
    container: "map",
	style: "mapbox://styles/skaisericprb/cinvqomcf000mb4nr6tq96gpu",
	center: [-78.213233, 38.953640],
	maxBounds: [
	  [-81.309814453125, 41.40153558289846],
      [-72.57568359375, 35.8356283888737]
    ],
	zoom: 7.6,
	attributionControl: {
	  position: "bottom-right"
	}
  });
  
  
  var district_template_string = "<% if (district.state) { %><p><strong>State: </strong><%= district.state %></p><% } %><% if (district.district) {%><p><strong>District: </strong><%= district.district %></p><% } %><% if (district.firstName) {%><p><strong>Representative: </strong><%= district.firstName %> <%= district.lastName %></p><% } %>";
  
  var district_template = _.template(district_template_string, {variable: 'district'});  
  
  map.on('load', function() {
    map.addSource("congress", {
	  "type": "vector",
	  url: "mapbox://skaisericprb.0gkmumgx",
	});
	map.addLayer({
	  "id": "hover",
	  "type": "line",
	  "source": "congress",
	  "source-layer": "congdist",
	  "layout": {},
	  "paint": {
		"line-color": "#000000",
		"line-width": 1
	  },
	  "filter": ["==", "districtID", ""]
	});

    map.on('click', function (e) {
	  var features = map.queryRenderedFeatures(e.point);
  
      if (!features.length) {
		  return;
	  }
	  
      var feature = features[0];
      var ttip = new mapboxgl.Popup()
	      .setLngLat(map.unproject(e.point))
		  .setHTML(district_template(features[0].properties))
		  .addTo(map);
	  });  

	
    map.on("mousemove", function(e) {
	    var features = map.queryRenderedFeatures(e.point);
	    if (features.length) {
		    map.setFilter("hover", ["==", "districtID", features[0].properties.districtID]);
	    } else {
		    map.setFilter("hover", ["==", "districtID", ""]);
	    }
    });
	
    map.addControl(new mapboxgl.Geocoder());

  });
  
	