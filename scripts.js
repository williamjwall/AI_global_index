google.charts.load('current', {
  'packages':['corechart', 'geochart'],
  'mapsApiKey':'AIzaSyCy_gHXrqHtwd_0PYlRoQD35fqGT3kqkl4'
});

google.charts.setOnLoadCallback(drawRegionsMap);
google.charts.setOnLoadCallback(drawLineChart);
google.charts.setOnLoadCallback(drawCorrChart);
google.charts.setOnLoadCallback(drawChart);
// google.charts.setOnLoadCallback(drawPieChart);

var countries_obj = {};

var country_score = [];
var publication_count = []

d3.csv("AI_index_db.csv").then(function(data) {
  data.forEach(function(row) {
    var country = row['Country'];
    var totalScore = parseFloat(row['Total score']);
    var talent = parseFloat(row['Talent']);
    var infrastructure = parseFloat(row['Infrastructure']);
    var operatingEnvironment = parseFloat(row['Operating Environment']);
    var research = parseFloat(row['Research']);
    var development = parseFloat(row['Development']);
    var governmentStrategy = parseFloat(row['Government Strategy']);
    var commercial = parseFloat(row['Commercial']);
    var politicalRegime = row['Political regime'];

    country_score.push([country, totalScore]);

    countries_obj[country] = {
      totalScore: totalScore,
      talent: talent,
      infrastructure: infrastructure,
      operatingEnvironment: operatingEnvironment,
      research: research,
      development: development,
      governmentStrategy: governmentStrategy,
      commercial: commercial,
      politicalRegime: politicalRegime
    };
  });

}).catch(function(error) {
  console.error("Error loading the CSV file:", error);
});

function drawLineChart() {
  // arrayToDataTable wasn't working had to specify data types for some reason as 'numbers'
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'Year');
  data.addColumn('number', 'Publications');
  data.addRows([
    [2010, 162444],
    [2011, 170168],
    [2012, 176611],
    [2013, 183656],
    [2014, 192310],
    [2015, 194000],
    [2016, 194194],
    [2017, 206392],
    [2018, 237482],
    [2019, 281659],
    [2020, 311675],
    [2021, 334497],
    [2022, 350000],
  ]);

  var options = {
    title: 'AI Publications Over Time',
    hAxis: { title: 'Year', format: '####' },
    vAxis: {
      title: 'Publications',
      viewWindow: {
        min: 1000,
        max: 375000,
      },
    },
    legend: 'top',
    animation: { startup: true, duration: 1000, easing: 'out' },
    colors: ['#0a4d19'],
    curveType: 'function',
    pointSize: 6,
  };

  var chart = new google.visualization.LineChart(document.getElementById('linechart'));
  chart.draw(data, options);
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['AI Library', 'Number of Cumulative GitHub Stars'],
    ['TensorFlow', 160.672],
    ['Keras', 53.218],
    ['OpenCV', 58.561],
    ['DeepLearning-500-questions', 46.651],
    ['TenserFlow-Examples', 41.461],
    ['Scikit-learn', 47.991],
    ['Pytorch', 52.745],
  ]);

  var options = {
    chartArea: { width: '50%' },
    title: 'Number of Cumulative GitHub Stars (in thousands)',
    colors:['green'],
    legend: 'none'
  };
  var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

function drawCorrChart() {

  var chartContainer = document.getElementById('barChart_corr');

  // This conditional statement checks if chartContainer is falsy, which means the element with the ID 'barChart_corr' wasn't found.
  if (!chartContainer) {
    console.error("Container for the chart is not defined.");
    return;
  }

  var data = google.visualization.arrayToDataTable([
    ['Category', 'Score'],
    ['Talent', 0.861969],
    ['Infrastructure', 0.716481],
    ['Operating Environment', 0.368566],
    ['Research', 0.945877],
    ['Development', 0.866337],
    ['Government Strategy', 0.531821],
    ['Commercial', 0.857985]
  ]);

  var options = {
    title: 'Correlation with Total Score',
    chartArea: { width: '50%' },
    hAxis: {
      minValue: 0,
    },

    colors:['#0a4d19']
  };

  var chart = new google.visualization.BarChart(chartContainer);
  chart.draw(data, options);
}

// function drawPieChart() {
//   // count occurrences
//   var regimeCounts = {};

//   country_score.forEach(function ([country, totalScore]) {
//     var politicalRegime = countries_obj[country].politicalRegime;
//     regimeCounts[politicalRegime] = (regimeCounts[politicalRegime] || 0) + 1;
//   });

//   var pieData = Object.entries(regimeCounts).map(([regime, count]) => ({ regime, count }));

//   var width = 300;
//   var height = 300;
//   var radius = Math.min(width, height) / 2;

//   var color = d3.scaleOrdinal(d3.schemeCategory10);

//   var svg = d3.select("body").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append("g")
//     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//   var pie = d3.pie()
//     .value(function (d) { return d.count; });

//   var path = d3.arc()
//     .outerRadius(radius - 10)
//     .innerRadius(0);

//   var arc = svg.selectAll("arc")
//     .data(pie(pieData))
//     .enter().append("g")
//     .attr("class", "arc");

//   arc.append("path")
//     .attr("d", path)
//     .attr("fill", function (d) { return color(d.data.regime); });

//   arc.append("text")
//     .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
//     .attr("dy", ".4em")
//     .text(function (d) { return d.data.regime + " (" + d.data.count + ")"; });
// }

function initMap(){
  //Prevents API console error for some reason
}

function drawRegionsMap() {
  try{

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Country');
  data.addColumn('number', 'Total Score');
  data.addRows(country_score);

  var options = {
    legend: {textStyle: {color: 'black', fontSize: 16}},
    colorAxis: {colors: ['white', '#285224', 'green']},
  };

  var chart = new google.visualization.GeoChart(document.getElementById('countryChart'));

  chart.draw(data, options);

function click_func() {
    var selection = chart.getSelection();
    try {
      var row = parseInt(selection[0]['row']);

    } catch (TypeError) {
      return;
    }
    var country = country_score[row][0];

    drawBarChart(country);
  }
  google.visualization.events.addListener(chart, 'select', click_func);
} catch (error) {
  console.error("Error drawing regions map:", error);
  }
}

function drawBarChart(selectedCountry) {
  var countryData = countries_obj[selectedCountry];

  if (!countryData) {
    console.error(`Data for ${selectedCountry} is undefined.`);
    return;
  }

  var barChartData = [
    ['Category', 'Score'],
    ['Talent', countryData.talent],
    ['Infrastructure', countryData.infrastructure],
    ['Operating Environment', countryData.operatingEnvironment],
    ['Research', countryData.research],
    ['Development', countryData.development],
    ['Government Strategy', countryData.governmentStrategy],
    ['Commercial', countryData.commercial]
  ];

  var data = google.visualization.arrayToDataTable(barChartData);

  var options = {
    title: `Scores for ${selectedCountry} (${countryData.politicalRegime})`,

    legend: { position: "none" },
    animation: {
      startup: true,
      duration: 1000,
      easing: 'out',
    },
    colors:['green'],
  };

  var chart = new google.visualization.BarChart(document.getElementById('barChart'));

  chart.draw(data, options);
}

function resize() {
  drawRegionsMap();
  drawBarChart();
  drawLineChart();
  drawCorrChart();
  // drawPieChart()
}

window.onload = resize;
window.onresize = resize;
