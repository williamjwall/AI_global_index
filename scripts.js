google.charts.load('current', {
  'packages':['corechart', 'geochart'],
  'mapsApiKey':'AIzaSyCBYaGF8mL8Dh92AGSfwBgHjkDephxDSrs'
});

google.charts.setOnLoadCallback(drawRegionsMap);

var country_data = [];

d3.csv("data/AI_index_db.csv").then(function(data) {

  var country_obj = {};

  var countries;

  for (i = 0; i < data.length; i++) {
    var country = data[i]['Country'];
    var totalScore = parseFloat(data[i]['Total score']);

    if (country in country_obj) {
      country_obj[country] += totalScore;
    } else {
      country_obj[country] = totalScore;
    }
  }

  countries = Object.keys(country_obj);

  for (i = 0; i < countries.length; i++) {
    var totalScore = country_obj[countries[i]];
    var curr_country = countries[i];
    var new_obj = [curr_country, totalScore];
    country_data.push(new_obj);
  }

  country_data = country_data.sort(function(a, b) {
    return b[1] - a[1];
  });
  country_data.unshift(['Country', 'Total Score']);

  // Call the drawRegionsMap function after processing the data
  drawRegionsMap();
});

function drawRegionsMap() {
  var country_data = [];

  d3.csv("data/AI_index_db.csv").then(function(data) {

    var country_obj = {};

    var countries;

    for (i = 0; i < data.length; i++) {
      var country = data[i]['Country'];
      var totalScore = parseFloat(data[i]['Total score']);

      if (country in country_obj) {
        country_obj[country] += totalScore;
      } else {
        country_obj[country] = totalScore;
      }
    }

    countries = Object.keys(country_obj);

    for (i = 0; i < countries.length; i++) {
      var totalScore = country_obj[countries[i]];
      var curr_country = countries[i];
      var new_obj = [curr_country, totalScore];
      country_data.push(new_obj);
    }

    country_data = country_data.sort(function(a, b) {
      return b[1] - a[1];
    });
    country_data.unshift(['Country', 'Total Score']);

    var chartData = google.visualization.arrayToDataTable(country_data);

    var options = {
      title: 'AI Global Index by Country',
      colorAxis: {
        colors: ['#4374e0', '#a4c7f4']
      }
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regionsmap'));

    chart.draw(chartData, options);
  });
}

function draw_investment_by_company(country) {
  var curr_data = company_investment_per_country[country];

  try {
      if (curr_data.length === 1) {
          //console.log(curr_data.length)
          return;
      }
  } catch(TypeError) {
      return;
  }

  // Extract the necessary columns from curr_data
  var extractedData = curr_data.map(function(row) {
      return [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8]];
  });

  var data = google.visualization.arrayToDataTable(extractedData);

  var options = {
      title: `Top Companies in ${country} by China's Total Investments Since 2005 (Millions)`,
      hAxis: {
          title: "Company",
      },
      vAxis: {
          title: "Investments (Millions)"
      },
      allowHtml: true,
      bar: {groupWidth: "30%"},
      legend: { position: "top" },
      animation:{
          startup: true,
          duration: 1000,
          easing: 'out',
      },
      colors:['red'],
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("investment_by_country_chart"));
  chart.draw(data, options);

  country_column_drawn = true;
  curr_country_for_column = country;
}







function initMap(){
  //Prevents API console error for some reason
}

function drawRegionsMap() {
  var data = google.visualization.arrayToDataTable(country_data);

  var options = {
      legend: {textStyle: {color: 'black', fontSize: 16}},
      colorAxis: {colors: ['white', '#f76565', 'red']},
  };

  var chart = new google.visualization.GeoChart(document.getElementById('countryChart'));

  chart.draw(data, options);

  function click_func(){
      var selection = chart.getSelection();
      try {
          var row = parseInt(selection[0]['row']);
      } catch(TypeError) {
          return;
      }
      var country = country_data[row + 1][0];
      draw_investment_by_company(country);
      draw_sector_by_country(country);
  }
  google.visualization.events.addListener(chart, 'select', click_func);
}


function resize() {
  if (document.getElementById('investment_by_country_chart').innerHTML === "") {
      document.getElementById('investment_by_country_chart').innerHTML = "<h1 style='height: 50vh;float:left;margin-top:300px;margin-left:150px;'>Click a Country</h1>"
  }
  drawRegionsMap();
  drawBarChart();

}

window.onload = resize;
window.onresize = resize;
