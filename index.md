---
layout: header
---

!['Self']({{ site.baseurl }}/assets/image/me.jpg){: .align-right width="250px"}
Après un diplôme en génie des systèmes urbains, et quelques années à Berkeley, Californie. J’atterris à Grenoble pour une thèse sur [le fonctionnement des communautés locales de l’énergie](https://theses.hal.science/tel-03957669/).

En tant que chargé de recherche au CNRS j'interroge : **comment les communautés peuvent se réapproprier les objets techniques liés à l’énergie ?**

Du réseau de distribution électrique à l'électronique, j’étudie la faculté des objets techniques à eux-mêmes faciliter une réappropriation. Mécanicien vélo par ailleurs, j’en ai sous la pédale sans avoir la tête dans le guidon 🚲.

### Mots clés :

<!-- D3.js plot -->
<div id="CVplot"></div>

### Publications :

**[Lien](https://scholar.google.com/citations?user=FIguFYMAAAAJ&hl=en)** vers mon profil Google Scholar.

*Powered with :heart: by Jekyll and Github Page :octocat:.*

<!-- Styles to maintain D3.js in the center -->
<style>
.svg-container {
    display: inline-block;
    position: relative;
    width: 100%;
    padding-bottom: 92%;
    vertical-align: top;
    overflow: hidden;
}
.svg-content-responsive {
    display: inline-block;
    position: absolute;
    top: 0px;
    left: 0;
}
</style>

<script type="text/javascript">
var width = 600,
    height = 500;

var skill = [
    {'name': 'invisible', 'radius': 50},
    <!-- {'name': 'AutoCAD', 'radius': 20}, -->
    {'name': 'Low-tech', 'radius': 50},
    <!-- {'name': 'Modelica', 'radius': 20}, -->
    <!-- {'name': 'Opal-RT', 'radius': 30}, -->
    <!-- {'name': 'Simulink', 'radius': 40}, -->
    {'name': 'Réparabilité', 'radius': 90},
    {'name': 'Énergies', 'radius': 60},
    {'name': 'Gouvernances', 'radius': 80},
    {'name': 'Communautés', 'radius': 75},
    {'name': 'Échelles', 'radius': 65},
    {'name': 'Sobriété', 'radius': 70},
    {'name': 'Réseaux', 'radius': 50},
    {'name': 'Limites', 'radius': 98},
];
var coef = 1;
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
    .style("fill", function(d, i) { return color(d.radius); })
    .attr('stroke','#bab4a8')
    .attr('stroke-width', 1.5);

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
    height = 500;
    svg.attr("width", width).attr("height", height);
    force.size([width, height]).resume();
}
</script>
