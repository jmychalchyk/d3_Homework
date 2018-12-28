var svgWidth = 800;
var svgHeight = 700;

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
        .domain([0, d3.max(chartData, d => d.healthcare)])
        .range([0,height]);

// Create y scale function
var yLinearScale = d3.scaleLinear()
  .domain([8, d3.max(chartData, d => d.poverty)])
  .range([height, 8]);

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
  .attr("r", "10")
  .attr("fill", "navy")
  .attr("opacity", ".4");

  labelGroup = chartGroup.append("text")
  .style("text-anchor", "middle")
  .style("font-size", "10px")
  .selectAll("tspan")
  .data(chartData)
  .enter()
  .append("tspan")
  .attr("x", function(d) {return xLinearScale(d.healthcare - 0);})
  .attr("y", function(d) {return yLinearScale(d.poverty - 0.1);})
  .text(function(d) {return d.abbr});

   //Initialize tool tip
   var toolTip = d3.tip()
   .attr("class", "tooltip")
   .offset([0,0])
   .html(function (d) {return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);});

 //Create tooltip in the chart
 chartGroup.call(toolTip);

 //Create event listeners to display and hide the tooltip
 circlesGroup.on("click", function (d) {toolTip.show(d);}).on("mouseout", function (d, i) {toolTip.hide(d);});
   labelGroup.on("click", function (d) {toolTip.show(d);}).on("mouseout", function (d, i) {toolTip.hide(d);});


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
