
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "healthcare";

function xScale(chartData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(chartData, d => d[chosenXAxis]) * 0.8,
      d3.max(chartData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}


function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function updateToolTip(chosenXAxis, circlesGroup) {

//   if (chosenXAxis === "healthcare") {
//     var label = "Health Care:";
//   }
//   else {
//     var label = "# of Albums:";
//   }

//   var toolTip = d3.tip()
//     .attr("class", "tooltip")
//     .offset([80, -60])
//     .html(function(d) {
//       return (`${d.poverty}<br>${label} ${d[chosenXAxis]}`);
//     });

//   circlesGroup.call(toolTip);

//   circlesGroup.on("mouseover", function(data) {
//     toolTip.show(data);
//   })
//     // onmouseout event
//     .on("mouseout", function(data, index) {
//       toolTip.hide(data);
//     });

//   return circlesGroup;
// }




d3.csv("data/data.csv", function(err,chartData) {
  if (err) throw err;
      chartData.forEach(function(d) {
        //  d.abbr            = d.abbr;
            d.age             = +d.age;
            // d.ageMoe          = +d.ageMoe;
            d.healthcare      = +d.healthcare;
            // d.healthcareHigh  = +d.healthcareHigh;
            // d.healthcareLow   = +d.healthcareLow;
            // d.id              = +d.id;
            // d.income          = +d.income;
            // d.incomeMoe       = +d.incomeMoe;
            d.obesity         = +d.obesity;
            // d.obesityLow      = +d.obesityLow;
            d.poverty         = +d.poverty;
            // d.povertyMoe      = +d.povertyMoe;
            d.smokes          = +d.smokes;
            // d.smokesHigh      = +d.smokesHigh;
            // d.smokesLow       = +d.smokesLow;
        //  d.state           = d.state;
        });

var xLinearScale = xScale(chartData, chosenXAxis);

// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(chartData, d => d.poverty)])
  .range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);

// append initial circles
var circlesGroup = chartGroup.selectAll("circle")
  .data(chartData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d.poverty))
  .attr("r", 20)
  .attr("fill", "pink")
  .attr("opacity", ".5");

// Create group for  2 x- axis labels
var labelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

var hairLengthLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "hair_length") // value to grab for event listener
  .classed("active", true)
  .text("Hair Metal Ban Hair Length (inches)");

var albumsLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("inactive", true)
  .text("# of Albums Released");

// append y axis
chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Number of Billboard 500 Hits");

// updateToolTip function above csv import
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXAxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(chartData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "healthcare") {
        albumsLabel
          .classed("active", true)
          .classed("inactive", false);
        hairLengthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        albumsLabel
          .classed("active", false)
          .classed("inactive", true);
        hairLengthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });});