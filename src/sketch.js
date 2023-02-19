const size = 2;
let countryPolygons = [];
let country = []
const mapHeight = 700;
const mapWidth = 900;
let yearSlider;

let popUp;
let showPopup;
let chartBtns;

let selected_country;
let hovered_country;

let max_h_rate = 0
let min_h_rate = 0

let max_circleSize = 140
let min_circleSize = 10

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

	h = createButton('Health');
	h.parent('btns')
	h.addClass('chartBtns')

	yearSlider = createSlider(min(employment.getColumn('Year')), max(employment.getColumn('Year')));
	yearSlider.parent('p5stuff')
	yearSlider.position(0, 0, 'relative');
	yearSlider.style('width', `${mapWidth}px`);

	country = country['countries'];

	max_h_rate = max(health_rep.getColumn('OBS_VALUE'))
	min_h_rate = min(health_rep.getColumn('OBS_VALUE'))
	console.log(min_h_rate, max_h_rate)

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
}

function draw() {
	colorMode(RGB)
	background(211, 211, 211);
	let collision = false;

	for (let i = 0; i < countryPolygons.length; i++) {
		colorMode(HSL)
		result = health_rep.findRows(countryPolygons[i]['code'], 'geo')
		result = result.filter(row => row.get('TIME_PERIOD') == yearSlider.value())

		if (result.length !== 0) {
			let val = (result.reduce((acc, r) => r.get('OBS_VALUE'), 0) / result.length)
			//let val = result[0].get('OBS_VALUE') * 100
			strokeWeight(1);
			stroke(255);
			fill(map(val, min_h_rate, max_h_rate, 0, 180), 80, 50);
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
					showPopup = true;
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
			} else {
				selected_country = ''
				closebtn.hide();
				chartBtns.hide();
			}
			fill(100);
		}
	}


	if (!showPopup) {
		for (let i = 0; i < countryPolygons.length; i++) {
			result = employment.findRows(countryPolygons[i]['name'], 'Country')
			result = result.filter(row => row.get('Year') == yearSlider.value() && row.get('RATE') === 'U_RATE')
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
		text(yearSlider.value(), 10, 20);

		let text_x = mapWidth - 320
		let med_rate = 0
		let emp_rate = 0
		for (let i = 0; i < countryPolygons.length; i++) {
			if (countryPolygons[i]['name'] === hovered_country) {
				result = employment.findRows(countryPolygons[i]['name'], 'Country')
				result = result.filter(row => row.get('Year') == yearSlider.value() && row.get('RATE') === 'U_RATE')
				if (result.length !== 0) {
					emp_rate = result[0].get('Value')
				}

				result = health_rep.findRows(countryPolygons[i]['code'], 'geo')
				result = result.filter(row => row.get('TIME_PERIOD') == yearSlider.value())
				if (result.length !== 0)
					med_rate = (result.reduce((acc, r) => r.get('OBS_VALUE'), 0) / result.length)
			}
		}

		textSize(13)
		fill(40);
		text(`Unemplyment rate: ${parseFloat(emp_rate).toFixed(2)}%`, text_x, mapHeight - 40);
		text(`Avg. rate of unmet medical exam.: ${parseFloat(med_rate).toFixed(2)}%`, text_x, mapHeight - 20);

		const leg_x = 50
		stroke(255);
		fill('#09aff677');
		strokeWeight(1);
		textSize(12);
		ellipse(leg_x, mapHeight - 40 - min_circleSize / 2, min_circleSize);
		ellipse(leg_x + 5 + max_circleSize / 2, mapHeight - 40 - max_circleSize / 2, max_circleSize);
		fill(0);
		text(0, leg_x, mapHeight - 30)
		text(100, leg_x + 5 + max_circleSize / 2, mapHeight- 30)

		text('Unemployment rate', leg_x , mapHeight)

		colorMode(HSL);
		setGradient(leg_x + max_circleSize + min_circleSize + 10, height - 60, 100, 7,
						color('hsl(0, 80%, 60%)'), 
						color('hsl(180, 80%, 60%)'), 
						0);

		stroke(255);
		fill(0);
		text(min_h_rate, leg_x + max_circleSize + min_circleSize + 10, height - 30)
		text(max_h_rate, leg_x + max_circleSize + min_circleSize + 10 + 100, height - 30 )

		text('Avg. unmet medical exam.', leg_x + max_circleSize + min_circleSize + 10, height)
	}


	hovered_country = ''
}
