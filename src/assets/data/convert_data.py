import json

# Load original JSON file
f = open('./src/assets/data/tempanomaly_4x4grid.json', 'r')
data_original = json.loads(f.read())
f.close()

# Re-organise file in new format
data_new = {}
data_array = []
for coordinate in data_original["tempanomaly"]:
  lat = coordinate["lat"]
  lon = coordinate["lon"]
  data = coordinate["data"]

  # Now, each data point is a dict with latitude, longitude, and data.
  # Data is a dict organised in "year: temperature variation" pairs, for all years between 1880 and 2025.
  years_new = {}

  for year_dict in data:
    key, value = list(year_dict.items())[0]
    years_new[key] = value
  
  data_array.append({
    "lat": lat,
    "lon": lon,
    "data": years_new
  })

# Sort data by latitude (highest to lowest), then longitude (lowest to highest)
# This corresponds to each data point's position on the screen, from top-left to bottom-right.
data_array.sort(
  key=(lambda x: [-x["lat"], x["lon"]])
)

data_new["tempdata"] = data_array

# Write new JSON in new file, keep the old one
f_new = open('./src/assets/data/tempdata.json', 'w')
json.dump(data_new, f_new, indent=4)
f_new.close()