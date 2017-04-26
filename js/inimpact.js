var bbox, radii, svg, target;

svg = d3.select('svg');
bbox = svg[0][0].getBoundingClientRect();

var limit;
var radii = [];
for (var i = 15; i <= bbox.width/2 - 50; i+=1) {
    radii.push(i);
}
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//radii = [24, 48, 72, 96];

target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");

target.selectAll('circle')
    .data(radii)
  .enter().append('circle')
    .attr('r', function(d) {return d;})
    .style("opacity", 0.01)
    .attr("fill", "none")
    .style("stroke", "black")
    .on("mouseover", function(d) {
        d3.select(this).style("stroke", "red")
        .style("opacity", 1);
        div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html( Math.round(2 * limit/bbox.height * d))
                .style("left", (d3.event.pageX + 14) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        
    })
    .on("mouseout", function(d) {
        d3.select(this).style("stroke", "black")
        .style("opacity", 0.01);
    });

var data1 = [];

d3.csv("./inimpact.csv", function(error, data) {
         data.forEach(function(d) {
            if (+d.Clock < 13){
                var clock = +d.Clock * Math.PI / 2;
                d.xc = +d["Number"] * Math.sin(clock);
                d.yc = +d["Number"] * Math.cos(clock);
            }
        });
    var x = d3.scale.linear().range([0, bbox.width]);
    var y = d3.scale.linear().range([bbox.height, 0]);
    
    limit = 1.2*d3.max(data, function(d) { return +d["Number"]; })
    
    x.domain([ -limit, limit]);
    y.domain([ -limit, limit]);
    
    var valueline = d3.svg.line()
        .interpolate("cardinal-closed")
        .x(function(d) { return x(d.xc); })
        .y(function(d) { return y(d.yc); });
    
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));
        
        
    svg.selectAll("dot")
        .data(data)
    .enter().append("circle")
        .attr("r", 5)
        .attr("fill", "black")
        .attr("cx", function(d) { if (+d.Clock < 13) return x(d.xc); }) 
        .attr("cy", function(d) { if (+d.Clock < 13) return y(d.yc); })
        .on("mouseover", function(d) {
            d3.select(this).transition()
                .duration(100)
                .attr("r", 10)
                .attr("fill", "red");
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html( Math.sqrt(d.xc*d.xc + d.yc*d.yc) )
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
        
});


