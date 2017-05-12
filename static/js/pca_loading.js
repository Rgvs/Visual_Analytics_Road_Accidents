function plot_pca_loading(sample_type) {
var margin = {top: 50, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scale.ordinal().rangeRoundBands([0, width], .5);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var file_name = ""
if (sample_type == 0) file_name = "./static/data/r_sp.csv"; else file_name = "./static/data/s_sp.csv";
d3.csv(file_name, function(error, data) {

    data.forEach(function(d) {
        d.attr = d.attr;
        d.value = +d.value;
    });

  x.domain(data.map(function(d) { return d.attr; }));
  y.domain([0, 1.1*d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom  )
        .text("Attribute");
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left) // x and y switched due to rotation
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("PCA loading");
  svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 0 )
        .style("stroke", "#000")
        .style("font", "16px times")
        .text("PCA Loadings");
  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", function(d,i) {if (i<=2) return "orange"; else return "steelblue";})
      .attr("x", function(d) { return x(d.attr); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .on("mouseover", function(d, i) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("PCA Loading " + d.value)
                .style("left", (d3.event.pageX - 60  ) + "px")
                .style("top", (d3.event.pageY - 60) + "px")
            d3.select(this).transition()
                .duration(100)
                .attr("x", function(d) { return x(d.attr) - 5; })
                .attr("y", function(d) { return y(d.value) - 10 ; })
                .attr("height", function(d) { return height - y(d.value) + 10 ; })
                .attr("width", x.rangeBand() + 10)
                .style("fill", "red");})
      .on("mouseout", function(d, i) {
            div.transition()
                .duration(100)
                .style("opacity", 0);
            d3.select(this).transition()
                .duration(100)
                .style("fill", function(d,i) {if (i<=2) return "orange"; else return "steelblue";})
                .attr("x", function(d) { return x(d.attr) ; })
                .attr("y", function(d) { return y(d.value) ; })
                .attr("height", function(d) { return height - y(d.value) ; })
                .attr("width", x.rangeBand() )
                ;});
});
}
