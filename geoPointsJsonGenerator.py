# @AUTHOR: Timophey Korolev
# Python code to read .xlsx (Excel) files and write their contents in a json format organized specifically for mapping on the MAM Spanish Travelers Project website.
# Importing necessary libraries...
import openpyxl
import json
from pathlib import Path

# Creating a function definition to write to the json file
def write_json(data, filename="testPoints.json"):
    with open (filename, "w") as f:
        json.dump(data, f, indent=4)

# Setting the file path to the .xlsx checklist file...
checklistFile = Path('checklist_file2.xlsx')
#print(checklistFile)

# Creating a workbook object to read the file...
wb_obj = openpyxl.load_workbook(checklistFile)
#print(wb_obj)
sheet = wb_obj.active
#print(sheet)

# Iterating through the sheet to get URL / image location values
for row in sheet.iter_rows(max_row=13, max_col=12, min_col=2):
    for cell in row:
        cellName = str(cell)
        if ".B" in cellName: # Column B contains image links / locations
            imgLink = str(cell.value)
            if imgLink == "None":
                imgLink = "No_image_available.svg"
            print(cellName + " : Link : " + imgLink, end="\n")
        if ".D" in cellName: # Column D contains the captions / labels for the images (tombstone)
            tombstone = str(cell.value)
            print(cellName + " : Tombstone : " + tombstone, end="\n")
        if ".G" in cellName: # Column G contains the latitude of the feature
            latitude = cell.value # Should be kept as a double
            print(cellName + " : Latitude : " + str(latitude))
        if ".H" in cellName: # Column H contains the longitude of the feature
            longitude = cell.value # Should be kept as a double
            print(cellName + " : Latitude : " + str(longitude))
        if ".L" in cellName: # Column L contains the name of the feature
            imgName = str(cell.value)
            print(cellName + " : Name : " + imgName)
        if ".J" in cellName: # Column J contains the relations to the feature
            relations = str(cell.value)
            print(cellName + " : Relations : " + relations)
    print("Opening JSON file... \n")
    # Reading through the current JSON file
    with open ("testPoints.json") as json_file:
        data = json.load(json_file)
        temp = data["features"]
        y = {"type": "Feature", "geometry": {"type": "Point", "coordinates": [latitude, longitude]}, "properties": {"imgURL": imgLink, "name": imgName, "tombstone": tombstone, "relations": relations}}
        temp.append(y)
    write_json(data)
