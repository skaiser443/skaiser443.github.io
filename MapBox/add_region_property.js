// populate each wq_site with a 'subregion' property that contains the name of the huc_8 site within which it lies.
// (requires gdal installation) to convert shp files to geojson run:
// $ ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp

// turf.js is a requirement for this script to run. to install use `npm install turf`
var fs = require('fs')
var turf = require('turf')


fs.readFile('./wq-sites.geojson', function(err, sites) {
  if (err) console.log(err);
  if (sites) {
    fs.readFile('./huc8.geojson', function(err, huc) {
      if (err) console.log(err);
      if (huc) {
        var huc8_data = JSON.parse(huc).features;
        var subregions = {};
        huc8_data.forEach(function(subreg) {
          if (!subregions[subreg.properties.HUC_NAME]) {
            subregions[subreg.properties.HUC_NAME] = subreg;
          }
        })
  
        var wq_sites = JSON.parse(sites).features;
        console.log("starting number of sites",wq_sites.length)
        wq_sites.forEach(function(site, i) {
          for (var key in subregions) {
            if (turf.inside(turf.point([site.properties.long, site.properties.lat]), subregions[key])) {
              site.properties.subregion = key;
            }
          }
        })
        console.log("ending number of sites",wq_sites.length)

        fs.writeFile('wq_sites_region.geojson', JSON.stringify(turf.featurecollection(wq_sites)), function (err){
          if (err) console.log(err);
          console.log('finished writing file');
        })
      }
    })

  }
});

