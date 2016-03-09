var map = L.map('map').setView([40.72,-73.91], 11);

var tiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Wheelchair Icon &copy; <a href="accessibleicon.org">Accessible Icon Project</a>, Station Data &copy; <a href="https://nycopendata.socrata.com/">NYC Open Data</a> & <a href="http://web.mta.info/accessibility/stations.htm">MTA</a>, Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});
map.addLayer(tiles);
L.Control.geocoder().addTo(map);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'legend');    
    div.innerHTML +=
      '<svg width="22" height="27"><circle cx="10" cy="21" r="5" class="adaLegend" fill="blue"/></svg><span>Accessible station</span><br />' +
      '<svg width="22" height="27"><circle cx="10" cy="21" r="5" class="nonadaLegend" fill="grey"/></svg><span>Non-accessible station</span><br />'
    return div;
};

legend.addTo(map);

$.getJSON( "MTA_subway_lines.geojson", function( data ) {
    var subwayLines = data;
    var subwayStyle = function(feature){
      var color = null;
      var line = feature.properties.Line;
      if (line == "7") {
        color = '#B933AD'  
      } else if (line == "G") {
        color = "#6CBE45"
      } else if (line == "L") {
        color = "#A7A9AC"
      } else if (line.search("A")!=-1 || line.search("C")!=-1 || line.search("E")!=-1) {
        color = "#0039A6"
      } else if (line.search("B")!=-1 || line.search("D")!=-1 || line.search("F")!=-1 || line.search("M")!=-1) {
        color = "#FF6319"
      } else if (line.search("1")!=-1 || line.search("2")!=-1 || line.search("3")!=-1) {
        color = "#EE352E"
      } else if (line.search("J")!=-1 || line.search("Z")!=-1) {
        color = "#996633"
      } else if (line.search("N")!=-1 || line.search("Q")!=-1 || line.search("R")!=-1) {
        color = "#FCCC0A"
      } else if (line.search("4")!=-1 || line.search("5")!=-1 || line.search("6")!=-1) {
        color = "#00933C"
      } else {
        color = 'gray'
      }
      var style = {
        weight: 2,
        opacity: 1.0,
        color: color
      };
      return style
    }
    var subwayClick = function (feature, layer) {
        layer.bindPopup("<strong>Line(s):</strong> " + feature.properties.Line);
    }
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});

$.getJSON( "stations.geojson", function( data ) {
    var stations = data;
    var stationPTL = function(feature, latlng) {
      if(feature.properties.ada == "true") {
        var stationMarker = L.circleMarker(latlng, {
          stroke: false,
          fillColor: 'blue',
          fillOpacity: .7,
          radius: 4,
        });
        return stationMarker;
      } 
      else {
        var stationMarker = L.circleMarker(latlng, {
          stroke: false,
          fillOpacity: .4,
          radius: 3,
          color: 'grey'
        });
        return stationMarker;
      }
    }
    var stationClick = function(feature, layer) {
      layer.bindPopup("<strong>Station:</strong> " + feature.properties.name + "<br /> <strong>Line(s):</strong> " + feature.properties.line + "<br /><strong>Elevator status:</strong> <a href='http://advisory.mtanyct.info/EEoutage/' target='_blank'>Check status</a>" + "<br /><a href='http://web.mta.info/accessibility/stations.htm' target='_blank'>More info</a>");
    }
    stationGeoJSON = L.geoJson(stations, {
      pointToLayer: stationPTL,
      onEachFeature: stationClick
    }).addTo(map);
});