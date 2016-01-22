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

<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=visualization"></script>
<div id="label"></div>      
<div id="chartContainer1"></div>
<div id="selected"></div>
<div id="map" style="border:6px solid #E4E4E4;"></div>
<div id="histogram"></div>
<script src="{{ site.baseurl }}/assets/js/waterequity.js"></script>

#Some interesting points

coming soon... (waiting for some update on the data)


#Data source

The data shown in the visualization is in open access. More details on the exact provenance soon...
