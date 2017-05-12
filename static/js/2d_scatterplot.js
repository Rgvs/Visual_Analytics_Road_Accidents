function plot_2d_scatterplot(sample_type, plot_type) {

var margin = {top: 50, right: 20, bottom: 50, left: 70},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// Set the ranges
var x = d3.scale.linear().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x(d["Component 1"]); })
    .y(function(d) { return y(d["Component 2"]); });

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

var file_name = ""


switch(sample_type + 2*plot_type) {
    case 0:
        file_name = "./static/data/tr_data.csv";
        break;
    case 1:
        file_name = "./static/data/ts_data.csv";
        break;
    case 2:
        file_name = "./static/data/mr_data.csv";
        break;
    case 3:
        file_name = "./static/data/ms_data.csv";
        break;
    case 4:
        file_name = "./static/data/mrc_data.csv";
        break;
    case 5:
        file_name = "./static/data/msc_data.csv";
        break;
}


// Get the data
d3.csv(file_name, function(error, data) {
    data.forEach(function(d) {
        d["Component 1"] = +(+d["Component 1"]).toFixed(2);
        d["Component 2"] = +(+d["Component 2"]).toFixed(2);
    });

    // Scale the range of the data
    x.domain([1.1*d3.min(data, function(d) { return d["Component 1"]; }), 1.1*d3.max(data, function(d) { return d["Component 1"]; })]);
    y.domain([1.1*d3.min(data, function(d) { return d["Component 2"]; }), 1.1*d3.max(data, function(d) { return d["Component 2"]; })]);


    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 4)
        .attr("fill", "steelblue")
        .attr("cx", function(d) { return x(d["Component 1"]); })
        .attr("cy", function(d) { return y(d["Component 2"]); })
        .style("opacity", 0.7)
        .on("mouseover", function(d) {
            div.transition()
                .duration(100)
                .style("opacity", 0.9);
            d3.select(this).transition()
                .duration(100)
                .attr("r", 8)
                .attr("fill", "red")
                .style("opacity", 1);
            div.html( "Component 1 = " + d["Component 1"] + "<br/>"  + "Component 2 = " + d["Component 2"])
                .style("left", (d3.event.pageX + 14) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this).transition()
                .duration(100)
                .attr("r", 4)
                .attr("fill", "steelblue")
                .style("opacity", 0.7);
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
        .text("Component 1");

    svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 0 )
        .style("stroke", "#000")
        .style("font", "16px times")
        .text("2D scatterplot");

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
        .text("Component 2");

});
}
