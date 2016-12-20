mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';

var bound = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-81.457, 36.945),
	new mapboxgl.LngLat(-72.49, 41.17)
);
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaisericprb/citvqu6qb002p2jo1ig5hnvtk',
	center: [-77.975, 39.077],
	maxBounds: bound,
	zoom: 7.45,
	attributionControl: {
		position: 'bottom-right'
	},
	minZoom: [7.0],
});

map.on('style.load', function () {
	map.addSource('monitoring', {
		type: 'vector',
		url: 'mapbox://skaisericprb.ado930is'
	});
    map.addLayer({
	    id: 'monitoring',
	    type: 'symbol',
		layout: {
			'icon-image': 'marker-11',
			'icon-allow-overlap': true
		},
	    source: 'monitoring',
		'source-layer': 'WQ_Sites-a2dz9s',
	    paint: {}
    });
	
	map.addLayer({
		id: 'monitor-hover',
		type: 'symbol',
		layout: {
			'icon-image': 'wq-site',
			'icon-size': 1.5
		},
		source: 'monitoring',
		'source-layer': 'WQ_Sites-a2dz9s',
		paint: {},
		filter: ["==", "Station_id", ""]
	});
	
	map.addSource('subwatershed', {
		type: 'vector',
		url: 'mapbox://skaisericprb.702zi5l0'
	});
	map.addLayer({
		id: 'subwatershed',
		type: 'line',
		source: 'subwatershed',
		'source-layer': 'huc8',
		paint: {
			'line-color': '#877b59',
			'line-width': 1
		}
	});
    
	map.setFilter('monitoring', ['all', ['in', 'Source'].concat(agencies), ['in', 'HUC_NAME'].concat(subregions)]);
      _.forEach(['agency', 'subregion'], function(category) {
	      setEventListeners(category);
      })
});

// ***ADD CHECKBOX TO HIDE SHOW LAYERS*** //

var agencies = ['Adams County Conservation District', 'Arlington County', 'Chesapeake Bay Program', 'City of Rockville', 'D.C. Dept of Environment', 'Friends of Accotink Creek', 'Friends of Silgo Creek', 'MD Dept of Natural Resources', 'Maryland Biological Stream Survey', 'National Park Service', 'National Water Quality Monitoring Council', 'NOAA', 'Renfrew Institute', 'USGS', 'VA Dept of Environmental Quality', 'WV Dept of Environmental Protection'];
var agency_container = document.getElementById('agencies');

var subregions = ['Conococheague-Opequon', 'Monocacy', 'Cacapon-Town', 'North Branch Potomac', 'Middle Potomac-Catoctin', 'South Branch Potomac', 'Shenandoah', 'Middle Potomac-Anacostia-Occoquan', 'North Fork Shenandoah', 'South Fork Shenandoah', 'Lower Potomac'];
var subregions_container = document.getElementById('subregions');

_.forEach([{
  collection: agencies,
  container: 'agencies',
  class: 'agency'
}, {
  collection: subregions,
  container: 'subregions',
  class: 'subregion'
}], function(category) {
  var container = document.getElementById(category.container);
  _.forEach(category.collection, function(item) {
    var item_str = item.split(' ').join('_');
    container.innerHTML += `<input class=${category.class} type='checkbox' id=${item_str} checked='checked'>
    <label for=${item_str} class='button space-bottom1 icon check quiet'>${item}</label>`
  })
})

// ***ADD FUNCTION TO SWITCH BETWEEN SIDEBAR TABS*** //

function openTab(evt, tabName) {
    var i, sidebar, tablinks;

    sidebar = document.getElementsByClassName("sidebar-text");
    for (i = 0; i < sidebar.length; i++) {
        sidebar[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
};



// ***ADD TOOLTIP*** //
	
var station_template_string = "<% if (station.Source_No) { %><p><strong>Monitoring Station - <%= station.Source_No %></strong></p><% } %><% if (station.Source) { %><p><strong>Agency: </strong><%= station.Source %></p><% } %><% if (station.HUC_NAME) {%><p><strong>Watershed: </strong><%= station.HUC_NAME %></p><% } %><% if (station.Purpose) {%><p><strong>Purpose: </strong><%= station.Purpose %></p><% } %><% if (station.Contact_Na) { %><p><strong>Contact: </strong><%= station.Contact_Na %></p><% } %><% if (station.Program_we) { %><p><strong>Website: </strong><a href = <%= station.Program_we %> target = _blank >Click Here</a></p><% } %><% if (station.URL) { %><p><strong>Data Link: </strong><a href = <%= station.URL %> target = _blank >Click Here</a></p><% }%>";
var station_template = _.template(station_template_string, {variable: 'station'});

// ***SET EVENT LISTENERS ON CHECKBOXES TO FILTER DATA*** //

function setEventListeners(type) {
var inputs = document.querySelectorAll("input." + type);
  _.forEach(inputs, function(box) {
    box.addEventListener('click', function() {
      var filterIndex = type === 'agency' ? 1 : 2;
      var filter = map.getFilter('monitoring');
      var currentFilter = filter[filterIndex];
      var id = box.id.split('_').join(' ');
      var newFilter;
      if (box.hasAttribute('checked')) {
        box.removeAttribute('checked');
        // remove unchecked item from the current filter
        newFilter = _.filter(currentFilter, function(d) {
          return d !== id;
        });
      } else {
        box.setAttribute('checked', 'checked');
        // add checked item to the current filter
        newFilter = currentFilter.concat([id])
      }
        // replace old filter with the newly updated filter
        filter[filterIndex] = newFilter;
        map.setFilter('monitoring', filter);
    });
  });
};

  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
	    layers: ['monitoring']
    });
  
    if (!features.length) {
      return;
    }
	  
    var feature = features[0];
    var ttip = new mapboxgl.Popup()
	    .setLngLat(map.unproject(e.point))
        .setHTML(station_template(features[0].properties))
	    .addTo(map);
  });
  
  map.on('mousemove', function(e) {
	  var features = map.queryRenderedFeatures(e.point, {layers: ["monitoring"] });
	  if (features.length) {
		  map.setFilter("monitor-hover", ["==", "Station_id", features[0].properties.Station_id]);
	  } else {
		  map.setFilter("monitor-hover", ["==", "Station_id", ""]);
	  }
  });

  map.on('mouseout', function() {
	  map.setFilter("monitor-hover", ["==", "Station_id", ""]);
  });

	
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');
map.addControl(new MapboxGeocoder({
	accessToken: mapboxgl.accessToken,
	position: 'top-right'
	}));
