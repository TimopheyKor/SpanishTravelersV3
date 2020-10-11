/* The Spanish Travelers Project : Artist Travelers
Artist Travelers is a collaboration between the Milwaukee Art Museum's Americans in Spain exhibition and Marquette University's Spanish Travelers project.
Author: Timophey Korolev
Email: timophey.korolev@marquette.edu, timopheykor@gmail.com
Libraries: jQuery, Bootstrap, Leaflet, Esri
The general structure of this JS is learned from an example of a similar project, the Boyd Map.
The design is made in accordance with MAM guidelines.
*/

// Declare general variables to store the Leaflet map and the esri basemap
var spainMap;
var esriBase;

/* Additional map variables:
== Lat/Long coordinates of relevant locations ==
[40.9429, -4.1088]; - Segovia
[37.39075, -5.99845] - Sevilla
[37.18, -3.59] - Alhambra
[39.85880, -4.02543] - Toledo
[39.85880, -2.6] - At zoom level 7, centers the spain map on a 1920x1080 screen.
*/

// Set variables for the initial field of view and maximum zoom allowed on the map
var centerCoordinates = [39.85880, -2.6];
var initialZoom = 7;
var maxZoom = 13;

// Set the map variables to their proper values. spainMap appears in the "map" div of the HTML
spainMap = L.map('map').setView(centerCoordinates, initialZoom);
esriBase = L.esri.basemapLayer('Imagery');
esriBase.addTo(spainMap);

// Importing georeferenced tile layers (historical maps) and adding them to the base map
var spainTileLayer = L.esri.tiledMapLayer({
	url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Espagne1860/MapServer"
});
var granadaTileLayer = L.esri.tiledMapLayer({
	url: "https://tiles.arcgis.com/tiles/O7h3OCRVxKceyg19/arcgis/rest/services/Granada_1894/MapServer"
});
var alhambraTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/5e33a9ca-c3b1-4aea-90d9-1f061d12c31d/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var sevillaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/1dd002a8-5a13-4dc2-8a9d-b76fceb938de/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var toledoTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/0519954d-8c4b-4ed5-a5f4-b85dc71fed62/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var segoviaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/e0d913ca-7e11-4f94-8a6e-3b4916729e44/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var cordobaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/b79483e6-57d0-45fc-b9e5-c31406e12d0c/{z}/{x}/{y}?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var alicanteTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/d392ad34-b58a-4e2c-a99d-e1c468712a8f/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
spainTileLayer.addTo(spainMap);
granadaTileLayer.addTo(spainMap);
alhambraTileLayer.addTo(spainMap);
segoviaTileLayer.addTo(spainMap);
sevillaTileLayer.addTo(spainMap);
toledoTileLayer.addTo(spainMap);
cordobaTileLayer.addTo(spainMap);
var overlayMaps = {
	"Spain" : spainTileLayer,
	"Granada" : granadaTileLayer,
	"Alhambra" : alhambraTileLayer,
	"Toledo" : toledoTileLayer,
	"Segovia" : segoviaTileLayer,
	"Sevilla" : sevillaTileLayer,
	"Cordoba" : cordobaTileLayer,
	"Alicante" : alicanteTileLayer
};
// Adding a layer control box
L.control.layers(null, overlayMaps).addTo(spainMap);

// Importing a .json file, which contains data on exhibition peicces to be displayed on the site, and using the markerCluster plugin to create interactive points on the map
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

		var markerCluster = L.markerClusterGroup();
		markerCluster.addLayer(geoJsonPoints);
		markerCluster.addTo(spainMap);
		
	}
});

// Custom helper functions to create interactive popups when users click on points
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

// Hides title in background when transluscent popup shows
function hideTitle() {
	console.log("Hiding Title");
	document.getElementById("title").style.opacity = 0;
};
function showTitle() {
	document.getElementById("title").style.opacity = 1;
}

// Helper function to assign point-specific content to poups when they open, with data drawn from the .json file
function getPopupContent(feature, layer) {
	console.log("Getting PopupContent Variables");
	// First, get all the variables needed from the .json file
	var name = feature.properties.name;
	var pictureURL = feature.properties.imgURL;
	var tombstone = feature.properties.tombstone;
	if (feature.properties.relation_1 != null) {
		var relation_1 = feature.properties.relation_1;
		relation_1 = relation_1.split("|");
		console.log(relation_1);
	} 
	else {
		var relation_1 = null
	}
	if (feature.properties.relation_2 != null) {var relation_2 = feature.properties.relation_2.split("|");} else {var relation_2 = null}
	if (feature.properties.relation_3 != null) {var relation_3 = feature.properties.relation_3.split("|");} else {var relation_3 = null}
	if (feature.properties.relation_4 != null) {var relation_4 = feature.properties.relation_4.split("|");} else {var relation_4 = null} 
	if (feature.properties.relation_5 != null) {var relation_5 = feature.properties.relation_5.split("|");} else {var relation_5 = null}
	if (feature.properties.relation_6 != null) {var relation_6 = feature.properties.relation_6.split("|");} else {var relation_6 = null}
	if (feature.properties.relation_7 != null) {var relation_7 = feature.properties.relation_7.split("|");} else {var relation_7 = null}


	console.log("Changing innerHTML of Popup");
	// Then, assign them to their spots in the innerHTML accordingly
	document.getElementById("my-popup-title").innerHTML = '<h2 id="specific-image-title">' + name + '</h2>';
	document.getElementById("my-popup-subtitle").innerHTML = '<h3 id="specific-image-subtitle">  </h2>';
	document.getElementById("my-popup-image").innerHTML = '<img id = "specific-image" src = "' + pictureURL + '" alt="' + name + '">';
	document.getElementById("my-popup-tombstone").innerHTML = '<p>' + tombstone + '<br /> </p>';
	document.getElementById('im1').alt = relation_1[2];
	document.getElementById('im1').src = relation_1[6];
	document.getElementById('im2').alt = relation_2[2];
	document.getElementById('im2').src = relation_2[6];
	document.getElementById('im3').alt = relation_3[2];
	document.getElementById('im3').src = relation_3[6];
	document.getElementById('im4').alt = relation_4[2];
	document.getElementById('im4').src = relation_4[6];
	document.getElementById('im5').alt = relation_5[2];
	document.getElementById('im5').src = relation_5[6];
	if (relation_6 != null) {
		document.getElementById('im6').alt = relation_6[2];
		document.getElementById('im6').src = relation_6[6];
	}
	if (relation_7 != null) {
		document.getElementById('im7').alt = relation_7[2];
		document.getElementById('im7').src = relation_7[6];
	}
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
		document.getElementById("my-popup-tombstone").innerHTML = '<p>  <br /> </p>';
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
// TODO: Write helper functions and iterative code for gallery images and data reading. The gallery functions need to be able to interact with the data, so it 
// might be a good idea to create getter/setter functions with return statements to allow json data to be accessed outside of functions which take it in as a parameter.
