const size = 2.7;
let countryPolygons = [];
let country = []
const mapHeight = 800
const mapWidth = 1000
let yearSlider;

let maxValEmp;
let minValEmp;

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

function getCenterOfCountry(polys) {
	let center = [0, 0];
	let sumArea = 0;

	for (let i = 0; i < polys[0].length - 3; i++) {
		let area = (polys[0][i + 1][0] - polys[0][i][0]) * (polys[0][i + 2][1] - polys[0][i][1]) - (polys[0][i + 2][0] - polys[0][i][0]) * (polys[0][i + 1][1] - polys[0][i][1])
		area /= 2;
		sumArea += area;

		let x = 0;
		x += polys[0][i][0]
		x += polys[0][i + 1][0]
		x += polys[0][i + 2][0]
		x /= 3;
		center[0] += x * area;

		let y = 0;
		y += polys[0][i][1]
		y += polys[0][i + 1][1]
		y += polys[0][i + 2][1]
		y /= 3;
		center[1] += y * area;
	}
	center[0] /= sumArea
	center[1] /= sumArea
	return center
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

function preload() {
	country = loadJSON('assets/countries.json')
	center_country = loadJSON('assets/center.json')
	employment = loadTable('assets/employment.csv', 'csv', 'header')
	health_rep = loadTable('assets/health_self_report.csv', 'csv', 'header')
}

function setup() {
	createCanvas(mapWidth, mapHeight); //change later when intergrate the diesciption
	country = country['countries'];
	maxValEmp = max(employment.getColumn('Value'))
	minValEmp = min(employment.getColumn('Value'))

	for (let i = 0; i < country.length; i++) {
		let polys = convertPathToPolygons(country[i].vertexPoint)
		countryPolygons.push(
			{
				"name": country[i]["name"],
				"poly": polys,
				"center": getCenterOfCountry(polys),
			}
		);
	}

	yearSlider = createSlider(min(employment.getColumn('Year')), max(employment.getColumn('Year')));
	yearSlider.position(0, 0, 'static');
	yearSlider.style('width', '600px');
}

function draw() {
	colorMode(RGB)
	background(255);
	let collision = false;
	for (let i = 0; i < countryPolygons.length; i++) {
		result = employment.findRows(countryPolygons[i]['name'], 'Country')
		if (result.length === 0) {
			strokeWeight(1);
			stroke(255);
			fill(70);
		} else {
			colorMode(HSL)
			let val = 0;
			for (let x = 0; x < result.length; x++) {
				if (result[x].get('Year') == yearSlider.value() &&
					result[x].get('RATE') == 'U_RATE') {

					val = result[x].get('Value')
					break;
				}
			}
			//fill(16, 70, map(val, minValEmp, maxValEmp, 0, 100));
			strokeWeight(1);
			stroke(255);
			//fill(16, 70, val);
			fill(map(val, 0, 100, 0, 255), 70, map(val, 0, 100, 50, 100));
		}
		if (!collision && mouseIsPressed) {
			collision = countryPolygons[i].poly.some(poly => detectCollision(poly, mouseX, mouseY));
			if (collision) {
				console.log(mouseX, mouseY, countryPolygons[i].name)
				strokeWeight(3);
				stroke('blue');
				fill(40);
				collision = false;
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
		result = employment.findRows(countryPolygons[i]['name'], 'Country')
		if (result.length !== 0) {
			fill(50);
			ellipse(center_country[countryPolygons[i]['name']][0],center_country[countryPolygons[i]['name']][1], 20);
		}
	}

	text(yearSlider.value(), 10, 20);
}
