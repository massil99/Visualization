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
  createCanvas(500, 500);
  
  

  // specify the year and country for which you want to display the chart
  year = "2018";
  country = "FRA";
  rate = "U_RATE";

  // extract the relevant data from the dataset
  nativeMenData = extractData(unemploymentData, "NB", "MEN", year, country, rate);
  nativeWomenData = extractData(unemploymentData, "NB", "WMN", year, country, rate);
  foreignMenData = extractData(unemploymentData, "FB", "MEN", year, country, rate);
  foreignWomenData = extractData(unemploymentData, "FB", "WMN", year, country, rate);

}



function draw(){
  //translate(0, -height);
  //scale(1, -1);
  
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
    
    let margin = 100;

    let x = margin + 40;
    let x2 = margin + 100;
    let y = height;
    let barWidth = 0;
    let barHeight = 0;

    let colorNative = color(255, 40, 40); //red
    let colorForeign = color(255, 222, 20);  //yellow

    let maxValue=max([nativeMen,nativeWomen,foreignMen,foreignWomen]) * 10;
    //console.log(maxValue);


    // X axis
    line(margin, height - margin, margin + 150, height - margin);

    // Y axis
    //line(margin, height-margin-200, margin, height-margin);
    line(margin, height - margin - ( maxValue + 70 ), margin, height - margin);

	

    //____________________________MEN_______________________________
  
    // Display lollipop for native men in red
    barHeight = nativeMen * 10 + margin;
    displayLollipop(x, y, barWidth, barHeight, colorNative);
    let firstLollipopY = y - barHeight;

  
    // Display lollipop for foreign men in yellow
    barHeight = foreignMen * 10 + margin;
    displayLollipop(x, y, barWidth, barHeight, colorForeign);
    let secondLollipopY = y - barHeight;

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
    barHeight = nativeWomen * 10 + margin;
    displayLollipop(x2, y, barWidth, barHeight, colorNative);
    firstLollipopY = y - barHeight ;

   
    // Display lollipop for foreign women in yellow
    barHeight = foreignWomen * 10 + margin;
    displayLollipop(x2, y, barWidth, barHeight, colorForeign);
    secondLollipopY = y - barHeight;


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



    //___________________________SCALES________________________________



    fill(0, 0, 0);
    //nostroke();
    strokeWeight(0);
    textAlign(CENTER);
    text("MEN", x ,height - margin + 20);
    text("WOMEN", x2, height - margin + 20);



    for (var k = 0; k <= maxValue + 30; k = k + 20){
      textAlign(CENTER);
      text(k / 10, margin - 10, height - margin - k);
    }
    textAlign(RIGHT);
    text("% \nUnemployement", margin - 5, height - margin - k - 20);


  }
  
  


function displayLollipop(x, y, barWidth, barHeight, color) {
    fill(color);
    strokeWeight(1);
    //stroke(0, 0, 0);
    
    //line(x + barWidth / 2, y, x + barWidth / 2, y + barHeight);

    ellipse(x + barWidth / 2, y - barHeight, 15, 12);

}
  



  