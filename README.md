# Aortic valve leaflets generator
A web-based tool to parametrically generate the aortic valve leaflets.
Access the tool [here](http://ahmedhosny.github.io/av-generator/).

## How it works
X, Y and Z coordinates were obtained at 7 locations: the point of coaptation of the leaflets (P0), attachment points at the level of the sinotubular junction (P1-P3) and the basal attachment points for the leaflets (P4-P6). These coordinates are easily measured (in about 5 minutes) by imagers skilled in traditional TAVR measurements. 

Curves are interpolated through these landmark points and the parametric geometry of the leaflets is generated with a consistent thickness of 0.4 mm  (average thickness of uncalcified leaflets is ~ 0.41 mm). The leaflet shape could then be manipulated using sliders to ensure that they properly intersected with the segmented calcified portions of the leaflets. A set of primary controls adjusts the landmark point locations and the free leaflet edges. They are used to align the parametrically generated leaflets with the aortic sinus. A set of secondary controls adjusts isocurves lying on the generated leaflets and are used to align the leaflets with the mineral deposits. 

## Inputs
1. A .csv file containing the 7 fiduciary points as outlined above.
```
The file should be formatted as follows:
P0, -9.462358, -0.20132, 1669.094232
P1, -3.573614, -9.771409, 1674.504326
P2... 
P3...
P4...
P5...
P6...
```
2. A .stl file of the aortic sinus

3. A .stl file of the calcified deposits

## Need help?
Watch this quick [movie](https://youtu.be/6ZdiZdl7wZk) or check out these [instructions](http://ahmedhosny.github.io/av-generator/about.html). Email [me](mailto:ahmed_hosny@dfci.harvard.edu) .


