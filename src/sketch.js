const size = 0.6;
let countryPolygons = [];
let country = []

function convertPathToPolygons(path) {
  let coord_point = [0, 0];
  let polygons = [];
  let currentPolygon = [];

  //For loop para calcular os pontos do vertex
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

function preload(){
  country = loadJSON('countries.json')
}

function setup() {
  createCanvas(1200, 600);
  country = country['countries']

  for (let i = 0; i < country.length; i++) {
    countryPolygons.push(convertPathToPolygons(
      country[i].vertexPoint
    ));
  }
}

function draw() {
  stroke(255);
  strokeWeight(1);
  let collision = false;
  for (let i = 0; i < countryPolygons.length; i++) {
    fill(100);
    if (!collision && mouseIsPressed) {
      collision = countryPolygons[i].some(poly => detectCollision(poly, mouseX, mouseY));
      if (collision) {
        fill('green');
      }
    }

    for (const poly of countryPolygons[i]) {
      beginShape();
      for (const vert of poly) {
        vertex(...vert);
      }
      endShape();
    }
  }
}
