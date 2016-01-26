---
title: Water consumption in California
excerpt_separator: <!--more-->
---


<p class="lead">Our project (<a href="#authors">see authors</a>) explores the multi-dimensional dynamics of rationing and drought in California. Inspired by similar work done by the <a href="http://www2.pacinst.org/gpcd/map.html">Pacific Institute</a>, we use a variety of data sources (Census and California Water Resources Board) to extend earlier efforts and build a more holistic approach. Our parallel coordinates visualization, map, and time series below explore drought and rationing dynamics across the state.</p>

<!--more-->

<p id="authors"><strong>Authors</strong>: Diego Ponce de Leon Barido, Karina Cucchi, Benjamin Fildier, Albert Yuen, me. Original project can be found at <a href="http://waterequity.org/">waterequity.org</a></p>

#Introduction
*written by Diego Ponce de Leon Barido*

Since 2011 many areas across California have experienced their drighest years on record, with conditions barely improving, and in some cases worsening, since then. Reservoirs and snowpack water content have recorded some of the lowest measurements ever recorded, with users (individuals, towns and cities) using groundwater to buffer the potentially devastating effects of the drought. Among other strategies, rationing has been one of they key strategies that the state has adopted to better manage its water resources. April 1st 2015 marked the first day in California's history when mandatory water reductions were instated state wide. By using an [executive order](http://www.nytimes.com/2015/04/02/us/california-imposes-first-ever-water-restrictions-to-deal-with-drought.html), Governor Brown directed the State Water Resources Control Board to impose a 25% reduction on California's 400 local water supply agencies, which serve 90% of California residents. Since then, local agencies have been responsible for allocating restrictions to reduce water consumption and monitor compliance.

A variety of research organizations and media outlets have begun exploring the equity considerations of the drought, but the analysis is often [one dimensional](http://www.nytimes.com/2015/04/27/us/drought-widens-economic-divide-for-californians.html). The focus is largely on water consumption per capita, and leaves out other important societal factors such as spatial distribution, weather, drought related climate variables, economic sectors, race, localized income inequality, household size, and income per capita, among other things. More recent information has also highlighted brewing tension between neighbors regarding water restrictions and mandates. The drought has elucidated large inequalities, where high-income communities [guzzle water and poorer ones conserve water by necessity](http://www.nytimes.com/2015/04/27/us/drought-widens-economic-divide-for-californians.html). While water restrictions have attempted to address these inequities by imposing tighter conservation standards on large consumers, [high-income households](http://www.latimes.com/local/california/la-me-el-monte-drought-20150801-story.html) still consume much more water than low-income households, [even after a 30% reduction in their water consumption](http://www.latimes.com/local/lanow/la-me-ln-wealthy-cities-lag-in-conservation-20150404-story.html). Starting 2015, [and after complaints from several towns across California](http://www.latimes.com/science/la-me-water-regs-20151222-story.html), restrictions will be lowered (22%) and will take into account a number of other factors (regional climate, water source, and local population growth) when setting water saving targets. Although an effort has begun to include other factors, it is hard to understand and visualize how all these dynamics relate to each other.

#Under the hood of the visualization
*my part*

What are parallel coordinates ? [*Wikipedia*](https://en.wikipedia.org/wiki/Parallel_coordinates):
> Parallel coordinates is a common way of visualizing high-dimensional geometry and analyzing multivariate data.
In my view, parallel coordinates (PCs) enable meaningful comparison by considering more dimensions (going further than just position, size, shape and color). It helps understanding your data by enabling to rearrange the dimensions and visually find patterns in the dataset. For further details, consider watching [this video](https://www.youtube.com/watch?v=ypc7Ul9LkxA) from the openVis Conf 2013 by Kai Chang.

Beyond studying how water resources are shared in California, this work aims to create a tool for a broader data analysis. The javascript behind the scene is generic enough to accept any dataset in a .csv file. The visualization consist of parallel coordinates, a map and a distribution graph for each dimension. However, this disposition is flexible, if time-series are more representative they could replace the map (see [Power consumption in California](#) for the use of time-series). The project is available on [github](https://github.com/waterequity/waterequity.github.io.git), replace "data.csv" with your own data including "name", "lat", "long" and any number of dimensions.

#The visualization
<style type="text/css">
svg {
  font: 10px sans-serif;
}

.background path {
  fill: none;
  stroke: #ddd;
  shape-rendering: crispEdges;
}

.foreground path {
  fill: none;
  stroke: steelblue;
}

.brush .extent {
  fill-opacity: .3;
  stroke: #fff;
  shape-rendering: crispEdges;
}

.axis line,
.axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis text {
  text-shadow: 0 1px 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, -1px 0 0 #fff;
  cursor: move;
}

#map {
  width: 600px;
  height: 600px;
}


#floating-panel {
  position: absolute;
  top: 10px;
  left: 25%;
  z-index: 5;
  background-color: #fff;
  padding: 5px;
  border: 1px solid #999;
  text-align: center;
  font-family: 'Roboto','sans-serif';
  line-height: 30px;
  padding-left: 10px;
}

#floating-panel {
  background-color: #fff;
  border: 1px solid #999;
  left: 25%;
  padding: 5px;
  position: absolute;
  top: 10px;
  z-index: 5;
}
</style>
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=visualization"></script>
<div id="label"></div>      
<div id="chartContainer1" style="margin-left: -200px;"></div>
<div id="selected"></div>
<div id="map" style="border:6px solid #E4E4E4;"></div>
<div id="histogram"></div>
<script type="text/javascript">
// Some global scope variables
var csvData;
var map;
var heatmap, binList;
var town = new Array();

// Size of the main container with magins
var margin = {top: 30, right: 10, bottom: 50, left: 10},
    width =  1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
//parseInt(d3.select('#mainContainer').style('width'))

// Scale to place the dimensions
var x = d3.scale.ordinal().rangePoints([0, width], 1);
// Scale for each of the dimensions
var  y = {};
// Line 
var line = d3.svg.line();
// Dimension axis
var axis = d3.svg.axis().orient("left");
// Variable holding a subgroup of lines in gray
var background;
// Variable holding a subgroup of lines in color
var foreground;
// Color scale
var color = d3.scale.category20();

// Add a SVG which will contain the parallel coordinates
var svg = d3.select("#chartContainer1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add a SVG to hold the selection text (--> replace text with a table under parallel coord.)
var svgtext = d3.select("#label").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", 50)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add a scale to show the bar
var xSelected = d3.scale.ordinal().range([0, width/2]).domain([0, 100]);
// Add a space to show the percentage of data selected 
// dataSelectedInit();

// Add a text hint
svg.append("text")      
    .attr("y", height + margin.bottom/2 - 5)
    .attr("x", 10)
    .text("Click me!");

// Load the data
d3.csv("{{ site.baseurl }}/assets/data/data.csv", function(error, data) {

  // Creating a new variable to hold the visibility status and colors
  data.forEach(function(d, i) { 
    d.visible = true;
    d.color = color(i);
   });

  // Saving data in a global scope (use outside of d3.csv)
  csvData = data;

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
    // Avoid dimensions with the following names
    return d != "name" &&  d != "visible" && d != "color" && d != "lat" && d !="long" && d != "lat2" && d !="long2" &&
    (y[d] = d3.scale.linear()
    // Get the min and max to scale the domain
        .domain(d3.extent(data, function(p) { return +p[d]; }))
        .range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  // Add colored foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path)
      .style('stroke-width', '1.5')
      .style('stroke', function(d) { return d.color; })
      // Add text when mouseover
      .on("mouseover", function(d){
         svgtext.select("text").remove();
         svgtext.append("text")
        .attr("font-size", '150%')
        .attr("x", '50px')
        .attr("y", '5px')
        .text( function () { return 'Line name: ' + String(d.name); });
      });

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this)
        .call(y[d].brush = d3.svg.brush().y(y[d])
        .on("brush", brush).on("brushend", brushend)); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  // Add a rectange to toggle dimensions
  g.append("rect")
    .attr("class", "rectLegend")
    .attr("x", -15)
    .attr("y", height + margin.bottom/2)
    .attr("width", 30)
    .attr("height", 20)
    .attr("stroke", "#000000")
    .attr("fill", "#F1F1F2")
    .on("click", histoUpdate);

  initialize();
});

function path(d) {
  return line(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  // Get all the active brushes (the one that are not empty)
  var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); });
  // Get the min and max covered by active brushes
  var extents = actives.map(function(p) { return y[p].brush.extent(); });

  // For all the foreground lines change the display property
  foreground.style("display", function(d) {
    // True only if every active brush cross the line
    bool = actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
    
    if (bool == "none"){
      d.visible = false;
    }
    else {
      d.visible = true;
    }
    return bool;
  }); 
}

// Once the brush event is finished (mouse released)
function brushend() {
  mapUpdate();
}

function mapUpdate() {
  // Empty town array
  while(town.length > 0) {
        town.pop();
  }

  for (i = 0; i < csvData.length; i++) {
    if (csvData[i].visible) {
      town.push(new google.maps.LatLng(csvData[i].lat, csvData[i].long));
    }
  }

  heatmap.setData(town);
}

function histoUpdate(d) {
  d3.selectAll(".rectLegend")
    .attr("fill", "#F1F1F2");

  d3.select(this)
    .attr("fill", "#99cfff");

}

function dataSelectedInit() {
  // Add a SVG to hold the bar showing the percent of data selected
  var svgSlected = d3.select("#selected").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 50)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add a text hint
  svgSlected.append("text")      
      .attr("y", 5)
      .attr("x", 5)
      .text("Percentage of data selected (%)");

  svgSlected.append("rect")
    .attr("x", 5-1)
    .attr("y", 10-1)
    .attr("width", xSelected(100) + 1)
    .attr("height", 30+1)
    .attr("stroke", "#000000")
    .attr("fill", "##F1F1F2") 

  // svgSlected.append("rect")
  //   .attr("class", "rectPercent")
  //   .attr("x", 5)
  //   .attr("y", 10)
  //   .attr("width", xSelected(70))
  //   .attr("height", 30)
  //   .attr("fill", "##ff751a"); 
}

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: {lat: 36.775, lng: -119.434},
     mapTypeId: google.maps.MapTypeId.TERRAIN,
      panControl: true,
      scrollwheel: false,
      mapTypeControl: false,
      panControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
          style: google.maps.ZoomControlStyle.LARGE,
          position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
      }
  });

  csvData.forEach(function(d){
       town.push(new google.maps.LatLng(d.lat, d.long))
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: town,
    map: map
  });
  
  heatmap.set('radius', 15)
  heatmap.set('opacity', 0.8)
}
</script>

#Some interesting points

coming soon... (waiting for some update on the data)


#Data source

The data shown in the visualization is in open access. More details on the exact provenance soon...