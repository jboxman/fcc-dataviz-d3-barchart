/*
User Story: I can see US Gross Domestic Product by quarter, over time.

User Story: I can mouse over a bar and see a tooltip with the GDP amount and exact year and month that bar represents.
*/

var allData = loadData(),
  data = allData.data;

var toolTip = d3.select('.tooltip');

// Easy way to define margins
var margin = {
    top: 60,
    right: 20,
    bottom: 60,
    left: 80
  },
  width = 918 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var x = d3.time.scale()
  .rangeRound([0, width]);
var y = d3.scale.linear()
  .rangeRound([height, 0]);

// Tick hints
var dollars = d3.format('$,');
var xAxis = d3.svg.axis().scale(x).orient('bottom').ticks(20);
var yAxis = d3.svg.axis().scale(y).orient('left').ticks(8).tickFormat(dollars);

x.domain([new Date(allData.from_date), new Date(allData.to_date)]);
y.domain([d3.min(data, function(v) {
  return v[1];
}), d3.max(data, function(v) {
  return v[1];
})]);

// May be useful to capture this for labeling
var svgOuter = d3.select('#chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

var svg = svgOuter.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

svg.append('text').text('Gross Domestic Product').attr({
  class:'header-text',
  x:(width / 2),
  y:(0 - (margin.top / 2)),
  'text-anchor':'middle'
});

svg.append('text').text('Quarters').attr({
  class:'xaxis-text',
  x:((width / 2)),
  y:(height + 40),
  'text-anchor':'middle'
});

svg.append('text').text('Billions').attr({
  transform:'rotate(-90)',
  class:'yaxis-text',
  x:(0 - (height/2)),
  y:(0 - 20 - (margin.left / 2)),
  'text-anchor':'middle'
});

// Can this be used to add a subtitle effectively?
// http://maximilianschmitt.me/posts/how-to-determine-the-width-and-height-of-svg-text-before-rendering-with-raphael/

var bars = svg.selectAll('.bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'bar')
  .attr('x', function(d) {
    return x(new Date(d[0]));
  })
  .attr('width', function(d) {
    return (width / (data.length - 5));
  })
  .attr('y', function(d) {
    return y(d[1]);
  })
  .attr('height', function(d) {
    return height - y(d[1]);
  });

// D3.tip is another option (not used)
// http://bl.ocks.org/Caged/6476579

// Derived from:
// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
bars.on({
  'mouseover':function(v) {
    toolTip.select('#tooltip_datum_gdp').text(v[0]);
    toolTip.select('#tooltip_datum_date').text(v[1]);
    toolTip.transition().duration(200).style('opacity', .9);
    toolTip.style({
      'left': (d3.event.pageX) + "px",
      'top': (d3.event.pageY - 28) + "px"
    });
  },
  'mouseout':(v) => {toolTip.transition().style('opacity', 0);}
});

svg.append('g').attr('class', 'axis').attr('transform', 'translate(0, ' + height + ')').call(xAxis);
svg.append('g').attr('class', 'axis').call(yAxis);