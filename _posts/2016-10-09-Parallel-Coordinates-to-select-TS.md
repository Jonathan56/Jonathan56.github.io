---
title: Parallel Coordinates to select Time-Series
excerpt_separator: <!--more-->
---

Parallel coordinates as a way to select a subset and explore time-series.

<!--more-->

# Usage

On this template you can brush any axis and narrow down a few lines, click on a line
to display its corresponding time-serie on the graph below. Compare multiple time-series
together, you can also zoom in and out by brushing the graph. Reset the zoom by clicking
on "clear" in the lower right corner.

# Demonstration

Note: This dataset was put together to look at Californian net loads, this is an
early version (dimensions are processed to get monthly values).

The data was collected through the [Pyiso API](http://pyiso.readthedocs.org/en/latest/), the data can also be directly fetched on the [CAISO website](http://www.caiso.com/green/renewableswatch.html).

<link rel="stylesheet" href="/assets/css/parallel_coordinates_graph.css">
<script src="/assets/js/pcgraphv1.js" charset="utf-8"></script>

<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<div style="margin-top: 40px;" id="main">
  <div style="margin-left: -250px" id="chartContainer1"></div>
  <div style="margin-left: -200px" id="legend"></div>
  <div style="margin-left: -200px" id="netload"></div>
  <div style="margin-left: -200px" id="load"></div>
  <div style="margin-left: -200px" id="gen"></div>
</div>
<script type="text/javascript">
graph_parallel_coordinates("/assets/data/parallel_caiso.csv");
</script>
