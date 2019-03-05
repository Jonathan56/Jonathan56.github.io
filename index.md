---
layout: default
---
<!-- Header -->
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<header class="masthead">
  <h1 class="masthead-title">
    <a href="{{ site.baseurl }}/">{{ site.name }}<span>&#39;s website</span></a>
  </h1>
  <nav class="masthead-nav">
    {% for nav in site.nav %}
    <a href="{{ nav.href }}">{{ nav.name }}</a>
    {% endfor %}
  </nav>
</header>

<!-- Content  -->
<div markdown="1">
!['equation']({{ site.baseurl }}/assets/image/me.jpg){: .align-right width="150px"}
Hi there, my name is Jonathan Coignard. I currently work in California at the
Lawrence Berkeley Lab. I am exploring ideas to organize distributed energy resources on the grid.
You can download my CV **[here]({{ site.baseurl }}/assets/pdf/jonathancoignard.pdf)**.


!['equation']({{ site.baseurl }}/assets/image/equation.svg){:width="800px"}
</div>

<!-- D3.js plot -->
<div id="CVplot"></div>

<!-- Text -->
<div markdown="1">
## Publications

### - 2018 -
{: style="text-align: center;"}
[*Co-simulation Framework for Blockchain Based Market Designs and Grid Simulations*](#)
Jonathan Coignard, Eric Munsing, Jason MacDonald, and Jonathan Mather; PES GM 2018

[*CyDER - A Co-Simulation Platform for Grid Analysis and Planning for High Penetration of Distributed Energy Resources*](#) Jonathan Coignard, Thierry Nouidui, Christoph Gehbauer, Michael Wetter, Jhi-Young Joo, Philip Top, Rafael Rivera Soto, Brian Kelley, Emma Stewart; PES GM 2018

### - 2017 -
{: style="text-align: center;"}
[*Clean Vehicles as an Enabler for a Clean Electricity Grid*](#) Coignard, Jonathan; Saxena, Samveg; Greenblatt, Jeffery; Wang, Dai; Environmental Research Letters.

### - 2016 -
{: style="text-align: center;"}
[*Quantifying electric vehicle battery degradation from driving vs. V2G services*](https://doi.org/10.1016/j.jpowsour.2016.09.116) Dai Wang, S. Saxena, J. Coignard, E. A. Iosifidou and Xiaohong Guan, 2016 IEEE Power and Energy Society General Meeting (PESGM), Boston, MA, 2016, pp. 1-5.

### - 2015 -
{: style="text-align: center;"}
[*EMACOP project: characterising the wave energy resources of hot spots in Brittany for on-shore WEC*]({{ site.baseurl }}/assets/pdf/Michard_etal_EWTEC2015_paper.pdf)
The European Wave and Tidal Energy Conference (2015 EWTEC)

[*EMACOP project: Digital modelling of the waves toward Esquibien’s dam using SWASH*]({{ site.baseurl }}/assets/pdf/Coignard_etal_JNGCGC2014.pdf)
Available in the online journal Paralia. Presented at The National days of Coastal Engineering and Civil Engineering (2014 congress)

## Education
!['UTC']({{ site.baseurl }}/assets/image/UTC_logo.png){:width="350px"}
I have done most of my studies at the [*Technical University of Compiegne*](https://www.utc.fr/en.html) (2010-2015), a French top ranking engineering institution. I have obtained my degree from the urban engineering department, but I have equaly shared my time with the electrical department. Here is my [transcript]({{ site.baseurl }}/assets/pdf/transcript.pdf).

The most influent lecture I had during my studies were «&nbsp;*Renewable energy conversion and management*&nbsp;» «&nbsp;*Power electronics*&nbsp;» «&nbsp;*Electrical machines*&nbsp;» and «&nbsp;Urban management&nbsp;». The design of a small scale wind turbine controller has been one of my biggest academic project ([short report]({{ site.baseurl }}/assets/pdf/Tx_Small_scale_wind_turbine.pdf)).

Through my work at the UTC I obtained recommandation letters from: [Fabrice Locment and Manuela Sechilariu]({{ site.baseurl }}/assets/pdf/1_recommendation_FL.pdf), [Phillipe Sergent]({{ site.baseurl }}/assets/pdf/2_recommendation_CEREMA.pdf) and [Vincent Lanfranchi]({{ site.baseurl }}/assets/pdf/3_recommendation_VL.pdf).

I have also spent a semester of study abroad in Riga (Latvia). Here is a [transcript]({{ site.baseurl }}/assets/pdf/transcript_Riga.jpg) of my semester.

## Work experiences
!['LBNL']({{ site.baseurl }}/assets/image/LBNL_logo.png){:width="350px"}
[Lawrence Berkeley National Laboratory](http://www.lbl.gov/) from 2015 to nowadays, my work is focused on vehicle to grid interactions, and grid reliability.

!['CEREMA']({{ site.baseurl }}/assets/image/cerema_logo.jpg){:width="350px"}
[CEREMA](http://www.cerema.fr/) (Centre For Studies and Expertise on Risks, Environment, Mobility, and Urban and Country planning). I studied the best emplacement to harvest wave's energy at the shore in [Audierne's bay](https://www.google.com/maps/place/Esquibien,+France/@48.019122,-4.6068608,1225z/data=!4m2!3m1!1s0x4816e058cded9379:0x40ca5cd36e56db0). The project involved the use of [SWASH](http://swash.sourceforge.net/) to provide a general basis for describing wave transformations from deep water to a beach, port or harbour. [The study (final report in French)]({{ site.baseurl }}/assets/pdf/internship_CEREMA.pdf) also includes a cost analysis for different devices.

**Powered by Jekyll and Github Page.**
</div>

<!-- Styles to maintain D3.js in the center -->
<style>
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    vertical-align: top;
    overflow: hidden;
}
.svg-content-responsive {
    display: inline-block;
    position: absolute;
    top: 10px;
    left: 0;
}
</style>

<script type="text/javascript">
var width = 600,
    height = 600;

var skill = [
    {'name': 'invisible', 'radius': 50},
    {'name': 'AutoCAD', 'radius': 20},
    {'name': 'SQL', 'radius': 30},
    {'name': 'Modelica', 'radius': 30},
    {'name': 'Opal-RT', 'radius': 40},
    {'name': 'Simulink', 'radius': 40},
    {'name': 'MATLAB', 'radius': 40},
    {'name': 'CymDIST', 'radius': 65},
    {'name': 'PowerFactory', 'radius': 30},
    {'name': 'Latex', 'radius': 50},
    {'name': 'D3.js', 'radius': 30},
    {'name': 'Git', 'radius': 80},
    {'name': 'FMI', 'radius': 50},
    {'name': 'Django', 'radius': 40},
    {'name': 'Flask', 'radius': 60},
    {'name': 'Docker', 'radius': 50},
    {'name': 'PyFMI', 'radius': 70},
    {'name': 'Simpy', 'radius': 50},
    {'name': 'Pyomo', 'radius': 60},
    {'name': 'Ethereum', 'radius': 60},
    {'name': 'Python', 'radius': 100},
];
var coef = 1.1;
var nodes = d3.range(skill.length).map(function(i) {
        return {radius: skill[i]['radius'] / coef, name: skill[i]['name']};
    }),

root = nodes[0];

color = d3.scale.linear().domain([20, 100 / coef])
  .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#cceeff"), d3.rgb('#ffa366')]);

root.radius = 0;
root.fixed = true;

var force = d3.layout.force()
    .gravity(0.05)
    .charge(function(d, i) { return i ? 0 : -1000; })
    .nodes(nodes)
    .size([width, height]);

var svg = d3.select("#CVplot")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 " + width + " " + height)
   //class to make it responsive
   .classed("svg-content-responsive", true);

force.start();

groupe = svg.selectAll("circle")
    .data(nodes.slice(1))
  .enter().append("g").attr("class", "node");

groupe.append("circle")
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d, i) { return color(d.radius); });

groupe.append("text")
    .attr("text-anchor", "middle")
    .text(function(d) {return d.name})
    // .attr({x: 0, y: 0})

force.on("tick", function(e) {
  var q = d3.geom.quadtree(nodes),
      i = 0,
      n = nodes.length;

  while (++i < n) q.visit(collide(nodes[i]));

  svg.selectAll("circle")
      .attr("cx", function(d) { return d.x = Math.max(100, Math.min(width - 100, d.x)); })
      .attr("cy", function(d) { return d.y = Math.max(100, Math.min(height - 100, d.y)); });
  svg.selectAll("text")
    .attr("x", function (d) {return d.x;})
    .attr("y", function (d) {return d.y;});
});

svg.on("mousemove", function() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
});

function collide(node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

function resize() {
    width = window.innerWidth/2, height = window.innerHeight;
    height = 650;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
}
</script>
