---
title: Parallel Coordinates
excerpt_separator: <!--more-->
published: false
---

Parallel coordinates template to explore CSV data files. Plot
each column of a table as its own dimension.

<!--more-->

# Usage:

  > "Parallel coordinates are a common way of visualizing high-dimensional
  > geometry and analyzing multivariate data." [Wikipedia](https://en.wikipedia.org/wiki/Parallel_coordinates)

The javascript template takes a ".csv" file as an input, with the only
constraint of having a column called "name" to name each line.

!['Table']({{ site.baseurl }}/assets/image/parallel_coord_csv.png)
Table 1 - Data format for the parallel coordinates

D3.js allows for interactive plots. Brush any of the axis to select
certain data points. Observe the sample you have selected using the distribution plot
in the lower right corner. In order to move the distribution plot on a different
axis, click on the axis title (e.g. "sepal length").

# Demonstration:

Select the 16% widest sepal and look at the distribution of petal length.

<!-- ######## Parallel code snipet-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="/assets/js/d3.js" charset="utf-8"></script>
<script src="/assets/js/parallel_coordinates.js" charset="utf-8"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<link rel="stylesheet" href="/assets/css/parallel_coordinates.css">

<div id="mainContainer" style="width: 1000px;">
  <div id="chartContainer1" style="margin-left: -100px;"></div>
  <div id="wrapper" style="clear:both;">
      <div id="first-div" style="margin-left: -100px;">
        <div id="label" style="width: 250px; height: 200px;"></div>
      </div>
      <div id="second-div" >
        <div id="myDiv" style="width: 750px; height: 300px; margin-right: 75px"></div>
      </div>
  </div>
</div>

<script>
basic_parallel_coordinates("/assets/data/data.csv");
</script>
<!-- ######## Parallel code snipet-->
