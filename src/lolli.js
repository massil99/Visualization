let unemploymentData;

let nativeMenData;
let nativeWomenData;
let foreignMenData;
let foreignWomenData;

let year;
let country;
let rate;

function preload() {
  // load the csv file containing the unemployment data
  unemploymentData = loadTable("assets/employment.csv", "csv", "header");
}

function setup() {
  // create a canvas to display the chart
  createCanvas(800, 600);

  // specify the year and country for which you want to display the chart
  year = "2020";
  country = "FRA";
  rate = "U_RATE";

  // extract the relevant data from the dataset
  nativeMenData = extractData(unemploymentData, "NB", "MEN", year, country, rate);
  nativeWomenData = extractData(unemploymentData, "NB", "WMN", year, country, rate);
  foreignMenData = extractData(unemploymentData, "FB", "MEN", year, country, rate);
  foreignWomenData = extractData(unemploymentData, "FB", "WMN", year, country, rate);

  // display the bar chart
}

function draw(){
  displayBarChart(nativeMenData, nativeWomenData, foreignMenData, foreignWomenData);
}

function extractData(data, birth, gender, year, country, rate) {
  // extract the rows from the data table that match the specified birth, gender, year, and country
  let filteredData = data.findRows(birth,"BIRTH").filter(row => row.get("GENDER") == gender && row.get("YEAR") == year && row.get("COUNTRY") == country && row.get("RATE") == rate);
  
  // extract the unemployment rates from the filtered data
  let unemploymentRates = filteredData.map(row => row.get("Value"));

  return unemploymentRates;
}

function displayBarChart(nativeMenData, nativeWomenData, foreignMenData, foreignWomenData) {

  // display the bars for each group
  displayBar(50, nativeMenData, "Native Men");
  displayBar(150, nativeWomenData, "Native Women");
  displayBar(250, foreignMenData, "Foreign Men");
  displayBar(350, foreignWomenData, "Foreign Women");
}

function displayBar(x, value, label) {
  // draw the bar for the specified value and label
  fill(255, 0, 0);
  rect(x, height - value, 50, value);
  text(label, x, height - value - 10);
}






