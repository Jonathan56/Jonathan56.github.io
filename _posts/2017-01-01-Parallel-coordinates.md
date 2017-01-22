---
title: Parallel Coordinates
excerpt_separator: <!--more-->
---

<p class="lead">Playing with parallel coordinates Yaayy!</p>

<!--more-->

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
