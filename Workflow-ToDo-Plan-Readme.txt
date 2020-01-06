- Project to-do list on Todoist (app and website)

Next Steps (Current Point):
1.) Figure out how to get proper popups from points, same as in the previous iteration of site
	- Current goals:
		+ Properly fullscreen popup (get rid of weird margins)
		+ Re-align text so that it looks better fullscreen
		+ Add picture links into json file, and other stuff, etc.
		+ Code a slide-out of the title when a popup comes up, and a slide-in when it's exited
2.) Import all the data points from the previous iteration of site
3.) Test how site works with any .json file
	- Spread out points
	- Heavy load of points

Planned Features:
1.) Popups include more pictures of painting and location
	- May or may not have their own text
		- if (picture.hastext())
			painting.text = picturetext
	- Accessable through a scrollbar at bottom of popup (see wireframe drawing)
2.) Popups include adjacent points
	- Accessable through a scrollbar at bottom of popup (see wireframe drawing)
	- Changing paintings in popup changes point opened on map as well
3.) Edit popup design
	- BG Transparency
	- Clarity
		- Exit button, text visibility, etc.
	- Positioning
	- Whole Screen vs. Small Popup
		- May require bootstrap
4.) Edit point / cluster design
	- Clarity
	- Nicer colors
	- Background polygons
5.) Home Page / Landing Screen
	- Home page with info about the project(s) to access the map from
	- May require bootstrap
6.) Improve quality of maps, overlays, etc.