var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("data/data.csv")
  .then(function(chartData) {
  chartData.forEach(function(d) {
            d.age             = +d.age;
            d.healthcare      = +d.healthcare;
            d.obesity         = +d.obesity;
            d.poverty         = +d.poverty;
            d.smokes          = +d.smokes;
        });

var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.poverty)])
        .range([height, 0]);

// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(chartData, d => d.healthcare)])
  .range([height, 0]);

// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

chartGroup.append("g")
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
  .attr("cx", d => xLinearScale(d.healthcare))
  .attr("cy", d => yLinearScale(d.poverty))
  .attr("r", "15")
  .attr("fill", "pink")
  .attr("opacity", ".5");

  var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.poverty}<br>Healthcare: ${d.healthcare}`);
  });

  chartGroup.call(toolTip);

  circlesGroup.on("click", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Poverty");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Heatlhcare");
});
