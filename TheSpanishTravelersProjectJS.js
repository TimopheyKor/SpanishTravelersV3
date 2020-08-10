/* For an overview of what this JS is for, see top comment of TheSpanishTravelersProjectV3.html
Author: Timophey Korolev
Email: timophey.korolev@marquette.edu
Libraries: jQuery, Bootstrap, Leaflet, Esri
The structure of this JS is learned from an example of a similar project, the Boyd Map.
*/

// Declare a general variable for the Leaflet map
var spainMap;
var esriBase;
//console.log('I love christian');

// Additional map variables
// var centerCoordinates = [40.9429, -4.1088]; - segovia
// [37.39075, -5.99845] - sevilla
// [37.18, -3.59] - regular start
// [39.85880, -4.02543] - Toledo
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
// var toledoTileLayer = L.esri.tiledMapLayer({
// 	url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Toledo/MapServer"
// });
// var segoviaTileLayer = L.esri.tiledMapLayer({
// 	url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Segovia/MapServer"
// });
var sevillaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/10c58a9f-085b-4471-9228-0bc017aaf169/{z}/{x}/{y}?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var toledoTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/1aea9aa7-4337-4e9e-99e1-3261897ee7a0/{z}/{x}/{y}?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var segoviaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/b79483e6-57d0-45fc-b9e5-c31406e12d0c/{z}/{x}/{y}?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
spainTileLayer.addTo(spainMap);
granadaTileLayer.addTo(spainMap);
alhambraTileLayer.addTo(spainMap);
//toledoTileLayer.addTo(spainMap);
segoviaTileLayer.addTo(spainMap);
sevillaTileLayer.addTo(spainMap);
toledoTileLayer.addTo(spainMap);
var overlayMaps = {
	"Spain" : spainTileLayer,
	"Granada" : granadaTileLayer,
	"Alhambra" : alhambraTileLayer,
	"Toledo" : toledoTileLayer,
	"Segovia" : segoviaTileLayer,
	"Sevilla" : sevillaTileLayer
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
$.ajax("https://raw.githubusercontent.com/TimopheyKor/SpanishTravelersV3/master/testPoints.json", {
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
					openPopup(feature, layer); // Custom helper function to create custom popup
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

		// function popupContent(feature, layer) {
			
		// 	var name = feature.properties.name;
		// 	var customPopup = '<h2> ' + name + ' </h2>'
  		// 			+ '<table style="color:white;height:90%;width:300%;"><tr>'
  		// 			+ '<th> "Display_Author_Comments" <br> Source: Book_Picture_Information </th>'
  		// 			+ '</tr></table>';
  		// 	var customOptions =
  		// 		{
  		// 			'width': '100%',
  		// 			'className' : 'custom-popup-options'
  		// 		};
  			
		// 	//var image = feature.properties.imageURL;
		// 	//var description = feature.properties.description;
		// 	//var source = feature.properties.source;
		// 	//console.log('clicked');
		// 	layer.bindPopup(customPopup, customOptions);
		// }
		
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
	var pictureURL = feature.properties.imgURL;
	var bookInformation = feature.properties.tombstone;
	var relations = feature.properties.relations;
	relations = relations.split("|");
	//var authorComments = feature.properties.authorComments;
	//var nameLit = feature.properties.nameLit;
	//var nameLocal = feature.properties.nameLocal;

	console.log("Changing innerHTML of Popup");
	// Then, assign them to their spots in the innerHTML accordingly.
	document.getElementById("my-popup-title").innerHTML = '<h2 id="specific-image-title">' + name + '</h2>';
	document.getElementById("my-popup-subtitle").innerHTML = '<h3 id="specific-image-subtitle">  </h2>';
	document.getElementById("my-popup-image").innerHTML = '<img id = "specific-image" src = "' + pictureURL + '" alt="' + name + '">';
	document.getElementById("my-popup-description").innerHTML = '<p> <br />' + bookInformation + '<br /> <p>';
	document.getElementById('im1').alt = relations[0];
	document.getElementById('im1').src = relations[1];
	document.getElementById('im2').alt = relations[2];
	document.getElementById('im2').src = relations[3];
	//document.getElementById('im3').src = relations[2];
}

// Implementing the gallery, using a YouTube tutorial by Dev Ed with my own adjustments to fit the site, and adding image swapping functionality
const gallerySlide = document.querySelector('.gallery-slide');
const galleryImages = document.querySelectorAll('.gallery-slide img');

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

// Counter for image tracking
let counter = 0;
let size = galleryImages[0].clientWidth;

// Setting the position of the gallery
gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
darkenBtn(prevBtn);

// Helper functions for slide button limits
function darkenBtn(btn) {
	btn.style.color = 'darkgray';
	btn.style.opacity = '0.5'
}
function activateBtn(btn) {
	btn.style.color = 'white';
	btn.style.opacity = '0.8'
}

// Slide Button Listeners
function slideNext() {
	gallerySlide.style.transition = "transform 0.4s ease-in-out";
	if(counter < (galleryImages.length-2)) {
		counter++;
		gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
		activateBtn(prevBtn);
	} else {
		console.log('Last image reached: no next');
	}
	if(counter == (galleryImages.length-2)){
		darkenBtn(nextBtn);
	}
}
nextBtn.addEventListener('click', slideNext);

function slidePrev(){
	console.log("click registered");
	gallerySlide.style.transition = "transform 0.4s ease-in-out";
	if(counter > 0) {
		counter--;
		gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
		activateBtn(nextBtn);
	} else {
		console.log('First image reached: no previous, counter: ' + counter)
	}
	if(counter == 0){
		darkenBtn(prevBtn);
	}
}
prevBtn.addEventListener('click', slidePrev);

// Event listeners for selecting specific images from the gallery
galleryImages.forEach(image => {
	image.addEventListener('click', event => {
		//var mainImage = document.getElementById("specific-image").src;
		var selectedImage = document.getElementById("specific-image");
		var selectedImageTitle = document.getElementById("specific-image-subtitle");
		var prevSelected = selectedImage.src;
		var prevSelectedTitle = selectedImageTitle.textContent;
		console.log(prevSelected);
		var newSelected = image.src;
		var newSelectedTitle = image.alt;
		console.log(newSelected);
		selectedImage.src = newSelected;
		selectedImageTitle.textContent = newSelectedTitle;
		image.src = prevSelected;
		image.alt = prevSelectedTitle;
	});
});

// TODO: Implement gallery scalability, probably needs to be done with helper functions that are then used inside of the popup creation functions. 
// Must first update JSON files, work on Python script

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
