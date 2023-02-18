const size = 2;
let countryPolygons = [];
let country = []
const mapHeight = 700;
const mapWidth = 900;
let yearSlider;

let popUp;
let showPopup;

let selected_country;
let hoverd_country;

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
}

function setup() {
	yearSlider = createSlider(min(employment.getColumn('Year')), max(employment.getColumn('Year')));
	yearSlider.parent('p5stuff')
	yearSlider.position(0, 0, 'relative');
	yearSlider.style('width', `${mapWidth}px`);

	let offset = 40;
	popUp = { 'x': offset, 'y': offset, 'width': mapWidth - offset * 2, 'height': mapHeight - offset * 2 }

	closebtn = createButton('X')
	closebtn.parent('p5stuff')
	closebtn.addClass('closeBtn')
	closebtn.position(-popUp.x, popUp.y, 'relative')
	closebtn.mousePressed(hidePopu);
	closebtn.hide();

	const myCanvas = createCanvas(mapWidth, mapHeight); //change later when intergrate the diesciption
	myCanvas.parent('p5stuff')
	country = country['countries'];
	maxValEmp = max(employment.getColumn('Value'))
	minValEmp = min(employment.getColumn('Value'))

	for (let i = 0; i < country.length; i++) {
		let polys = convertPathToPolygons(country[i].vertexPoint)
		countryPolygons.push(
			{
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
		result = employment.findRows(countryPolygons[i]['name'], 'Country')
		colorMode(HSL)
		result = result.filter(row => row.get('Year') == yearSlider.value() &&
			row.get('RATE') == 'U_RATE')

		if (result.length !== 0) {
			let val = result[0].get('Value')
			//fill(16, 70, map(val, minValEmp, maxValEmp, 0, 100));
			strokeWeight(1);
			stroke(255);
			//fill(16, 70, val);
			fill(150, 70, map(val, 0, 100, 0, 100));
		} else {
			strokeWeight(1);
			stroke(255);
			fill(70)
		}

		if (!showPopup && !collision) {
			collision = countryPolygons[i].poly.some(poly => detectCollision(poly, mouseX, mouseY));
			if (collision) {
				hoverd_country = countryPolygons[i].name
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
		if (selected_country === countryPolygons[i].name) {
			strokeWeight(3);
			stroke('blue');
			fill(40);
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
				fill(0, 0, 0, 0.5);
				rect(0, 0, width, height);
				fill(90);
				rect(popUp.x, popUp.y, popUp.width, popUp.height);
				closebtn.style('display', 'inline');
			} else {
				selected_country = ''
				console.log('hiding button')
				closebtn.hide();
			}
			fill(100);
		}
	}

	if (!showPopup) {
		for (let i = 0; i < countryPolygons.length; i++) {
			result = employment.findRows(countryPolygons[i]['name'], 'Country')
			if (result.length !== 0) {
				fill(50, 50, 50, 0.8);
				ellipse(center_country[countryPolygons[i]['name']][0], center_country[countryPolygons[i]['name']][1], 20);
			}
		}

	}

	fill(0);
	textSize(20)
	text(yearSlider.value(), 10, 20);
}
