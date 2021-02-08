/* The Spanish Travelers Project : Artist Travelers
Artist Travelers is a collaboration between the Milwaukee Art Museum's Americans in Spain exhibition and Marquette University's Spanish Travelers project.
Author: Timophey Korolev
Email: timophey.korolev@marquette.edu, timopheykor@gmail.com
Libraries: jQuery, Bootstrap, Leaflet, Esri
The general structure of this JS is learned from an example of a similar project, the Boyd Map.
The design is made in accordance with MAM guidelines.
*/

//TODO: Separate the JS code into a collection of files with a main that executes everything
// Declare general variables to store the Leaflet map and the esri basemap
var spainMap;
var esriBase;

// Programming constants
const MAIN_IMAGE = 0;
const POPUP_INFO_PADDING = 10;
// const prevQuote = document.querySelector('#qScrollBtnLeft');
// const nextQuote = document.querySelector('#qScrollBtnRight');

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
var spainTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/bd9d2250-587c-4447-b942-f322e65be0d1/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var granadaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/71cac88f-c3e4-4fcf-a7eb-c49aee6ca935/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var alhambraTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/5e33a9ca-c3b1-4aea-90d9-1f061d12c31d/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'None',
		crossOrigin: true
	});
var sevillaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/d00a1774-8be9-4cee-9de2-a38eed61bddc/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var toledoTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/13537747-45f5-41f2-8c5d-5d61f107b9f3/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var segoviaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/43253aa7-95e5-4dbc-9bf1-df82f9b97d1c/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var cordobaTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/b09e91c8-f84e-4779-886f-f85759e0b7c0/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var alicanteTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/d39dcfaa-af43-4dfe-9993-ffe7e467e2c0/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
var balearicIslandsTileLayer = L.tileLayer(
	'https://api.maptiler.com/tiles/0be2d66e-fd95-4e13-98e7-553bf7083fdc/{z}/{x}/{y}.png?key=VQGDLzTLM54Idfavr6jT',
	{
		attribution: 'Rendered with <a href="https://www.maptiler.com/desktop/">MapTiler Desktop</a>',
		crossOrigin: true
	});
spainTileLayer.addTo(spainMap);
granadaTileLayer.addTo(spainMap);
alhambraTileLayer.addTo(spainMap);
segoviaTileLayer.addTo(spainMap);
sevillaTileLayer.addTo(spainMap);
toledoTileLayer.addTo(spainMap);
cordobaTileLayer.addTo(spainMap);
alicanteTileLayer.addTo(spainMap);
balearicIslandsTileLayer.addTo(spainMap);
var overlayMaps = {
	"Spain" : spainTileLayer,
	"Granada" : granadaTileLayer,
	"Alhambra" : alhambraTileLayer,
	"Toledo" : toledoTileLayer,
	"Segovia" : segoviaTileLayer,
	"Sevilla" : sevillaTileLayer,
	"Cordoba" : cordobaTileLayer,
	"Alicante" : alicanteTileLayer,
	"Balearic Islands": balearicIslandsTileLayer
};
// Adding a layer control box
L.control.layers(null, overlayMaps).addTo(spainMap);

// Importing a .json file, which contains data on exhibition peicces to be displayed on the site, and using the markerCluster plugin to create interactive points on the map
$.ajax("https://raw.githubusercontent.com/TimopheyKor/SpanishTravelersV3/master/Map_Points_Data.json", {
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
	document.getElementById("return-to-map-btn").style.display = "block";
}
function closePopup() {
	document.getElementById("my-popup").style.height = "0";
	document.querySelector('.gallery-slide').innerHTML = "";
	document.getElementById("return-to-map-btn").style.display = "none";
	counter = 0;
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
	console.log("getPopupContent() called:")
	// Get the list of images for the popup gallery from the .json file
	var imageArray = feature.properties.images;
	var popupTitle = feature.properties.name;
	console.log("=>Retrieved popupTitle and imageArray")
	console.log(popupTitle, imageArray)
	// Populate the popup gallery with the images from the imageArray
	createGallery(popupTitle, imageArray);
	// Select the first image in the array to be injected into HTML when the popup opens
	//selectImage(galleryImages[0], imageArray[0].imgURL, 0);
	selectImage(galleryImages[MAIN_IMAGE], imageArray[MAIN_IMAGE].imgURL, imageArray[MAIN_IMAGE].tombstone, imageArray[MAIN_IMAGE].description);
	// Add an event listener to all the images in the gallery so that they'll call selectImage() on click
	activateImageSelection(galleryImages, imageArray);
	// Check to see if the description goes out of bounds of the popupinfo div
}

//TODO: Create a helper function that goes through all the images of a feature and creates a gallery out of them
function createGallery(popupTitle, imageArray){
	console.log("=>createGallery() called:")
	var imageGallery = document.querySelector('.gallery-slide');
	var titleField = document.getElementById("my-popup-title");
	titleField.innerHTML = '<h2>' + popupTitle + '</h2>';
	var galleryLength = imageArray.length;
	var i;
	console.log("==>Populating images:")
	for (i = 0; i < galleryLength; i++){
		var imageURL = imageArray[i].imgURL;
		var tombstone = imageArray[i].tombstone;
		var imageEntry = document.createElement("img")
		imageEntry.src = imageURL;
		imageEntry.className = "gallery-image"
		imageEntry.title = i.toString();
		imageGallery.appendChild(imageEntry)
		console.log("===>Appended gallery image " + i)
	}
	// Updating variables needed for interactive gallery
	galleryImages = document.querySelectorAll('.gallery-slide img')
	console.log("==>Created galleryImages array:")
	console.log(galleryImages)
	size = 400;
	counter = 0;
	gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
}

//Functions for making the main image full-screen when it's clicked
function focusOnImage() {
	var imageDiv = document.getElementById("my-popup-image");
	var image = document.getElementById("specific-image");
	if (imageDiv.style.height == "100vh") {
		console.log("Closing condition activated");
		closeImage();
	} else {
		imageDiv.style.backgroundColor = "rgba(0, 0, 0, 0.9)"
		imageDiv.style.height = "100vh";
		imageDiv.style.width =  "100vw";
		imageDiv.style.top = "0";
		imageDiv.style.left = "0";
		imageDiv.style.top = "0";
		imageDiv.style.left = "0";
		imageDiv.style.zIndex = "1";
		imageDiv.style.padding = "20px";
		imageDiv.requestFullscreen();
		image.style.height = "100%";
		image.style.width = "auto";
	}
}

function closeImage() {
	var imageDiv = document.getElementById("my-popup-image");
	var image = document.getElementById("specific-image");
	imageDiv.style.backgroundColor = "rgba(0, 0, 0, 0)"
	imageDiv.style.height = "";
	imageDiv.style.width =  "";
	imageDiv.style.top = "80px";
	imageDiv.style.left = "40px";
	imageDiv.style.right = "50vw";
	imageDiv.style.bottom = "40px";
	imageDiv.style.zIndex = "0";
	imageDiv.style.padding = "0";
	document.exitFullscreen();
	image.style.height = "100%";
	image.style.width = "100%";
}

// Making sure that if the user presses escape to close instead of clicking again, it closes
document.addEventListener("keyup", function(event) {
	var x = event.code;
	console.log(x);
	if (x == "Escape") {
		console.log("escape pressed");
		if (document.getElementById("my-popup-image").style.height == "100vh") {
			closeImage();
		}
	}
})

//Functions controlling a button that appears when text is out of bounds, which enables scrolling when clicked.
function activateReadMoreButton() {
	var readMoreButton = document.querySelector(".read-more-button");
	readMoreButton.style.display = "block";
	readMoreButton.disabled = false;
}

function disableReadMoreButton() {
	var readMoreButton = document.querySelector(".read-more-button");
	readMoreButton.style.display = "none";
	readMoreButton.disabled = true;
}

function enableScroll() {
	var popupInfo = document.getElementById("my-popup-info");
	var descriptionDiv = document.getElementById("my-popup-description");
	popupInfo.style.overflow = "scroll";
	descriptionDiv.scrollIntoView({behavior: "smooth", block: "end"});
	$("#my-popup-info").removeClass('stop-scrolling');
	disableReadMoreButton()
}

function disabeScroll() {
	var popupInfo = document.getElementById("my-popup-info");
	popupInfo.style.overflow = "hidden";
	$("#my-popup-info").addClass('stop-scrolling');
}

function checkOverflow() {
	var popupInfo = document.getElementById("my-popup-info");
	var tombstoneDiv = document.getElementById("my-popup-tombstone");
	var titleDiv = document.getElementById("my-popup-title");
	var descriptionDiv = document.getElementById("my-popup-description");
	var dividers = document.querySelector('.solid').getBoundingClientRect();
	var popupInfoBound = popupInfo.getBoundingClientRect();
	console.log((descriptionDiv.scrollHeight + tombstoneDiv.scrollHeight + titleDiv.scrollHeight + (dividers.height*2) + (POPUP_INFO_PADDING*10)), popupInfoBound.height);
	if ((descriptionDiv.scrollHeight + tombstoneDiv.scrollHeight + titleDiv.scrollHeight + (dividers.height*2) + (POPUP_INFO_PADDING*10)) > popupInfoBound.height) {
		console.log("Description out of bounds!");
		return true;
	}
	return false;
}

//TODO: Create image objects to consolidate all the messy data in the selectImage() function into one var per image
function selectImage(clickedImage, imgURL, tombstone, description) {
	console.log("=>selectImage called on image:")
	// Get the HTML fields which contain the image, tombstone, and description
	var mainImageField = document.getElementById("my-popup-image");
	var tombstoneField = document.getElementById("my-popup-tombstone");
	var descriptionField = document.getElementById("my-popup-description");
	var titleField = document.getElementById("my-popup-title");
	if (document.getElementById("my-popup").style.height == "100%") {
		titleField.scrollIntoView({behavior: "smooth", block: "end"});
	}
	// Inject the data of the selected image into the HTML fields
	mainImageField.innerHTML = '<img id = "specific-image" src = "' + imgURL + '">'
	tombstoneField.innerHTML = '<p>' + tombstone + '</p>'
	// Checking for images without description data to avoid null error
	if (description == null) {
		description = "";
	} else {
		descriptionField.innerHTML = '<p>' + description + '</p>';
	}
	// Resetting defaults for scrollability
	disabeScroll();
	disableReadMoreButton();
	// 
	if (checkOverflow()) {
		// Activate Read More button if checkOverflow returns true
		activateReadMoreButton();
	} 
}

// function formatTombstone(tombstone, tombstoneField) {
// 	tombstoneLines = tombstone.split("\n")
// 	if (tombstoneLines.length < 3) { // Checks if the tombstone isn't a proper multi-line one
// 		tombstoneField.innerHTML = '<p>' + tombstone + '</p>';
// 	} else {
// 		var lineOne = tombstoneLines[0];
// 		var lineOneSplit = lineOne.split("("); // Splitting the artist's name and their info: ARTIST NAME (INFO)
// 		var artistName = lineOneSplit[0]; // Extracting the artist's name to bold it
// 		var artistInfo = lineOneSplit[1];
// 		var lineTwo = tombstoneLines[1];
// 		var lineTwoSplit = lineTwo.split(",");
// 		var imageName = lineTwoSplit[0]; // Extracting the image's name to italicize it
// 		var lineTwoEnd = ""; // Variable to put the rest of line 2 back together in: this is due to variation in array length
// 		console.log("lineTwoSplit: ", lineTwoSplit);
// 		console.log("lineTwoEnd: ");
// 		var i;
// 		for (i = 1; i < lineTwoSplit.length; i++) { // Starting at position 1, immediately after the image name
// 			console.log(i);
// 			console.log(lineTwoEnd);
// 			lineTwoEnd = lineTwoEnd + ", " + lineTwoSplit[i];
// 		}
// 		console.log("tombstoneLines: ", tombstoneLines);
// 		console.log("tombstoneRemainder: ");
// 		var tombstoneRemainder = ""; // Variable to put the rest of the tombstone back into, undoing the first split, minus the first two lines
// 		for (i = 2; i < tombstoneLines.length; i++) { // Starting at position 2, immediately after line two
// 			console.log(i);
// 			console.log(tombstoneRemainder);
// 			tombstoneRemainder = tombstoneRemainder + "\n" + tombstoneLines[i];
// 		}
// 		tombstoneField.innerHTML = '<p><b>' + artistName + '</b> (' + artistInfo + '<br><i>' + imageName + '</i>' + lineTwoEnd + tombstoneRemainder + '</p>';
// 	}
// }

// function enableQuoteScroll(descriptionArray) {
// 	var descriptionField = document.getElementById("my-popup-description");
// 	nextQuote.style.display = "block";
// 	nextQuote.onclick = function () {
// 		console.log("clicked");
// 		descriptionField.innerHTML = '<p>' + descriptionArray[1] + '</p>'
// 		nextQuote.style.display = "none";
// 		prevQuote.style.display = "block";
// 	};
// 	prevQuote.onclick = function () {
// 		descriptionField.innerHTML = '<p>' + descriptionArray[0] + '</p>'
// 		nextQuote.style.display = "block";
// 		prevQuote.style.display = "none";
// 	};
// }

// function disableQuoteScroll() {
// 	nextQuote.style.display = "none";
// 	nextQuote.onclick = "";
// 	prevQuote.style.display = "none";
// 	prevQuote.onclick = "";
// }

// Helper function that gives each image in the gallery the selectImage() function on click
function  activateImageSelection(galleryImages, imageArray) {
	console.log("=>activateImageSelection() called:")
	var i;
	var tombstoneArray = [];
	var descriptionArray = [];
	for (i = 0; i < galleryImages.length; i++) {
		image = galleryImages[i]
		var imgURL = imageArray[i].imgURL;
		var tombstone = imageArray[i].tombstone;
		tombstoneArray.push(imageArray[i].tombstone);
		descriptionArray.push(imageArray[i].description)
		image.addEventListener('click', function() {
			console.log("==>Added event listener to image " + i + "containing URL " + imgURL + "and tombstone " + tombstone)
			selectImage(image, this.src, tombstoneArray[parseInt(this.title)], descriptionArray[parseInt(this.title)]);
		});
	}
}

// Implementing an interactive gallery
// Setting and initializing necessary variables; galleryImages and size are updated each time a new gallery is created.
const gallerySlide = document.querySelector('.gallery-slide');
var galleryImages;
var size;

const prevBtn = document.querySelector('#prevBtn');
const nextBtn = document.querySelector('#nextBtn');

// Counter for image tracking
var counter = 0;


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
	console.log("slideNext() click registered")
	gallerySlide.style.transition = "transform 0.4s ease-in-out";
	if(counter < (galleryImages.length-2)) {
		counter++;
		gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
		activateBtn(prevBtn);
	} else {
		console.log('Last image reached: no next');
	}
	if(counter == (galleryImages.length-2)){ // Goes one past the final image
		darkenBtn(nextBtn);
	}
}

function slidePrev(){
	console.log("slidePrev() click registered");
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
