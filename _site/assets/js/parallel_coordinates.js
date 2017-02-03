function basic_parallel_coordinates(filename) {
  // Some global scope variables
  var csvData;
  var selected_name;

  // Size of the main container with magins
  var margin = {top: 30, right: 10, bottom: 10, left: 10},
      width = parseInt(d3.select('#mainContainer').style('width')) - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

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

  // Add a SVG to hold the selection text
  var svgtext = d3.select("#label")
    .append("g")
    .attr("transform", "translate(" + "0" + "," + "20" + ")");

  svgtext.append("text")
     .text( function () { return 'Line name: no name\n'; });

  var svgSelected = d3.select("#label").append('svg')
    .append("g")
    .attr("transform", "translate(" + "0" + "," + "25" + ")");

  svgSelected.append("text")
    .text( function () { return 'You have selected 100% of the data'; });

  // Load the data
  d3.csv(filename, function(error, data) {

    // Creating a new variable to hold the visibility status and colors
    data.forEach(function(d, i) {
      d.visible = true;
      d.color = color(i);
      d.selected = false;
     });

    // Saving data in a global scope (use outside of function scope)
    csvData = data;

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
      // Avoid dimensions with the following names
      return d != "name" &&  d != "visible" && d != "color" && d != "selected" && d != "lat" && d !="long" && d != "lat2" && d !="long2" &&
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
           d3.select(this).style('stroke-width', '7')
           svgtext.select("text").remove();
           svgtext.append("text")
          .attr("font-size", '150%')
          .text( function () { return 'Line name: ' + String(d.name) + '\n'; });
        })
        .on("mouseout", function(d){
          // Change stroke-width when mouseover
          if (d.selected == false){
            d3.select(this).style('stroke-width', '1.5');
          }
        })
        .on("click", function(d){
          // Append a path on the bottom graphs
          if (d.selected == false){
            d3.select(this).style('stroke-width', '7');
          }
          if (d.selected == true){
            d3.select(this).style('stroke-width', '1.5');
          }
          d.selected = true;
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
        .attr("class", "dimension_text")
        .style("text-anchor", "middle")
        .style('font-size', '14px')
        .attr("y", -9)
        .text(function(d) {
          selected_name = d;
          return d; })
        .on("click", function(d){
          // Reset the size of all the text to the normal one
          d3.selectAll(".dimension_text").style('font-size', '14px')
          // Change text size
          d3.select(this).style('font-size', '20px')

          // update the histogram
          selected_name = this.__data__;
          histogram(this.__data__);
        });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this)
          .call(y[d].brush = d3.svg.brush().y(y[d])
          .on("brush", brush).on("brushend", brushend)); })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    histogram(selected_name);

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
    // update the histogram
    histogram(selected_name);
  }


  function histogram(name){
    var greylist = [];
    var bluelist = [];

    for (i = 0; i < csvData.length; i++) {
      if (csvData[i].visible) {
        bluelist.push(parseFloat(csvData[i][name]));
      }
      greylist.push(parseFloat(csvData[i][name]));
    }

    svgSelected.select("text").remove();
    svgSelected.append("text")
     .text( function () { return 'You have selected ' +
                            String(parseInt(bluelist.length * 100 / greylist.length)) +
                            '%\nof the data'; });

    var data = [
      {
        x: greylist,
        name: "Original data",
        type: 'histogram',
        nbinx: 5,
    	marker: {
        color: 'rgba(148, 142, 142, 0.7)',
    	 }
      },
      {
        x: bluelist,
        name: "Selected data",
        type: 'histogram',
        nbinx: 5,
    	marker: {
        color: 'rgba(255, 139, 3, 0.7)',
    	 }
      }
    ];

    var layout = {
      xaxis: {title: name},
      margin: {t: 20},
      legend: {
      x: 0,
      y: 1.2
      }
    };

    Plotly.newPlot('myDiv', data, layout);
  }
}
