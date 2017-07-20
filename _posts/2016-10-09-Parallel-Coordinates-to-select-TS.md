---
title: Parallel Coordinates to select Time-Series
excerpt_separator: <!--more-->
---

Parallel coordinates as a way to select a subset of the data to
show a Time-Series for instance.

<!--more-->

# Usage

Same old, but now if you click in a line, the time-serie is displayed on the
graph below.

# Example

Select ...

# Demonstration

The data is collected through the [Pyiso API](http://pyiso.readthedocs.org/en/latest/), the data can also be fetched on the [CAISO website](http://www.caiso.com/green/renewableswatch.html)

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
