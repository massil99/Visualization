const size = 2;
let countryPolygons = [];
let country = []

const mapHeight = 700;
const mapWidth = 900;
let yearSlider;
let year = 2011;

let popUp;
let showPopup;
let chartBtns;
let resetPyramid;

let selected_country;
let selected_country_code;
let hovered_country;

let max_h_rate = 0
let min_h_rate = 0

let max_circleSize = 140
let min_circleSize = 10

let myChart;
let pyramid;

let unemploymentData;

let nativeMenData;
let nativeWomenData;
let foreignMenData;
let foreignWomenData;

let rate;
let selected_chart = 0;

function extractData(data, birth, gender, year, country, rate) {
	// extract the rows from the data table that match the specified birth, gender, year, and country
	let filteredData = data.findRows(country, "Country").filter(row => row.get("GENDER") == gender && birth == row.get("BIRTH") && row.get("Year") == year && row.get("RATE") == rate);
	console.log(data.findRows(country, "Country"))

	// extract the unemployment rates from the filtered data
	let unemploymentRates = filteredData.map(row => row.get("Value"));

	return unemploymentRates;
}



function displayLollipopChart(nativeMen, foreignMen, nativeWomen, foreignWomen) {
	colorMode(RGB);
	let margin = 120;

	let x = popUp.x + margin + 20;
	let x2 = popUp.x + margin + 120;
	let y = popUp.height + popUp.y - margin;
	let barWidth = 0;
	let barHeight = 0;

	let colorNative = color(255, 40, 40); //red
	let colorForeign = color(255, 222, 20);  //yellow

	let maxValue = max([nativeMen, nativeWomen, foreignMen, foreignWomen]) * 10;



	strokeWeight(1);
	stroke(0);
	// X axis
	line(popUp.x + margin, popUp.height + popUp.y - margin, popUp.x + margin + 150, popUp.height + popUp.y - margin);

	// Y axis
	line(popUp.x + margin, popUp.height + popUp.y - margin - (maxValue + 70), popUp.x + margin, popUp.height + popUp.y - margin);



	//_______________________________MEN_____________________________________


	// Display lollipop for native men in red
	barHeight = nativeMen * 10;
	stroke(255);
	displayLollipop(x, y, barWidth, barHeight, colorNative);
	let firstLollipopY = y - barHeight;


	// Display lollipop for foreign men in yellow
	barHeight = foreignMen * 10;
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



	//____________________________WOMEN_________________________________________


	// Display lollipop for native women in red
	barHeight = nativeWomen * 10;
	stroke(255);
	displayLollipop(x2, y, barWidth, barHeight, colorNative);
	firstLollipopY = y - barHeight;


	// Display lollipop for foreign women in yellow
	barHeight = foreignWomen * 10;
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



	//______________________________LEGEND_________________________________________


	//strokeweight(1);

	// Draw legend in top right corner
	let legendX = width - margin - 40;
	let legendY = height - margin - (maxValue + 70);
	let legendSize = 15;

	// Draw legend for native population
	fill(colorForeign);
	//stroke(255);
	rect(legendX, legendY, legendSize, legendSize);
	fill(0);
	textSize(12);
	textAlign(LEFT);
	strokeWeight(0);
	text("Foreign Born", legendX + legendSize + 10, legendY + legendSize);

	// Draw legend for foreign population
	fill(colorNative);
	stroke(255);
	rect(legendX, legendY + 30, legendSize, legendSize);
	fill(0, 0, 0);
	textSize(12);
	strokeWeight(0);
	text("Native Born", legendX + legendSize + 10, legendY + legendSize + 30);




	//______________________________SCALES________________________________



	fill(0, 0, 0);
	//nostroke();
	strokeWeight(0);
	textAlign(CENTER);
	text("MEN", x, popUp.y + popUp.height - margin + 20);
	text("WOMEN", x2, popUp.y + popUp.height - margin + 20);



	for (var k = 0; k <= maxValue + 30; k = k + 20) {
		textAlign(CENTER);
		text(k / 10, popUp.x + margin - 10, popUp.height + popUp.y- margin - k);
	}
	textAlign(RIGHT);
	text("% \nUnemployement", popUp.x + margin - 5, popUp.height+ popUp.y - margin - k - 25);

	//displayLollipopChart(nativeMenData, foreignMenData, nativeWomenData, foreignWomenData);
}


function displayLollipop(x, y, barWidth, barHeight, color) {
	fill(color);
	strokeWeight(1);
	ellipse(x + barWidth / 2, y  - barHeight , 15);
}

function setGradient(x, y, w, h, c1, c2, axis) {
	noFill();

	if (axis === 1) {
		// Top to bottom gradient
		for (let i = y; i <= y + h; i++) {
			let inter = map(i, y, y + h, 0, 1);
			let c = lerpColor(c1, c2, inter);
			stroke(c);
			line(x, i, x + w, i);
		}
	} else if (axis === 0) {
		// Left to right gradient
		for (let i = x; i <= x + w; i++) {
			let inter = map(i, x, x + w, 0, 1);
			let c = lerpColor(c1, c2, inter);
			stroke(c);
			line(i, y, i, y + h);
		}
	}
}

function convertPathToPolygons(path) {
	let coord_point = [0, 0];
	let polygons = [];
	let currentPolygon = [];

	for (const node of path) {
		if (node[0] == "m") {
			coord_point[0] += node[1] * size;
			coord_point[1] += node[2] * size;
			currentPolygon = [];
		} else if (node[0] == "M") {
			coord_point[0] = node[1] * size;
			coord_point[1] = node[2] * size;
			currentPolygon = [];
		} else if (node == "z") {
			currentPolygon.push([...coord_point]);
			polygons.push(currentPolygon);
		} else {
			currentPolygon.push([...coord_point]);
			coord_point[0] += node[0] * size;
			coord_point[1] += node[1] * size;
		}
	}

	return polygons;
}

function detectCollision(polygon, x, y) {
	let c = false;
	// for each edge of the polygon
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		// Compute the slope of the edge
		let slope = (polygon[j][1] - polygon[i][1]) / (polygon[j][0] - polygon[i][0]);

		// If the mouse is positioned within the vertical bounds of the edge
		if (((polygon[i][1] > y) != (polygon[j][1] > y)) &&
			// And it is far enough to the right that a horizontal line from the
			// left edge of the screen to the mouse would cross the edge
			(x > (y - polygon[i][1]) / slope + polygon[i][0])) {

			// Flip the flag
			c = !c;
		}
	}

	return c;
}

function hidePopu() {
	showPopup = false;
	Chart.getChart('myChart').destroy();
}

function preload() {
	country = loadJSON('assets/countries.json')
	center_country = loadJSON('assets/center.json')
	employment = loadTable('assets/employment.csv', 'csv', 'header')
	health_rep = loadTable('assets/health_self_report.csv', 'csv', 'header')
	country_code = loadJSON('assets/names.json')
}

function setup() {
	const myCanvas = createCanvas(mapWidth, mapHeight); //change later when intergrate the diesciption
	myCanvas.parent('p5stuff')

	resetPyramid = createButton('reset');
	resetPyramid.parent('chartBox');
	resetPyramid.mousePressed(resetZoomChart);

	let offset = 40;
	popUp = { 'x': offset, 'y': offset, 'width': mapWidth - offset * 2, 'height': mapHeight - offset * 2 }

	closebtn = createButton('X')
	closebtn.parent('p5stuff')
	closebtn.addClass('closeBtn')
	closebtn.position(popUp.width + offset, -popUp.height - offset, 'relative')
	closebtn.mousePressed(hidePopu);
	closebtn.hide();

	chartBtns = createDiv()
	chartBtns.id('btns')
	chartBtns.parent('p5stuff');
	chartBtns.hide();

	u = createButton('Employement');
	u.parent('btns')
	u.addClass('chartBtns')
	u.mousePressed(()=>selected_chart = 0)

	h = createButton('Health');
	h.parent('btns')
	h.addClass('chartBtns')
	h.mousePressed(()=>selected_chart = 1)

	yearSlider = createSlider(min(employment.getColumn('Year')), max(employment.getColumn('Year')), 2014);
	yearSlider.parent('p5stuff')
	yearSlider.position(0, 0, 'relative');
	yearSlider.style('width', `${mapWidth}px`);

	country = country['countries'];

	max_h_rate = max(health_rep.getColumn('OBS_VALUE'))
	min_h_rate = min(health_rep.getColumn('OBS_VALUE'))

	for (let i = 0; i < country.length; i++) {
		let polys = convertPathToPolygons(country[i].vertexPoint)
		countryPolygons.push(
			{
				"code": country_code[country[i]["name"]],
				"name": country[i]["name"],
				"poly": polys,
			}
		);
	}

	pyramid = select('.chartCard')
	pyramid.position(330, mapHeight - 500, 'absolute')
	pyramid.hide()

	///////////////////////////////////////

	// specify the year and country for which you want to display the chart
	year = "2020";
	country = "GRC";
	rate = "U_RATE";
}

function draw() {
	colorMode(RGB)
	background(211, 211, 211);
	let collision = false;

	////////////////////////////////////////////////
	nativeMenData = extractData(employment, "NB", "MEN", year, selected_country, rate);
	nativeWomenData = extractData(employment, "NB", "WMN", year, selected_country, rate);
	foreignMenData = extractData(employment, "FB", "MEN", year, selected_country, rate);
	foreignWomenData = extractData(employment, "FB", "WMN", year, selected_country, rate);

	for (let i = 0; i < countryPolygons.length; i++) {
		colorMode(HSL)
		result = health_rep.findRows(countryPolygons[i]['code'], 'geo')
		result = result.filter(row => row.get('TIME_PERIOD') == year)
		if (result.length !== 0) {
			let val = result.reduce((acc, r) => {
				return acc + (parseFloat(r.get('OBS_VALUE')) != NaN) ? parseFloat(r.get('OBS_VALUE')) : 0
			}, 0);
			let d = result.reduce((acc, r) => acc + (parseFloat(r.get('OBS_VALUE')) != NaN) ? 1 : 0, 0)
			val /= d
			//let val = result[0].get('OBS_VALUE') * 100
			strokeWeight(1);
			stroke(255);
			fill(map(val, min_h_rate, max_h_rate, 0, 360), 80, map(val, min_h_rate, max_h_rate, 40, 90));
		} else {
			strokeWeight(1);
			stroke(255);
			fill(70)
		}

		if (!showPopup && !collision) {
			collision = countryPolygons[i].poly.some(poly => detectCollision(poly, mouseX, mouseY));
			if (collision) {
				hovered_country = countryPolygons[i].name
				if (mouseIsPressed) {
					selected_country = countryPolygons[i].name
					selected_country_code = countryPolygons[i].code
					showPopup = true;
					myChart = createPyramid(year, selected_country_code);
				}
			}
		}

		for (const poly of countryPolygons[i].poly) {
			beginShape();
			for (const vert of poly) {
				vertex(...vert);
			}
			endShape();
		}
	}

	for (let i = 0; i < countryPolygons.length; i++) {
		if (hovered_country === countryPolygons[i].name ||
			selected_country === countryPolygons[i].name) {
			stroke('lightblue');
			colorMode(RGB)
			fill(140, 140, 175);
			collision = false;

			for (const poly of countryPolygons[i].poly) {
				beginShape();
				for (const vert of poly) {
					vertex(...vert);
				}
				endShape();
			}

			strokeWeight(1);
			stroke(255);

			if (showPopup === true) {
				fill('#0007');
				rect(0, 0, width, height);
				fill(200);
				rect(popUp.x, popUp.y, popUp.width, popUp.height);
				closebtn.style('display', 'inline');
				chartBtns.show();
				if(selected_chart === 1){
					pyramid.show();
					textSize(40);
					textAlign(CENTER)
					fill(0)
					text('Health', mapWidth/2, popUp.y + 50 );
				}else{
					textSize(40);
					textAlign(CENTER)
					fill(0)
					text('Unemployment', mapWidth/2, popUp.y + 50);
					pyramid.hide();
  					displayLollipopChart(nativeMenData, foreignMenData, nativeWomenData, foreignWomenData);
				}
				textAlign(LEFT);

			} else {
				selected_country = ''
				closebtn.hide();
				chartBtns.hide();
				pyramid.hide();
			}
			fill(100);
		}
	}


	if (!showPopup) {
		for (let i = 0; i < countryPolygons.length; i++) {
			result = employment.findRows(countryPolygons[i]['name'], 'Country')
			result = result.filter(row => row.get('Year') == year && row.get('RATE') === 'U_RATE')
			if (result.length !== 0) {
				fill('#09aff677');
				ellipse(center_country[countryPolygons[i]['name']][0],
					center_country[countryPolygons[i]['name']][1],
					map(result[0].get('Value'), 0, 100, min_circleSize, max_circleSize));
			}
		}
		colorMode(RGB)
		fill(0);
		textSize(20)
		text(year, 10, 20);

		let text_x = mapWidth - 320
		let med_rate = 0
		let emp_rate = 0
		for (let i = 0; i < countryPolygons.length; i++) {
			if (countryPolygons[i]['name'] === hovered_country) {
				result = employment.findRows(countryPolygons[i]['name'], 'Country')
				result = result.filter(row => row.get('Year') == year && row.get('RATE') === 'U_RATE')
				if (result.length !== 0) {
					emp_rate = result[0].get('Value')
				}

				result = health_rep.findRows(countryPolygons[i]['code'], 'geo')
				result = result.filter(row => row.get('TIME_PERIOD') == year)
				if (result.length !== 0)
					med_rate = (result.reduce((acc, r) => acc + (r.get('OBS_VALUE') !== '') ? parseFloat(r.get('OBS_VALUE')) : 0, 0) / result.length)
			}
		}

		fill(40);
		textSize(16)
		text(`${hovered_country}`, text_x, mapHeight - 60);
		textSize(13)
		text(`Unemplyment rate: ${parseFloat(emp_rate).toFixed(2)}%`, text_x, mapHeight - 40);
		//text(`Avg. rate of unmet medical exam.: ${parseFloat(med_rate).toFixed(2)}%`, text_x, mapHeight - 20);

		const leg_x = 50
		stroke(255);
		fill('#09aff677');
		strokeWeight(1);
		textSize(12);
		ellipse(leg_x, mapHeight - 40 - min_circleSize / 2, min_circleSize);
		ellipse(leg_x + 5 + max_circleSize / 2, mapHeight - 40 - max_circleSize / 2, max_circleSize);
		fill(0);
		text(0, leg_x, mapHeight - 30)
		text(100, leg_x + 5 + max_circleSize / 2, mapHeight - 30)

		text('Unemployment rate', leg_x, mapHeight)

		colorMode(HSL);
		setGradient(leg_x + max_circleSize + min_circleSize + 10, height - 60, 100, 7,
			color('hsl(0, 80%, 40%)'),
			color('hsl(180, 80%, 90%)'),
			0);

		stroke(255);
		fill(0);
		text(min_h_rate, leg_x + max_circleSize + min_circleSize + 10, height - 30)
		text(max_h_rate, leg_x + max_circleSize + min_circleSize + 10 + 100, height - 30)

		text('Avg. unmet medical exam.', leg_x + max_circleSize + min_circleSize + 10, height)
	}


	hovered_country = ''
	year = yearSlider.value()


}

/////////////////////////////////////////////////////////////////////////

function createPyramid(year, country) {
	d3.csv("assets/test/test.csv", d => {
		return {
			age: d.age,
			sex: d.sex,
			reason: d.reason,
			geo: d.geo,
			years: +d.TIME_PERIOD,
			percent: +d.OBS_VALUE,
		}
	}).then(data => {
		makechart(data, year, country);
		resetZoomChart();
	})

}

function makechart(data1, year, country) {
	const agegroup = 'Y_GE16'
	// setup 
	let newDataF = data1.filter(data => data.years == year && data.geo == country && data.sex == 'F' && data.age == agegroup);
	let newDataM = data1.filter(data => data.years == year && data.geo == country && data.sex == 'M' && data.age == agegroup);

	const listreasonF = [];
	const listvalueF = [];
	const listgroupF = [];
	const listreasonM = [];
	const listvalueM = [];
	const listgroupM = [];
	for (const row of newDataF) {
		listreasonF.push(row.reason);
		listvalueF.push(row.percent);
		listgroupF.push(row.age)
	}


	for (const row of newDataM) {
		listreasonM.push(row.reason);
		listvalueM.push(row.percent);
		listgroupM.push(row.age);
	}


	const female = listvalueM;
	const femaleData = [];
	female.forEach(element => femaleData.push(element * -1))

	var data = {
		labels: listreasonF,

		datasets: [{
			label: 'Male',
			data: listvalueF,
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

	const reasondic = { 'TOOEXP': 'Too expensive', 'TOOFAR': 'Too far to travel', 'TOOEFW': 'Too expensive or too far to travel or waiting list', 'NOTIME': 'No time', 'NO_UNMET': 'No unmet needs to declare', 'NOKNOW': 'Did not know any good doctor or specialist', 'WAITING': 'Waiting list', 'FEAR': 'Fear of doctor, hospital, examination or treatment', 'HOPING': 'Wanted to wait and see if problem got better on its own', 'OTH': 'Other reason' };

	// block tooltip
	const tooltip = {
		yAlign: 'bottom',
		titleAligh: 'center',
		callbacks: {
			label: function (context) {
				return ` ${reasondic[context.label]}   ${context.dataset.label}   ${Math.abs(context.raw)}%`;
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
					title: {
						display: true,
						text: 'Percentages'
					},
					stacked: true,
					ticks: {
						callback: function (value, index, values) {
							return Math.abs(value);
						}
					}
				},
				y: {
					title: {
						display: true,
						text: 'Reasons'
					},
					beginAtZero: true,
					stacked: true
				}
			},
			plugins: {
				legend: {
					position: "top",
					align: "middle"
				},
				tooltip,
				zoom: {
					pan: {
						enabled: true,
						mode: 'xy',
						threshold: 10
					},
					zoom: {
						wheel: {
							enabled: true
						}
					}
				}
			}
		}
	};

	// render init block
	return new Chart(
		document.getElementById('myChart'),
		config
	);
}
//let newData = data.filter(data => data.TIME_PERIOD == year && data.geo==seledted_country_code);

function resetZoomChart() {
	Chart.getChart('myChart').resetZoom();
}