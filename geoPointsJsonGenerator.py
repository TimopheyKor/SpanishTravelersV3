# @AUTHOR: Timophey Korolev
# Python code to read .xlsx (Excel) files and write their contents in a json format organized specifically for mapping on the MAM Spanish Travelers Project website.
# Importing necessary libraries...
import openpyxl
import json
from pathlib import Path

I_TOMBSTONE = 0
I_DESCRIPTION = 1
I_IMAGE_URL = 2
MINIMUM_RELATIONS = 3
CELLNAME_ID_POS = slice(17, 19)

# Setting the file path to the .xlsx checklist file...
checklistFile = Path("Map_Points_Spreadsheet.xlsx")

# Creating a workbook object to read the file...
wb_obj = openpyxl.load_workbook(checklistFile)
sheet = wb_obj.active

# Creating the beginning of the json file
data = {}                          # Container Dictionary
data["type"] = "FeatureCollection" # JSON Type
data["features"] = []              # Empty Feature List

#TODO Create helper function to process the information in a sincle cell of the .xlsx file, converting it to usable variables.
# def processCell(cellID):

# Helper function to take in one row of data from the .xlsx file and output a JSON feature.
def appendData(longitude, latitude, imageArray):
    return {
        "type": "feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                longitude,
                latitude
            ]
        },
        "properties": {
            "images": imageArray
        }
    }

# Iterating through the sheet to get URL / image location values
for row in sheet.iter_rows(max_row=13, max_col=15, min_row=2, min_col=2):
    # Temporary variables to hold and create image objects.
    tempImageArray = []
    tempImageObject = {}
    for cell in row:
        # Type casting the cell name to a string.
        # Narrow the string down to the characters used to identify the cell.
        cellName = str(cell)
        cellName = cellName[CELLNAME_ID_POS]
        # Column B contains the URL of the main image
        if ".B" in cellName:
            imgLink = str(cell.value)
            if imgLink == "None":
                imgLink = "No_image_available.svg"
            tempImageObject["imgURL"] = imgLink
        # Column C contains the tombstone for the main image
        if ".C" in cellName:
            tombstone = str(cell.value)
            tempImageObject["tombstone"] = tombstone
            tempImageArray.append(tempImageObject)
            tempImageObject = {} # Clear temp object after creating main image
        # Column F contains the latitude of the feature
        if ".F" in cellName:
            latitude = cell.value
        # Column G contains the longitude of the feature
        if ".G" in cellName:
            longitude = cell.value
        # Columns containing related images
        if cellName in ".I.J.K.L.M.N.O":
            relation = str(cell.value)
            # Split the relation image data by the separating |'s used in the .xlsx file
            relationArray = relation.split("|") 
            # To prevent OOB errors:
            # This is to ensure that at least the three required fields are in the array.
            if len(relationArray) >= MINIMUM_RELATIONS:
                tempImageObject["imgURL"]      = relationArray[I_IMAGE_URL]
                tempImageObject["tombstone"]   = relationArray[I_TOMBSTONE]
                tempImageObject["description"] = relationArray[I_DESCRIPTION]
                tempImageArray.append(tempImageObject)
            tempImageObject = {} # Clear temp object after creating related image
    
    # Appending the data found in this row to the data dict...
    obj = appendData(longitude, latitude, tempImageArray)
    data["features"].append(obj)

# Writing the collected data to a json file
with open("Map_Points_Data.json", "w+") as outfile:
    json.dump(data, outfile, indent=4)