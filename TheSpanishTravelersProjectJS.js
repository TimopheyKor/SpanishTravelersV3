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
spainTileLayer.addTo(spainMap);
granadaTileLayer.addTo(spainMap);
alhambraTileLayer.addTo(spainMap);
segoviaTileLayer.addTo(spainMap);
sevillaTileLayer.addTo(spainMap);
toledoTileLayer.addTo(spainMap);
cordobaTileLayer.addTo(spainMap);
alicanteTileLayer.addTo(spainMap);
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
}
function closePopup() {
	document.getElementById("my-popup").style.height = "0";
	document.querySelector('.gallery-slide').innerHTML = "";
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
	console.log("=>Retrieved imageArray")
	console.log(imageArray)
	// Populate the popup gallery with the images from the imageArray
	createGallery(imageArray);
	// Select the first image in the array to be injected into HTML when the popup opens
	//selectImage(galleryImages[0], imageArray[0].imgURL, 0);
	selectImage(galleryImages[0], imageArray[0].imgURL, imageArray[0].tombstone);
	// Add an event listener to all the images in the gallery so that they'll call selectImage() on click
	activateImageSelection(galleryImages, imageArray);
}

//TODO: Create a helper function that goes through all the images of a feature and creates a gallery out of them
function createGallery(imageArray){
	console.log("=>createGallery() called:")
	var imageGallery = document.querySelector('.gallery-slide');
	var titleField = document.getElementById("my-popup-title");
	// Temporary search through the tombstone field for the title of the image, will be replaced
	console.log("==>Getting popup title")
	var popupTitle = imageArray[0].tombstone.split('\n');
	console.log(popupTitle);
	popupTitle = popupTitle[1].split(',');
	console.log(popupTitle);
	popupTitle = popupTitle[0];
	console.log(popupTitle);
	// End of temporary title scan
	titleField.innerHTML = '<h1>' + popupTitle + '</h1>';
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
}
// function createGallery(imageArray){
// 	console.log("=>createGallery() called:")
// 	var imageGallery = document.querySelector('.gallery-slide');
// 	var galleryLength = imageArray.length;
// 	var i;
// 	console.log("==>Populating images:")
// 	for (i = 0; i < galleryLength; i++){
// 		var imageURL = imageArray[i].imgURL;
// 		var imageEntry = document.createElement("img")
// 		imageEntry.src = imageURL;
// 		imageEntry.className = "gallery-image"
// 		imageEntry.onclick = ""
// 		imageGallery.appendChild(imageEntry)
// 		console.log("===>Appended gallery image " + i)
// 	}
// 	// Updating variables needed for interactive gallery
// 	galleryImages = document.querySelectorAll('.gallery-slide img')
// 	console.log("==>Created galleryImages array:")
// 	console.log(galleryImages)
// 	size = galleryImages[0].clientWidth * imageWidthOffset;
// 	console.log("==>galleryImages[0] size = " + size)
// }

//TODO: Create image objects to consolidate all the messy data in the selectImage() function into one var per image
function selectImage(clickedImage, imgURL, tombstone, description) {
	// console.log("=>selectImage() called on galleryIndex " + galleryIndex)
	console.log("=>selectImage called on image:")
	// console.log(imageData)
	// Get the HTML fields which contain the image, tombstone, and description
	var mainImageField = document.getElementById("my-popup-image");
	var tombstoneField = document.getElementById("my-popup-tombstone");
	var descriptionField = document.getElementById("my-popup-description");
	// Inject the data of the selected image into the HTML fields
	mainImageField.innerHTML = '<img id = "specific-image" src = "' + imgURL + '">'
	//console.log(mainImageField.innerHTML);
	tombstoneField.innerHTML = '<p>' + tombstone + '</p>';
	// Adding the description for non-main-image items
	if (description == null) {
		description = "";
	}
	descriptionField.innerHTML = '<p>' + description + '</p>';
}

// function selectImage(clickedImage, imageArray, galleryIndex) {
// 	// console.log("=>selectImage() called on galleryIndex " + galleryIndex)
// 	console.log("=>selectImage called on image:")
// 	console.log(imageArray[galleryIndex])
// 	// Get the HTML fields which contain the image, tombstone, and description
// 	var mainImageField = document.getElementById("my-popup-image");
// 	var tombstoneField = document.getElementById("my-popup-tombstone");
// 	var descriptionField = document.getElementById("my-popup-description");
// 	// Inject the data of the selected image into the HTML fields
// 	mainImageField.innerHTML = '<img id = "specific-image" src = "' + imageArray[galleryIndex].imgURL + '">'
// 	//console.log(mainImageField.innerHTML);
// 	tombstoneField.innerHTML = '<p>' + imageArray[galleryIndex].tombstone + '<br /> </p>';
// 	// Darken the selected image in the gallery to show it's selected
// 	clickedImage.style.opacity = 0.5;
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
		if (i == 0) {
			descriptionArray.push(null);
		} else {
			descriptionArray.push(imageArray[i].description)
		}
		image.addEventListener('click', function() {
			console.log("==>Added event listener to image " + i + "containing URL " + imgURL + "and tombstone " + tombstone)
			// selectImage(image, imgURL, tombstone);
			selectImage(image, this.src, tombstoneArray[parseInt(this.title)], descriptionArray[parseInt(this.title)]);
			// Need to add descriptions to the select image function
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
let counter = 0;


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
	if(counter < (galleryImages.length-1)) {
		counter++;
		gallerySlide.style.transform = 'translateX(' + (-size * counter ) + 'px)';
		activateBtn(prevBtn);
	} else {
		console.log('Last image reached: no next');
	}
	if(counter == (galleryImages.length-1)){ // Goes one past the final image
		darkenBtn(nextBtn);
	}
}
//nextBtn.addEventListener('click', slideNext);

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
//prevBtn.addEventListener('click', slidePrev);

// Event listeners for selecting specific images from the gallery
// galleryImages.forEach(image => {
// 	image.addEventListener('click', event => {
// 		// Code to select / swap images when they're clicked
// 	});
// });

// TODO: Implement gallery scalability, probably needs to be done with helper functions that are then used inside of the popup creation functions. 

// TODO: Write helper functions and iterative code for gallery images and data reading. The gallery functions need to be able to interact with the data, so it 
// might be a good idea to create getter/setter functions with return statements to allow json data to be accessed outside of functions which take it in as a parameter.
