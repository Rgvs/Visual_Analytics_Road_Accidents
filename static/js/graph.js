queue()
    .defer(d3.json, "/accidents")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {

  console.log(projectsJson)
  var data = projectsJson
  console.log(data[100]["\"year\""])

  var ndx = crossfilter(data);
  var yearDim = ndx.dimension(function(d) { return d["\"modelyr\""]; });
  var stateDim = ndx.dimension(function(d) { return d["\"state\""]; });
  var impactDim = ndx.dimension(function(d) { return d["\"inimpact\""]; });
  var airbagDim = ndx.dimension(function(d) { return d["\"airbag\""]; });
  var sexDim = ndx.dimension(function(d) { return d["\"sex\""]; });

  var dataByYear = yearDim.group();
  var dataByState = stateDim.group();
  var dataByImp = impactDim.group();
  var dataByAirbag = airbagDim.group();
  var dataBySex = sexDim.group();

  var totalByState = stateDim.group().reduceSum(function(d) {
		return 1;
	});
  var totalByImp = stateDim.group().reduceSum(function(d) {
		return 1;
	});

  console.log(totalByState)
  console.log(totalByImp)
  console.log(yearDim)
  console.log(yearDim.bottom(1)[0]["\"modelyr\""])
  console.log(yearDim.top(1)[0]["\"modelyr\""])

  // timeChart
	// 	.width(600)
	// 	.height(160)
	// 	.margins({top: 10, right: 50, bottom: 30, left: 50})
	// 	.dimension(yearDim)
	// 	.group(dataByYear)
	// 	.transitionDuration(500)
	// 	.x(d3.time.scale().domain([minDate, maxDate]))
	// 	.elasticY(true)
	// 	.xAxisLabel("Year")
	// 	.yAxis().ticks(4);

};
