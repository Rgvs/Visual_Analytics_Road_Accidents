function plot_3d_scatterplot(sample_type) {
var width = 960,
    size = 230,
    padding = 50;

var x = d3.scale.linear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scale.linear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(6).tickFormat(function(d){ return d3.format(".2n")(d); });



var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6).tickFormat(function(d){  return d3.format(".2n")(d); });
var file_name = ""
if (sample_type == 0) file_name = ".static/data/r_3attr_data.csv"; else file_name = ".static/data/s_3attr_data.csv";
d3.csv(file_name, function(error, data) {
  if (error) throw error;

  var domainByAttr = {},
      attr_value = d3.keys(data[0]),
      n = attr_value.length;

  attr_value.forEach(function(trait) {
    domainByAttr[trait] = d3.extent(data, function(d) { return +d[trait]; });
  });

  xAxis.tickSize(size * n);
  yAxis.tickSize(-size * n);

  var brush = d3.svg.brush()
      .x(x)
      .y(y)
      .on("brushstart", brushstart)
      .on("brush", brushmove)
      .on("brushend", brushend);

  var svg = d3.select("body").append("svg")
      .attr("width", size * n + padding)
      .attr("height", size * n + padding)
    .append("g")
      .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

  svg.selectAll(".x.axis")
      .data(attr_value)
    .enter().append("g")
      .attr("class", "x axis")
      .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
      .each(function(d) { x.domain(domainByAttr[d]); d3.select(this).call(xAxis); });

  svg.selectAll(".y.axis")
      .data(attr_value)
    .enter().append("g")
      .attr("class", "y axis")
      .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
      .each(function(d) { y.domain(domainByAttr[d]); d3.select(this).call(yAxis); });

  var cell = svg.selectAll(".cell")
      .data(cross(attr_value, attr_value))
    .enter().append("g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
      .each(plot);

  // Titles for the diagonal.
  cell.filter(function(d) { return d.i === d.j; }).append("text")
      .attr("x", padding)
      .attr("y", padding)
      .attr("dy", "1em")
      .text(function(d) { return d.x; });

  cell.call(brush);

  function plot(p) {
    var cell = d3.select(this);

    x.domain(domainByAttr[p.x]);
    y.domain(domainByAttr[p.y]);

    cell.append("rect")
        .attr("class", "frame")
        .attr("x", padding / 2)
        .attr("y", padding / 2)
        .attr("width", size - padding)
        .attr("height", size - padding);

    cell.selectAll("circle")
        .data(data)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[p.x]); })
        .attr("cy", function(d) { return y(d[p.y]); })
        .attr("r", 4)
        .style("fill", "steelblue");
  }

  var brushCell;

  // Clear the previously-active brush, if any.
  function brushstart(p) {
    if (brushCell !== this) {
      d3.select(brushCell).call(brush.clear());
      x.domain(domainByAttr[p.x]);
      y.domain(domainByAttr[p.y]);
      brushCell = this;
    }
  }

  // Highlight the selected circles.
  function brushmove(p) {
    var be = brush.extent();
    svg.selectAll("circle").classed("hidden", function(d) {
      return be[0][0] > d[p.x] || d[p.x] > be[1][0]
          || be[0][1] > d[p.y] || d[p.y] > be[1][1];
    });
  }

  // If brush empty, select all circles.
  function brushend() {
    if (brush.empty()) svg.selectAll(".hidden").classed("hidden", false);
  }
});

function cross(a, b) {
  var c = [], n = a.length, m = b.length, i, j;
  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
  return c;
}

}
