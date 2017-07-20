---
title: Parallel Coordinates to select Time-Series
excerpt_separator:
---

<p class="lead">This post aims to provide a fast look into Californian's net load</p>

The data is collected through the [Pyiso API](http://pyiso.readthedocs.org/en/latest/), the data can also be fetched on [CAISO](http://www.caiso.com/green/renewableswatch.html)

## How is power generation evolving ?
A couple of plots from making the parallel coordinate plot.

<link rel="stylesheet" href="/assets/css/parallel_coordinates_graph.css">
<script src="/assets/js/parallel_coordinates_graph.js" charset="utf-8"></script>

<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<div style="margin-top: 40px;" id="main">
  <div style="margin-left: -250px" id="chartContainer1"></div>
  <div style="margin-left: -200px" id="legend"></div>
  <div style="margin-left: -200px" id="netload"></div>
  <div style="margin-left: -200px" id="load"></div>
  <div style="margin-left: -200px" id="gen"></div>
</div>
<script type="text/javascript">
graph_parallel_coordinates("../../../someMoreData/parallel.csv");
</script>
