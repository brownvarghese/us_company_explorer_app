// US Company Exploration App Project

var cat_selected;

function buildCharts() {

  $('#chartmap').empty();

  document.getElementById("tbldata").style.display="table";
  document.getElementById("heading1").style.display="block";
  document.getElementById("heading2").style.display="block";
  document.getElementById("heading3").style.display="block";

  // Use the list of sample names to populate the select options
  var url = `/piedata/${cat_selected}`;

  console.log("Pie URL : " + url)

  d3.json(url).then(function (res){
    // if (error) return console.log(error);

    console.log(res)

    var arr = [];

    for (var i in res) {
      arr.push([res[i].FTE_range, res[i].range_count])
    }

    // arr.push([res[0].FTE_range, res[0].range_count]);
    // arr.push([res[1].FTE_range, res[1].range_count]);
    // arr.push([res[2].FTE_range, res[2].range_count]);
    // arr.push([res[3].FTE_range, res[3].range_count]);
    // arr.push([res[4].FTE_range, res[4].range_count]);

    console.log(arr)

    var chart = c3.generate({
      bindto: '#chartpie',
      data: {
        columns: arr,
        type : 'pie',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); },
		    onrendered: function () {$("#chartmap").append("<h6>Company Count by State</h6>"); }
      },
      pie: {
        label: {
            format: function (value, ratio, id) {
                return d3.format('')(value);
            }
        }
    }
  }) 
  setTimeout(function () {
    chart.transform('pie');
  }, 2500);

  // setTimeout(function () {
  //   chart.transform('donut');
  // }, 2500);

  setTimeout(function () {
    chart.transform('bar');
  }, 2500);

  setTimeout(function () {
    chart.transform('pie');
  }, 3500);  

  });

// Render US Map

  var url = `/mapdata/${cat_selected}`;

  console.log("Map URL : " + url)

  d3.json(url).then(function (res){
    // if (error) return console.log(error);

  console.log(res)
// map display for the company count by US state using anychart-map.js
  anychart.onDocumentReady(function() {
    // create map
      var map = anychart.map();

      map.geoData(anychart.maps['united_states_of_america']);
  
    // create data set
      var dataSet = anychart.data.set(res);

    // create choropleth series
      series = map.choropleth(dataSet);
  
    // set geoIdField to 'id', this field contains in geo data meta properties
      series.geoIdField('id');
  
// making of the ordinal colorRange

      ocs = anychart.scales.ordinalColor([
      {less: 1},
      {from: 1, to: 6},
      {from: 6, to: 11},
      {from: 11, to: 21},
      {greater:21}
      ]);        
  
      ocs.colors(['rgb(253,225,86)','rgb(248,196,57)', 'rgb(244,168,19)', 'rgb(198,109,1)', 'rgb(152,58,0)']);

      series.colorScale(ocs);

      // enable the tooltips and format them at once
      series.tooltip().format(function(e){
         return e.getData("id")+"\n"+"Company Cnt: " + e.getData("value") +"\n"+"Avg Agency Cnt: " + e.getData("Avg_agcy_cnt")
      });

      // stroke the undefined regions
      map.unboundRegions().stroke('green');

      // set the fill for the regions that haven't defined in the dataSet
      map.unboundRegions().fill('#eee');

      // create and enable the colorRange
      map.colorRange(true);
  
    //set map container id (div)
      map.container('chartmap');
  
    //initiate map drawing
      map.draw();
   
      map.zoomIn();
    })
  });

  var url = `/bardata/${cat_selected}`;

  console.log("Bar URL : " + url)

  d3.json(url).then(function (res1){
    // if (error) return console.log(error);

  console.log(res1)

  var arr1 = [];

  for (var i in res1) {
    arr1.push([res1[i].Bus_Model, res1[i].Company_count])
  }

  console.log(arr1)

  var chart2 = c3.generate({
    bindto: '#chartbar',

    data: {
      columns: arr1,
      type: 'bar',
      // labels: false
    },
    bar: {
      width: {
          ratio: 0.8 // this makes bar width 50% of length between ticks
      }
      // or
      //width: 100 // this makes bar width 100px
    },
    axis: {
      x: {
        label: {
        text: 'Business Model Type',
        position: 'outer-center'
        }
      }
    },
    axis: {
     y: {
        label: {
        text: 'No of US Companies',
        position: 'outer-middle'
        }
     }  
    },
  })    	
  });

  var $tbody = document.querySelector('tbody');
  var url = `/seldata/${cat_selected}`;
  
  console.log("Table URL : " + url)
  
  d3.json(url).then(function (res2){
  
    // if (error) return console.log(error);
  
    console.log(res2)
  
    var arr2 = [];
  
    for (var i in res2) {
      arr2.push([res2[i].sno, res2[i].company_name, res2[i].company_category, res2[i].state, res2[i].full_time_employees, 
        res2[i].business_model, res2[i].agency_name, res2[i].dataset_name])
    }
  
    console.log(arr2)
  
    $tbody.innerHTML = '';

    console.log("Entering FOR loop");

    for (var i = 0; i < arr2.length; i++) {
      // Get get the current address object and its fields
        console.log("First for loop")
        var address = arr2[i];
        var fields = Object.keys(address);
      // Create a new row in the tbody, set the index to be i + startingIndex
        var $row = $tbody.insertRow(i);
        for (var j = 0; j < fields.length; j++) {
          console.log("Second for loop")
        // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
          var field = fields[j];
          var $cell = $row.insertCell(j);
          $cell.innerText = address[field];
        }
    }
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selUSCC");

  console.log(selector)

  // Use the list of sample names to populate the select options
  d3.json("/usccnames").then((USCCNames) => {
    USCCNames.forEach((cname) => {
      selector
        .append("option")
        .text(cname)
        .property("value", cname);
    });

    // Use the first sample from the list to build the initial plots

    cat_selected = USCCNames[0];
    // buildCharts();
  });
};

function selectedcategory() {
cat_selected=""; 
cat_selected=$("#selUSCC").val();  
console.log("I am here " + cat_selected);
};

// Initialize the dashboard
init();