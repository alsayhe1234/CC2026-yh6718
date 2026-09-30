
// Plotter Template #2 (includes p5.Polar and p5.plotSvg)

// Press "s" to export drawing as SVG

p5.disableFriendlyErrors = true; // keep warnings quiet
let bDoExportSvg = false;

// This canvas dimensions are 8.5"x11" at 70 dpi
const DPI = 70; // dots per inch 
const PAGE_W = 8.5 * DPI;
const PAGE_H = 11 * DPI;


function setup() {
  createCanvas(PAGE_W, PAGE_H);
  noFill();
  setSvgGroupByStrokeColor(true); 
}

function draw() {
  background(255);
  if (bDoExportSvg) {
    beginRecordSvg("output.svg");
  }
  
  myDrawing();

  if (bDoExportSvg) {
    endRecordSvg();
    bDoExportSvg = false;
  }
}
////////////////////////////////////////

function myDrawing() {

  angleMode(DEGREES);

  let centerX = width / 2;
  let centerY = height / 2;

  let count = 8;
  let squareSize = 20;


  // ==================================
  // INNER RING
  // Circle -> Horizontal Row
  // ==================================

  // Distance from mouse to the final row
  let d = abs(mouseY - centerY);

  // Close to row = 1
  // Far from row = 0
  let lineUpAmount = map(d, 0, 150, 1, 0, true);

  for (let i = 0; i < count; i++) {

    let angle = (360 / count) * i;

    // Circle position
    let circleX = centerX + 120 * cos(angle);
    let circleY = centerY + 120 * sin(angle);

    // Row position
    let lineX = map(
      i,
      0,
      count - 1,
      centerX - 140,
      centerX + 140
    );

    let lineY = centerY;

    // Move between circle and row
    let currentX =
      lerp(circleX, lineX, lineUpAmount);

    let currentY =
      lerp(circleY, lineY, lineUpAmount);

    push();

    translate(currentX, currentY);

    square(
      -squareSize / 2,
      -squareSize / 2,
      squareSize
    );

    pop();
  }


  // ==================================
  // OUTER RING
  // Rotates with mouseX
  // ==================================

  let outerRotation =
    map(mouseX, 0, width, -120, 120);

  for (let i = 0; i < count; i++) {

    let angle =
      (360 / count) * i + outerRotation;

    let x =
      centerX + 180 * cos(angle);

    let y =
      centerY + 180 * sin(angle);

    push();

    translate(x, y);

    rotate(angle);

    square(
      -squareSize / 2,
      -squareSize / 2,
      squareSize
    );

    pop();
  }
}


function keyPressed() {
  if (key == "s") {
    bDoExportSvg = true;
  }
}
