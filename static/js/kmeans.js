function plot_kmeans() {

var margin = {top: 50, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(6);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(10);


var valueline = d3.svg.line()
    .x(function(d) { return x(d.nc); })
    .y(function(d) { return y(d.error); });


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

d3.csv("data/kmeans.csv", function(error, data) {
    data.forEach(function(d) {
        d.nc = +d.nc;
        d.error = +d.error;
    });

    // Scale the range of the data
    x.domain([0, 1.1*d3.max(data, function(d) { return d.nc; })]);
    y.domain([0.9*d3.min(data, function(d) { return d.error; }), 1.05*d3.max(data, function(d) { return d.error; })]);

    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 5)
        .attr("cx", function(d) { return x(d.nc); }) 
        .attr("cy", function(d) { return y(d.error); })
        .on("mouseover", function(d) {
            d3.select(this).transition()
                .duration(100)
                .attr("r", 10)
                .attr("fill", "red");
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html("No of clusters "+ d.nc + "<br/>"  +"Sq Error " + d.error)
                .style("left", (d3.event.pageX + 14) + "px")
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

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom )
        .text("Number of Clusters");
    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 0 )
        .style("stroke", "#000")
        .style("font", "16px times")
        .text("Kmeans Elbow curve");
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("text")
        .attr("class", "ylabel")
        .attr("y", 0 - margin.left) // x and y switched due to rotation
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("Squared Error");

});

}
