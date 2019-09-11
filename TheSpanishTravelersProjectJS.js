/* For an overview of what this JS is for, see top comment of TheSpanishTravelersProjectV3.html
Author: Timophey Korolev
Email: timophey.korolev@marquette.edu
Libraries: jQuery, Bootstrap, Leaflet, Esri
The structure of this JS is learned from an example of a similar project, the Boyd Map.
*/

// Declare a general variable for the Leaflet map
var spainMap;

// Additional map variables
var centerCoordinates = [37.18, -3.59];
var initialZoom = 10;
var maxZoom = 13;

// Create a function to instantiate the map with everything on it preloaded
function createMap(){
	spainMap = L.map('map').setView(centerCoordinates, initialZoom);

	// Call the below function to retrieve map, overlay, and point data
	getData(spainMap);

	// Put all of the map & point data into one function
	function getData(map){
		// Creating a basemap
		var esriBase = L.esri.basemapLayer('Imagery');
		esriBase.addTo(spainMap);

		// Importing georeferenced tile layers and adding them to the map
		var spainTileLayer = L.esri.tiledMapLayer({
			url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Espagne1860/MapServer"
			});
			var alhambraTileLayer = L.esri.tiledMapLayer({
			url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/AlhambraPlan/MapServer"
			});
			var granadaTileLayer = L.esri.tiledMapLayer({
			url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Granada_1894/MapServer"
			});
		spainTileLayer.addTo(spainMap);
		granadaTileLayer.addTo(spainMap);
		alhambraTileLayer.addTo(spainMap);
		var overlayMaps = {
			"Spain" : spainTileLayer,
			"Granada" : granadaTileLayer,
			"Alhambra" : alhambraTileLayer
		};

		// Adding a layer control box
		L.control.layers(null, overlayMaps).addTo(spainMap);

		// Loading in the geoPoints.json file with the points and data of paintings of alhambra
		$.ajax("file:///data/geoPoints.json", {
			dataType: "json",
			success: function(response){
				// Create custom marker style
				var geojsonMarkerOptions = {
					radius: 10,
		         	fillColor: "#ff7800",
		        	color: "#000",
		        	weight: 1,
		         	opacity: 1,
		         	fillOpacity: 0.8
				};

				var geoJsonPoints = L.geoJSON(response.features, {
					pointToLayer: function(feature, latlng){
						console.log("Feature: " + feature + " LatLng: " + latlng);
						return L.circleMarker(latlng, geojsonMarkerOptions);
					},
					onEachFeature: function(feature, layer) {
						layer.on('click', function(e) {
							popupContent(feature, layer);
						});
					}
				});

				var clusteredMarkers = L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					disableCLusterAtZoom: boydMap.options.maxZoom
				});

				clusteredMarkers.addLayer(photoPoints);
				clusteredMarkers.addTo(map);

				function popupContent(feature, layer) {

					var descriptionContent = 'Default Desc';

				}
			}
		});

		// Create a Leaflet GeoJSON Layer to store points in and add to map
		// var geoPoints = L.geoJSON

		/**
		*	Take a look at how the GetData function works, what's in it or not
		*	How popups interact with Bootstrap html sections
		*	Work more on the json file, adding another point and some other text.
		**/

		// Create popups - bootstrap or leaflet?
	};
};


// Call the function to instantiate the map once the page is ready
$(document).ready(createMap);