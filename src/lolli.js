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
  displayLollipopChart(nativeMenData, foreignMenData, nativeWomenData, foreignWomenData);
}



function extractData(data, birth, gender, year, country, rate) {
  // extract the rows from the data table that match the specified birth, gender, year, and country
  let filteredData = data.findRows(birth,"BIRTH").filter(row => row.get("GENDER") == gender && row.get("YEAR") == year && row.get("COUNTRY") == country && row.get("RATE") == rate);
  
  // extract the unemployment rates from the filtered data
  let unemploymentRates = filteredData.map(row => row.get("Value"));

  return unemploymentRates;
}



function displayLollipopChart(nativeMen, foreignMen, nativeWomen, foreignWomen) {
    let x = 50;
    let x2 = 100;
    let y = 0;
    let barWidth = 100;
    let barHeight = 0;

    let colorNative = color(255, 0, 0);
    let colorForeign = color(0, 0, 255);

    //____________________________MEN_______________________________
  
    // Display lollipop for native men in red
    barHeight = nativeMen * 10;
    displayLollipop(x, y, barWidth, barHeight, colorNative);
    let firstLollipopY = y + barHeight;

  
    // Display lollipop for foreign men in blue
    barHeight = foreignMen * 10;
    displayLollipop(x, y, barWidth, barHeight, colorForeign);
    let secondLollipopY = y + barHeight;

    // Connect the two lollipops with a gradient stroke
    let startColor = colorNative;
    let endColor = colorForeign;
    let gradientSteps = 50;
    let gradientIncrement = (secondLollipopY - firstLollipopY) / gradientSteps;

    strokeWeight(3);
    for (let i = 0; i < gradientSteps; i++) {
    let gradientY = firstLollipopY + i * gradientIncrement;
    let gradientColor = lerpColor(startColor, endColor, i / gradientSteps);
    stroke(gradientColor);
    line(x + barWidth / 2, gradientY, x + barWidth / 2, gradientY + gradientIncrement);
    }
    

    //_________________________WOMEN______________________________

    // Display lollipop for native women in red
    barHeight = nativeWomen * 10;
    displayLollipop(x2, y, barWidth, barHeight, colorNative);
    firstLollipopY = y + barHeight;

   
    // Display lollipop for foreign women in blue
    barHeight = foreignWomen * 10;
    displayLollipop(x2, y, barWidth, barHeight, colorForeign);
    secondLollipopY = y + barHeight;


    // Connect the two lollipops with a gradient stroke
    
    startColor = colorNative;
    endColor = colorForeign;
    gradientSteps = 50;
    gradientIncrement = (secondLollipopY - firstLollipopY) / gradientSteps;

    strokeWeight(3);
    for (let i = 0; i < gradientSteps; i++) {
    gradientY = firstLollipopY + i * gradientIncrement;
    gradientColor = lerpColor(startColor, endColor, i / gradientSteps);
    stroke(gradientColor);
    line(x2 + barWidth / 2, gradientY, x2 + barWidth / 2, gradientY + gradientIncrement);
    }

}
  
  


function displayLollipop(x, y, barWidth, barHeight, color) {
    fill(color);
    strokeWeight(1);
    stroke(0, 0, 0);
    
    //line(x + barWidth / 2, y, x + barWidth / 2, y + barHeight);

    ellipse(x + barWidth / 2, y + barHeight, 15, 15);
}
  


  