/* For an overview of what this JS is for, see top comment of TheSpanishTravelersProjectV3.html
Author: Timophey Korolev
Email: timophey.korolev@marquette.edu
Libraries: jQuery, Bootstrap, Leaflet, Esri
The structure of this JS is learned from an example of a similar project, the Boyd Map.
*/

// Declare a general variable for the Leaflet map
var spainMap;
var esriBase;

// Additional map variables
var centerCoordinates = [37.18, -3.59];
var initialZoom = 10;
var maxZoom = 13;

/* Steps:
1.) Implement leaflet map
2.) Add geoJSON points
3.) Attempt to cluster
4.) Attempt popups
5.) Switch 3 and 4 if errors occur
6.) Attempt to use ajax and data functions to preload data before the website is ready
7.) Intersperse 6 between other steps if errors occur
ALSO: WRITE A CODE TO SCAN THE EXCEL SPREADSHEET INTO A JSON FILE
*/

// Step 1
spainMap = L.map('map').setView(centerCoordinates, maxZoom);
esriBase = L.esri.basemapLayer('Imagery');
esriBase.addTo(spainMap);

// Importing other maps
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

// Step 2
/*
var pointStyle = {

}
var geoPoints = new L.GeoJSON.AJAX("https://raw.githubusercontent.com/TimopheyKor/SpanishTravelersV3/master/geoPoints.json");
var geoJsonLayer = L.geoJSON().addTo(spainMap);
geoJsonLayer.addData(geoPoints);
*/

// Using regular Ajax instead of plugin
$.ajax("https://raw.githubusercontent.com/TimopheyKor/SpanishTravelersV3/master/geoPoints.json", {
	dataType: "json",
	success: function(response){
		// Create custom marker style
		var geojsonMarkerOptions = {
			radius: 15,
         	fillColor: "#00d458",
        	color: "#000",
        	weight: 2,
         	opacity: 1,
         	fillOpacity: 0.7
		};

		// Check on Marker Style Variables
		console.log("GeojsonMarkerOptions radius: " + geojsonMarkerOptions.radius);

		var geoJsonPoints = L.geoJSON(response.features, {
			pointToLayer: function(feature, latlng){
				// Check on inputs
				console.log("Feature: " + feature + " LatLng: " + latlng);
				return L.circleMarker(latlng, geojsonMarkerOptions);
			},
			onEachFeature: function(feature, layer) {
				// Check on inputs
				console.log("Feature: " + feature + " layer: " + layer);
				layer.on('click', function(e) {
					//hideTitle();
					openPopup(feature, layer);
					//popupContent(feature, layer);
				});
			}
		});

		//geoJsonPoints.addTo(spainMap);
		var markerCluster = L.markerClusterGroup();
		markerCluster.addLayer(geoJsonPoints);
		markerCluster.addTo(spainMap);

		/*
		var clusteredMarkers = L.markerClusterGroup({
			spiderfyOnMaxZoom: false,
			showCoverageOnHover: false,
			disableCLusterAtZoom: spainMap.options.maxZoom
		});

		// Check on markerClusterGroup
		console.log("L.markerClusterGroup spiderfyOnMaxZoom = " + clusteredMarkers.spiderfyOnMaxZoom);

		clusteredMarkers.addLayer(geoJsonPoints);
		clusteredMarkers.addTo(spainMap);
		
		*/

		function popupContent(feature, layer) {
			
			var name = feature.properties.name;
			var customPopup = '<h2> ' + name + ' </h2>'
  					+ '<table style="color:white;height:90%;width:300%;"><tr>'
  					+ '<th> "Display_Author_Comments" <br> Source: Book_Picture_Information </th>'
  					+ '</tr></table>';
  			var customOptions =
  				{
  					'width': '100%',
  					'className' : 'custom-popup-options'
  				};
  			
			//var image = feature.properties.imageURL;
			//var description = feature.properties.description;
			//var source = feature.properties.source;
			//console.log('clicked');
			layer.bindPopup(customPopup, customOptions);
		}
		
	}
});

function openPopup(feature, layer) {
	console.log("Opening Popup");
	hideTitle();
	getPopupContent(feature, layer);
	document.getElementById("my-popup").style.height = "100%";
}
function closePopup() {
	document.getElementById("my-popup").style.height = "0";
	showTitle();
}

function hideTitle() {
	console.log("Hiding Title");
	document.getElementById("title").style.opacity = 0;
};
function showTitle() {
	document.getElementById("title").style.opacity = 1;
}

function getPopupContent(feature, layer) {
	console.log("Getting PopupContent Variables");
	// First, get all the variables needed from the .json file.
	var name = feature.properties.name;
	var pictureURL = feature.properties.pictureURL;
	var bookInformation = feature.properties.bookInformation;
	var authorComments = feature.properties.authorComments;
	var nameLit = feature.properties.nameLit;
	var nameLocal = feature.properties.nameLocal;

	console.log("Changing innerHTML of Popup");
	// Then, assign them to their spots in the innerHTML accordingly.
	document.getElementById("my-popup-title").innerHTML = '<h2>' + name + '</h2>';
	document.getElementById("my-popup-image").innerHTML = '<img id = "specific-image" src = "' + pictureURL + '">';
	document.getElementById("my-popup-description").innerHTML = '<p>"' + authorComments + '"</p>'
															+ '<p> Local Name:<br />' + nameLocal + '</p>'
															+ '<p> Book Information:<br />' + bookInformation + '<p>';
}


// Try to use the geoJSON layer in-line.
/*
var artPoints = {
 "type": "Feature",
	"features": [
		{"type": "Feature",
			"geometry": {"type": "Point", "coordinates": [37.18, -3.59]},
			"properties": {"name": "The Darro"}
		},
		{"type": "Feature",
			"geometry": {"type": "Point", "coordinates": [37.18, -3.60]},
			"properties": {"name": "Puente del Carbon"}
		}
	]
}

var geoJsonLayer = L.geoJSON().addTo(spainMap);
geoJsonLayer.addData(artPoints);
*/

// Step 3

// Step 4

// Step 5

// Step 6

// Step 7


// WORKING CODE DERIVED FROM BOYS MAP, NO ERRORS BUT POINTS DONT SHOW:
/*
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
		$.ajax("https://raw.githubusercontent.com/TimopheyKor/SpanishTravelersV3/master/geoPoints.json", {
			dataType: "json",
			success: function(response){
				// Create custom marker style
				var geojsonMarkerOptions = {
					radius: 20,
		         	fillColor: "#ff7800",
		        	color: "#000",
		        	weight: 1,
		         	opacity: 1,
		         	fillOpacity: 0.8
				};

				// Check on Marker Style Variables
				console.log("GeojsonMarkerOptions radius: " + geojsonMarkerOptions.radius);

				var geoJsonPoints = L.geoJSON(response.features, {
					pointToLayer: function(feature, latlng){
						// Check on inputs
						console.log("Feature: " + feature + " LatLng: " + latlng);
						return L.circleMarker(latlng, geojsonMarkerOptions);
					},
					onEachFeature: function(feature, layer) {
						// Check on inputs
						console.log("Feature: " + feature + " layer: " + layer);
						layer.on('click', function(e) {
							popupContent(feature, layer);
						});
					}
				});

				var clusteredMarkers = L.markerClusterGroup({
					spiderfyOnMaxZoom: false,
					showCoverageOnHover: false,
					disableCLusterAtZoom: spainMap.options.maxZoom
				});

				// Check on markerClusterGroup
				console.log("L.markerClusterGroup spiderfyOnMaxZoom = " + clusteredMakers.spiderfyOnMaxZoom);

				clusteredMarkers.addLayer(geoJsonPoints);
				clusteredMarkers.addTo(spainMap);

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
	//};
//};




// Call the function to instantiate the map once the page is ready
//$(document).ready(createMap);
