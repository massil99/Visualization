// Data: France 2021

// female datapoint converter
let myChart;
var country = "FR";
var year = 2020;
var agegroup = "Y55-64"
//read csv file
d3.csv("data/self_report.csv", d => {
  return {
    sex: d.sex,
    //lev_perc: d.lev_perc,
    age:d.age,
    reason: d.reason,
    geo:d.geo,
    years: +d.TIME_PERIOD,
    percent: +d.OBS_VALUE,
  }
}).then(data => {console.log(data);
makechart(data);
resetZoomChart();
})

function makechart(data1){
// setup 

let newDataF = data1.filter(data => data.years == year && data.geo == country && data.sex == 'F'&&data.age == agegroup);
let newDataM = data1.filter(data => data.years == year && data.geo == country && data.sex == 'M' && data.age == agegroup);

const listreasonF =[];
const listvalueF =[];
const listgroupF = [];
const listreasonM =[];
const listvalueM =[];
const listgroupM =[];
for(const row of newDataF){
  listreasonF.push(row.reason);
  listvalueF.push(row.percent);
  listgroupF.push(row.age)
} 


for(const row of newDataM){
  listreasonM.push(row.reason);
  listvalueM.push(row.percent);
  listgroupM.push(row.age);
} 

console.log(listgroupF);

const datagroup = data1.filter(data => data.years == year && data.geo == country).age;
console.log(datagroup)
const female = listvalueM;
const femaleData = [];
female.forEach(element => femaleData.push(element * -1))

//console.log(newDataM);
  var data = {
    labels: listreasonF,    

    datasets: [{
      label: 'Male',
      data : listvalueF,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    },
    {
      label: 'Female',
      data: femaleData,
      backgroundColor: 'rgba(255, 26, 104, 0.2)',
      borderColor: 'rgba(255, 26, 104, 1)',
      borderWidth: 1
    }]
  };

  // block tooltip
  const tooltip = {
    yAlign: 'bottom',
    titleAligh: 'center',
    callbacks: {
      label: function(context) {
        return `${context.dataset.label} ${Math.abs(context.raw)}`;
      }
    }
  };


  // config 
  const config = {
    type: 'bar',
    data,
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
          ticks: {
            callback: function(value, index, values) {
                return Math.abs(value);
            }
          }
        },
        y: {
          beginAtZero: true,
          stacked: true
        }
      },
      plugins: {
        tooltip,
        zoom: {
          pan: {
            enabled: true,
            mode: 'xy',
            threshold: 10
          },
          zoom: {
            wheel:{
              enabled: true
            }
          }
        }
      }
    }
  };

  // render init block
  myChart = new Chart(
    document.getElementById('myChart'),
    config
  ); 


}
//let newData = data.filter(data => data.TIME_PERIOD == year && data.geo==country);

function resetZoomChart(){
  
  myChart.resetZoom(); 
}