queue()
    .defer(d3.json, "/accidents")
    .await(makeGraphs);

function makeGraphs(error, projectsJson) {

  console.log(projectsJson)
  var data = projectsJson
  console.log(data[100]["\"year\""])

  var ndx = crossfilter(data);
  var yearDim = ndx.dimension(function(d) { return d["\"year\""]; });
  var stateDim = ndx.dimension(function(d) { return d["\"state\""]; });
  var impactDim = ndx.dimension(function(d) { return d["\"inimpact\""]; });
  var airbagDim = ndx.dimension(function(d) { return d["\"airbag\""]; });
  var sexDim = ndx.dimension(function(d) { return d["\"sex\""]; });
  var ageDim = ndx.dimension(function(d) { return d["\"age\""]; });

  var dataByYear = yearDim.group();
  var dataByState = stateDim.group();
  var dataByImp = impactDim.group();
  var dataByAirbag = airbagDim.group();
  var dataBySex = sexDim.group();
  var dataByAge = ageDim.group();

  var totalByState = stateDim.group().reduceSum(function(d) {
		return 1;
	});
  var totalByImp = impactDim.group().reduceSum(function(d) {
		return 1;
	});
  var totalByAge = ageDim.group().reduceSum(function(d) {
		return 1;
	});

  console.log(totalByState)
  console.log(totalByImp)
  console.log(yearDim)
  minDate = yearDim.bottom(1)[0]["\"year\""]
  maxDate = yearDim.top(1)[0]["\"year\""]

  minState = 1
  maxState = 51

  minAge = ageDim.bottom(1)[0]["\"age\""]
  maxAge = ageDim.top(1)[0]["\"age\""]

  minImp = impactDim.bottom(1)[0]["\"inimpact\""]
  maxImp = impactDim.top(1)[0]["\"inimpact\""]

  minAir = airbagDim.bottom(1)[0]["\"airbag\""]
  maxAir = airbagDim.top(1)[0]["\"airbag\""]

  console.log(minAge)
  console.log(maxAge)

  var timeChart = dc.barChart("#time-chart");
  var stateChart = dc.barChart("#state-chart");
  var sexChart = dc.barChart("#sex-chart");
  var impChart = dc.barChart("#impact-chart");
  var airbagChart = dc.barChart("#airbag-chart");
  var ageChart = dc.barChart("#age-chart");

  timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(yearDim)
		.group(dataByYear)
		.transitionDuration(500)
		.x(d3.time.scale().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

  stateChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(stateDim)
		.group(dataByState)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([minState, maxState]))
		.elasticY(true)
		.xAxisLabel("State")
		.yAxis().ticks(8);

  sexChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(sexDim)
		.group(dataBySex)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([0, 4]))
		.elasticY(true)
		.xAxisLabel("Sex")
		.yAxis().ticks(8);

  ageChart
    .width(600)
    .height(160)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(ageDim)
    .group(dataByAge)
    .transitionDuration(500)
    .x(d3.scale.linear().domain([minAge, maxAge]))
    .elasticY(true)
    .xAxisLabel("Age")
    .yAxis().ticks(8);

  impChart
    .width(600)
    .height(160)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(impactDim)
    .group(dataByImp)
    .transitionDuration(500)
    .x(d3.scale.linear().domain([minImp, maxImp]))
    .elasticY(true)
    .xAxisLabel("Impact")
    .yAxis().ticks(8);

  airbagChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(airbagDim)
		.group(dataByAirbag)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([minAir, maxAir]))
		.elasticY(true)
		.xAxisLabel("Airbag")
		.yAxis().ticks(8);

  dc.renderAll();
};
