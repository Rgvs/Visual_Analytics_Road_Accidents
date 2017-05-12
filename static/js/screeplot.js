function plot_screenplot(sample_type) {

var margin = {top: 50, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = d3.svg.line()
    .x(function(d) { return x(d.axis); })
    .y(function(d) { return y(d.variance); });

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
var intrinsic_dimensionality = 0;

var file_name = ""
if (sample_type == 0) {
    file_name = "./static/data/r_pca.csv";
    intrinsic_dimensionality = 1.53;
}
else {
    intrinsic_dimensionality = 1.42;
    file_name = "./static/data/s_pca.csv";
}

var horizontalline = d3.svg.line()
    .x(function(d){return x(d.axis);})
    .y(function(d){return y(intrinsic_dimensionality);});

var basicline = d3.svg.line()
    .x(function(d){return x(d.axis);})
    .y(function(d){return y(1);});


d3.csv(file_name, function(error, data) {
    data.forEach(function(d) {
        d.axis = +d.axis;
        d.variance = +d.variance;
    });

    x.domain([0, 1.1*d3.max(data, function(d) { return d.axis; })]);
    y.domain([0, 1.1*d3.max(data, function(d) { return d.variance; })]);

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("path")
        .attr("class", "line")
        .attr("d", horizontalline(data))
        .style("stroke", "green");

    svg.append("path")
        .attr("class", "line")
        .attr("d", basicline(data))
        .style("stroke", "red");

    svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("cx", function(d) { return x(d.axis); })
        .attr("cy", function(d) { return y(d.variance); })
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            d3.select(this).transition()
                .duration(100)
                .attr("r", 10)
                .attr("fill", "red");
            div.html("Axis " + d.axis + "<br/>"  + "Eigen value " + d.variance)
                .style("left", (d3.event.pageX + 14 ) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .duration(100)
                .attr("r", 5)
                .attr("fill", "black");
            div.transition()
                .duration(100)
                .style("opacity", 0);
        });


    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom )
        .text("Axis");
    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 0 )
        .style("stroke", "#000")
        .style("font", "16px times")
        .text("ScreenPlot");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("text")
        .attr("class", "ylabel")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Eigen Value");

});


}
