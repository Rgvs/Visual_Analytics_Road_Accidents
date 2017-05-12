queue()
    .defer(d3.json, "/accidents")
    .defer(d3.json, "static/data/us-states.json")
    .await(makeGraphs);

function makeGraphs(error, projectsJson, statesJson) {

  console.log(projectsJson)
  var data = projectsJson
  console.log(data[100])

  var ndx = crossfilter(data);
  var yearDim = ndx.dimension(function(d) { return d["year"]; });
  var stateDim = ndx.dimension(function(d) { return d["state"]; });
  var impactDim = ndx.dimension(function(d) { return d["inimpact"]; });
  var airbagDim = ndx.dimension(function(d) { return d["airbag"]; });
  var sexDim = ndx.dimension(function(d) { return d["sex"]; });
  var ageDim = ndx.dimension(function(d) { return d["age"]; });
  var restraintDim = ndx.dimension(function(d) { return d["restraint"]; });
  var injuryDim = ndx.dimension(function(d) { return d["injury"]; });
  var modelyrDim = ndx.dimension(function(d) { return d["modelyr"]; });

  var dataByYear = yearDim.group();
  var dataByState = stateDim.group();
  var dataByImp = impactDim.group();
  var dataByAirbag = airbagDim.group();
  var dataBySex = sexDim.group();
  var dataByAge = ageDim.group();
  var dataByRestraint = restraintDim.group();
  var dataByInjury = injuryDim.group();
  var dataByModyear = modelyrDim.group();

  var totalByState = stateDim.group().reduceSum(function(d) {
		return 1;
	});
  //var totalByState = stateDim.group().reduceCount()
  var totalByImp = impactDim.group().reduceSum(function(d) {
		return 1;
	});
  var totalByAge = ageDim.group().reduceSum(function(d) {
		return 1;
	});

  var totalAccidents = ndx.groupAll();
  console.log(totalAccidents)

  var max_state = totalByState.top(1)[0].value;
  //console.log(max_state)

  //console.log(totalByState)
  //console.log(totalByImp)
  //console.log(yearDim)
  minDate = yearDim.bottom(1)[0]["year"]
  maxDate = yearDim.top(1)[0]["year"] + 1

  minMDate = modelyrDim.bottom(1)[0]["modelyr"]
  maxMDate = modelyrDim.top(1)[0]["modelyr"] + 1

  //console.log(minMDate)
  //console.log(maxMDate)

  minState = 1
  maxState = 51

  minAge = ageDim.bottom(1)[0]["age"]
  maxAge = ageDim.top(1)[0]["age"]

  minImp = impactDim.bottom(1)[0]["inimpact"]
  maxImp = impactDim.top(1)[0]["inimpact"]

  minAir = airbagDim.bottom(1)[0]["airbag"]
  maxAir = airbagDim.top(1)[0]["airbag"]

  //console.log(minAge)
  //console.log(maxAge)

  var timeChart = dc.barChart("#time-chart");
  var modChart = dc.barChart("#mod-chart");
  // var sexChart = dc.barChart("#sex-chart");
  var sexChart = dc.pieChart("#sex-chart");
  // var impChart = dc.barChart("#impact-chart");
  // var airbagChart = dc.barChart("#airbag-chart");
  var impChart = dc.rowChart("#impact-chart");
  var airbagChart = dc.rowChart("#airbag-chart");
  var ageChart = dc.barChart("#age-chart");
  var usChart = dc.geoChoroplethChart("#us-chart");
  var totalAccidentsND = dc.numberDisplay("#total-accidents-nd");
  var resChart = dc.rowChart("#restraint-chart");
  var injChart = dc.rowChart("#injury-chart");

  totalAccidentsND
    .width(600)
    .height(160)
		.formatNumber(d3.format("d"))
		.valueAccessor(function(d){return d; })
		.group(totalAccidents)
		.formatNumber(d3.format(".4s"));

  timeChart
		.width(600)
		.height(160)
		.margins({top: 10, right: 50, bottom: 30, left: 50})
		.dimension(yearDim)
		.group(dataByYear)
		.transitionDuration(500)
		.x(d3.scale.linear().domain([minDate, maxDate]))
		.elasticY(true)
		.xAxisLabel("Year")
		.yAxis().ticks(4);

  modChart
    .width(600)
    .height(160)
    .margins({top: 10, right: 50, bottom: 30, left: 50})
    .dimension(modelyrDim)
    .group(dataByModyear)
    .transitionDuration(500)
    .x(d3.scale.linear().domain([minMDate, maxMDate]))
    .elasticY(true)
    .xAxisLabel("Model Year")
    .yAxis().ticks(4);
  //
  // stateChart
	// 	.width(600)
	// 	.height(160)
	// 	.margins({top: 10, right: 50, bottom: 30, left: 50})
	// 	.dimension(stateDim)
	// 	.group(totalByState)
	// 	.transitionDuration(500)
	// 	.x(d3.scale.linear().domain([minState, maxState]))
	// 	.elasticY(true)
	// 	.xAxisLabel("State")
	// 	.yAxis().ticks(8);

  // sexChart
	// 	.width(600)
	// 	.height(160)
	// 	.margins({top: 10, right: 50, bottom: 30, left: 50})
	// 	.dimension(sexDim)
	// 	.group(dataBySex)
	// 	.transitionDuration(500)
	// 	.x(d3.scale.linear().domain([0, 4]))
	// 	.elasticY(true)
	// 	.xAxisLabel("Sex")
	// 	.yAxis().ticks(8);

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

  sMap = {1: "Male", 2: "Female"}

  sexChart
    .width(600)
    .height(160)
    .slicesCap(4)
    .innerRadius(30)
    .dimension(sexDim)
    .group(dataBySex)
    .legend(dc.legend())
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
            return d.data.key + ' ' + dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2*Math.PI) * 100) + '%';
        })
    });

  // impChart
  //   .width(600)
  //   .height(160)
  //   .margins({top: 10, right: 50, bottom: 30, left: 50})
  //   .dimension(impactDim)
  //   .group(dataByImp)
  //   .transitionDuration(500)
  //   .x(d3.scale.linear().domain([minImp, maxImp]))
  //   .elasticY(true)
  //   .xAxisLabel("Impact")
  //   .yAxis().ticks(8);

  impChart
    .width(300)
    .height(250)
    .dimension(impactDim)
    .group(dataByImp)
    .elasticX(true)
    .xAxis().ticks(4);

  // airbagChart
	// 	.width(600)
	// 	.height(160)
	// 	.margins({top: 10, right: 50, bottom: 30, left: 50})
	// 	.dimension(airbagDim)
	// 	.group(dataByAirbag)
	// 	.transitionDuration(500)
	// 	.x(d3.scale.linear().domain([minAir, maxAir]))
	// 	.elasticY(true)
	// 	.xAxisLabel("Airbag")
	// 	.yAxis().ticks(8);
  airbagChart
    .width(300)
    .height(250)
    .dimension(airbagDim)
    .group(dataByAirbag)
    .elasticX(true)
    .xAxis().ticks(4);

  resChart
    .width(300)
    .height(250)
    .dimension(restraintDim)
    .group(dataByRestraint)
    .elasticX(true)
    .xAxis().ticks(4);

  injChart
    .width(300)
    .height(250)
    .dimension(injuryDim)
    .group(dataByInjury)
    .elasticX(true)
    .xAxis().ticks(4);

  usChart.width(1000)
		.height(372)
		.dimension(stateDim)
		.group(totalByState)
    //.colors(d3.scale.category20b())
		.colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#0061B5"])
		.colorDomain([0, max_state])
		.overlayGeoJson(statesJson["features"], "state", function (d) {
      //console.log(d)
      return d.properties.name;
		})
		.projection(d3.geo.albersUsa()
    				.scale(600)
    				.translate([340, 150]))
		.title(function (p) {
      //console.log(p)
      //console.log(statesJson["features"].findIndex(x => x.properties.name==p["key"]))
			return "State: " + p["key"]
					+ "\n"
					+ "Total Accidents: " + Math.round(p["value"]) + " $";
		})

  dc.renderAll();
};
