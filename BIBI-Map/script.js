mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';
  var map = new mapboxgl.Map({
    container: 'map',
	style: 'mapbox://styles/mapbox/light-v9',
	center: [-78.213233, 38.953640],
	zoom: 7.6,
	attributionControl: {
		position: 'bottom-right'
	}
  
  });
  
  map.on('load', function() {
	 map.addSource('bibi', {
		 type: 'geojson',
		 data: 'bibi.geojson',
		 cluster: true,
		 clusterMaxZoom: 14,
		 clusterRadius: 100,
	 });
     
     map.addLayer({
		 id: 'non-cluster-markers',
		 type: 'circle',
		 source: 'bibi',
		 interactive: true,
		 paint: {
			 'circle-radius': 4,
			 'circle-color': {
				 property: 'GENUS',
				 type: 'categorical',
				 stops: [
				   ['GAMMARUS', '#000000'],
				   ['PELTOPERLA', '#bad9c8'],
				   ['EPHEMERA', '#d96704']]
			 }
		 },
	 });
	 
	 var layers = [
	     [50, '#f28cb1'],
		 [20, '#f1f075'],
		 [0, '#51bbd6']
	 ];
	 
	 layers.forEach(function (layer, i) {
		 map.addLayer({
			 id: 'cluster-' + i,
			 type: 'circle',
			 source: 'bibi',
			 paint: {
				 'circle-color': layer[1],
				 'circle-radius': 18
			 },
			 filter: i == 0 ?
			    [">=", "point_count", layer[0]] :
			        ["all",
				        [">=", "point_count", layer[0]],
					    ["<", "point_count", layers[i - 1][0]]]
		 });
	 });
	 
     map.addLayer({
         "id": "cluster-count",
         "type": "symbol",
         "source": "bibi",
         "layout": {
             "text-field": "{point_count}",
             "text-font": [
                     "DIN Offc Pro Medium",
                     "Arial Unicode MS Bold"
                 ],
             "text-size": 12
         }
     });

    map.on("click", function(e) {
		var features = map.queryRenderedFeatures(e.point);
		
		if (!features.length) {
			return;
		}
	    var feature = features[0];
	    var ttip = new mapboxgl.Popup()
		  .setLngLat(feature.geometry.coordinates)
		  .setHTML("Genus: " + feature.properties.GENUS)
		  .addTo(map);
		});
 

//     map.addLayer({
//		 id: 'peltoperla',
//		 type: 'circle',
//		 source: 'map_genera',
//		 'source-layer': 'map_genera',
//		 interactive: true,
//		 filter: ["==", "GENUS", "PELTOPERLA"],
//		 paint: {
//			 'circle-radius': 4,
//			 'circle-color': "#d96704"
//		 }
//	 });	 
	  
  });

  
