// p5.plotSvg + p5.Polar Template

p5.disableFriendlyErrors = true; 
let bDoExportSvg = false; 
// if using randomness, experiment w/ myRandomSeed to see different versions (or iterations) of your sketch
let myRandomSeed = 12345; 
let regenerateButton, exportSvgButton; 

// canvas size
const DPI = 70; // dots per inch
const PAGE_W = 8.5*DPI; 
const PAGE_H = 11*DPI;

//------------------------------------------------------------
function setup() {
  createCanvas(PAGE_W, PAGE_H);
  UI();
  noFill();
  // Set the SVG group by stroke color to `true`, so that strokes 
  // of the same color are grouped together in the SVG file. 
  setSvgGroupByStrokeColor(true); 
}

function draw(){
  clear();
  randomSeed(myRandomSeed); 
  background(255); 
  
  if (bDoExportSvg == true){
    beginRecordSvg(this, "myOutput_" + month() + day() + year() + "_" + myRandomSeed + ".svg");
  }

  // define your drawing below
  myDrawing(); 

  if (bDoExportSvg){
    endRecordSvg(); 
    bDoExportSvg = false;
  }
}

function myDrawing() {

  strokeWeight(1); //for this week drawings I used the last week drawings that with two rings,but for the innter ring I used mouse to controal it become to the horizontal row and for the outer ring I used the p5.Polar library to make the rotation. The function actually very diffferent from last week.
  // I tried to coppy from last week and make it have the drawing first, but the p5.polar.js, which is different from last week, so it didn't work,therefore I asked llm, how do I work for this week p5.js template. As the process of change to fit with this week actually, I personally thinkit is like rewrite a new code at all. 
 
  let count = 8;
  let squareSize = 20;

  let centerX = width / 2;
  let centerY = height / 2;

  // ==================================
  // INNER RING
  // Circle -> Horizontal Row
  // mouseY controls the transition
  // ==================================

  let d =
    abs(mouseY - centerY);

  let amount =
    map(d, 0, 150, 1, 0, true);


  for (let i = 1; i <= count; i++) {

    // CIRCLE POSITION

    let angle =
      i * (360 / count);

    let radiansAngle =
      radians(angle);

    let circleX =
      centerX + sin(radiansAngle) * 120;

    let circleY =
      centerY - cos(radiansAngle) * 120;


    // ROW POSITION

    let lineX =
      map(
        i,
        1,
        count,
        centerX - 140,
        centerX + 140
      );

    let lineY =
      centerY;


    // TRANSITION:
    // Circle -> Row

    let currentX =
      lerp(circleX, lineX, amount);

    let currentY =
      lerp(circleY, lineY, amount);


    square(
      currentX - squareSize / 2,
      currentY - squareSize / 2,
      squareSize
    );
  }



  // ==================================
  // OUTER RING
  // p5.Polar
  // mouseX controls rotation
  // ==================================

  let outerRotation =
    map(mouseX, 0, width, -120, 120);


  push();

  setCenter(centerX, centerY);


  for (let i = 1; i <= count; i++) {

    let angle =
      i * (360 / count) + outerRotation;

    polarSquare(
      angle,
      squareSize / 2,
      180
    );
  }


  pop();
}

// Make a new random seed when the "Regenerate" button is pressed
function regenerate(){
  myRandomSeed = round(millis()); 
}

// Set the SVG to be exported when the "Export SVG" button is pressed
function initiateSvgExport(){
  bDoExportSvg = true; 
}

function UI() {
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(0, height);
  regenerateButton.mousePressed(regenerate); // run regenerate() when pressed
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(120, height);
  exportSvgButton.mousePressed(initiateSvgExport); // run initiateSvgExport() when pressed
}

/*
This template uses the following sketch as a starting point: 
https://editor.p5js.org/golan/sketches/LRTXmDg2q

Additional references/info:
https://github.com/golanlevin/p5.plotSvg
https://github.com/liz-peng/p5.Polar
https://github.com/golanlevin/p5.plotSvg/blob/main/documentation.md#beginrecordsvg
https://github.com/golanlevin/p5.plotSvg/blob/main/documentation.md#endrecordsvg

*/