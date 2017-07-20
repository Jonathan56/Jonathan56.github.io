
function graph_parallel_coordinates(first_filename) {
  // Size of the main container with margins
  var margin = {top: 30, right: 50, bottom: 70, left: 100},
      width = 1200 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // Scale to place the dimensions
  var x = d3.scale.ordinal().rangePoints([0, width], 1);
  // Scale for each of the dimensions
  var  y = {};
  // Line
  var line = d3.svg.line();
  // Dimension axis
  var axis = d3.svg.axis().orient("left").tickFormat(d3.format("d"));
  // Variable holding a subgroup of lines in gray
  var background;
  // Variable holding a subgroup of lines in color
  var foreground;
  // Color scale
  var color = d3.scale.category20();

  // Add a SVG which will contain the parallel coordinates
  var svg = d3.select("#chartContainer1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + 20)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add a SVG which will contain the legend
  var svgLegend = d3.select("#chartContainer1").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", 50)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  legend = [];

  ///////////////////////////////////////////////////////////////
  var count = 0
  var finalColor = d3.scale.category10();
  var netloadCurve = [];

  // a parser for the date
  var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
  var colorNetload = d3.scale.category20();

  // a scale for the time
  var xLoadGen = d3.time.scale().nice().range([0, width])
  .domain([parseDate('2015-01-01 00:00:00'), parseDate('2015-01-31 23:00:00')]);

  //a scale for netload y axis
  var minNetload = 999999999999;
  var maxNetload = -100;
  var netloadScale = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis().ticks(10).scale(xLoadGen)
      .orient("bottom");

  // the proper y axis based on the scale
  var yAxis0 = d3.svg.axis().ticks(5).scale(netloadScale)
      .orient("left");

  var lineNetload = d3.svg.line()
      .interpolate("basis")
      .x(function(d) { return xLoadGen(d.time); })
      .y(function(d) { return netloadScale(d.data); });

  // Create a brush to zoom in on the graph
  var brushLoadGen = d3.svg.brush()
      .x(xLoadGen)
      .on("brushend", brushend);

  // Add an SVG for the netload historical data
  var svgNetload = d3.select("#netload").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svgNetload.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svgNetload.append("g")
      .attr("class", "yNetload")
      .call(yAxis0)
      .append("g")
      .attr("transform", "translate(-60, -10)")
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Net load (GW)");

  // Append the brush
  svgNetload.append("g")
      .attr("class", "brush1")
      .call(brushLoadGen)
    .selectAll('rect')
      .attr('height', height);

  // append clip path for lines plotted, hiding those part out of bounds
  svgNetload.append("defs")
      .append("clipPath")
      .attr("id", "clipLoad")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

  // Load the data
  d3.csv(first_filename, function(error, data) {

    // Creating a new variable to hold the visibility status and colors
    data.forEach(function(d, i) {
      d.year = String(d.year)
      // d.loadE = d.loadE / 1000
      // d.loadPmax = d.loadPmax / 1000
      // d.solarE = d.solarE / 1000
      // d.solarPmax = d.solarPmax / 1000
      // d.windE = d.windE / 1000
      // d.windPmax = d.windPmax / 1000
      // d.netLoadmin = d.netLoadmin / 1000
      d.visible = true;
      d.color = color(i);
     });

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
      // Avoid dimensions with the following names
      return d != "visible" && d != "color" && (y[d] = d3.scale.linear()
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
        .on("mouseover", function(d){
          // Change stroke-width when mouseover
          d3.select(this).style('stroke-width', '7')
        })
        .on("mouseout", function(d){
          // Change stroke-width when mouseover
          d3.select(this).style('stroke-width', '1.5')
        })
        .on("click", function(d){
          // Append a path on the bottom graphs
          add_curve(d.year, d.month)
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
          .on("brush", brush)); })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
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

  function add_curve(year, month){
    // Get filename
    filename = '/assets/data/csv_result/' + String(year) + '-' + String(month) + '.csv';
    console.log(filename);

    // Load the data
    d3.csv(filename, function(error, data) {
      if (error) return console.warn(error);
      // Parse the date
      data.forEach(function(d, i) {
        a = d.time.slice(8, d.time.length);
        d.time = '2015-01-' + a;
        d.time = parseDate(d.time);
        d.solar = parseFloat(d.solar) / 1000;
        d.load = parseFloat(d.load) / 1000;
        d.wind = parseFloat(d.wind) / 1000;
        d.netload = d.load - d.solar - d.wind;
        // d.time.month = 1;  // every data is set in January 2015
        // d.time.year = 2015;
      });

      colorNetload.domain(['netload']);

      netloadData = colorNetload.domain().map(function(name) {
          return {
              name: name,
              label: String(year) + '-' + String(month) + ' ' + name,
              values: data.map(function(d) {
                  return {time: d.time, data: +d[name]};
              })
          };
      });

      // Find the min and max
      tempMin = d3.min(data, function(d){ return d.netload});
      tempMax = d3.max(data, function(d){ return d.netload});

      // Check against current ymin and ymax, update if necessary
      if (tempMin < minNetload){
        minNetload = tempMin;
      }

      if (tempMax > maxNetload){
        maxNetload = tempMax;
      }

      // Update scale
      netloadScale.domain([minNetload, maxNetload]);
      svgNetload.select(".yNetload")
          .call(yAxis0);

      // Draw path
      classString = ".netloadCurve" + String(count);
      netloadCurve.push(svgNetload.selectAll(classString)
                      .data(netloadData)
                      .enter().append("g")
                      .attr("class", "netloadCurve"));

      // in each group append a path generator for lines and give it the bounded data
      netloadCurve[count].append("path")
          .attr("class", "line")
          .attr("clip-path", "url(#clipLoad)")
          .attr("d", function(d) { return lineNetload(d.values); })
          .style("stroke", function(d) { return finalColor(count); });

      // Append legend with a date
      append_legend(year, month, finalColor(count));
      count = count + 1;

    });

  }

  function append_legend(year, month, color){
    // Append the legend list
    legend.push({'label': String(month) + '-' + String(year), 'color': color})

    // Remove the list
    d3.select("svgLegend").remove();

    // Draw each legend in the list
    legend.forEach(function(d, i) {
      svgLegend.append('text')
        .attr("y", 10)
        .attr("x", i*100)
        .text(d.label)
        .style("fill", d.color)
    });
  }

  function reset_all(){
    // Select SVGs and remove all
  }

  function brushend() {
    get_button = d3.select(".clear-button");
    if(get_button.empty() === true) {
      clear_button = svgNetload.append('text')
        .attr("y", height)
        .attr("x", width + 10)
        .attr("class", "clear-button")
        .text("Clear Brush");
    }

    domain = brushLoadGen.extent();
    xLoadGen.domain(domain);

    transition_data();
    reset_axis();
    d3.select(".brush1").call(brushLoadGen.clear());
    d3.select(".brush2").call(brushLoadGen.clear());

    clear_button.on('click', function(){
      xLoadGen.domain([parseDate('2015-01-01 00:00:00'), parseDate('2015-01-31 23:00:00')]);
      transition_data();
      reset_axis();
      clear_button.remove();
    });
  }

  function transition_data() {
    for (i=0; i<netloadCurve.length; i++) {
      netloadCurve[i].select(".line")
        .transition()
        .attr("d", function(d) { return lineNetload(d.values); });
      }
  }

  function reset_axis() {
    svgNetload.transition().duration(500)
     .select(".x.axis")
     .call(xAxis);
   }
 }
