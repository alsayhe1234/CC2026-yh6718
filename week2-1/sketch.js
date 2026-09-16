// Variables to hold the current rule choices
let squareScale;
let circleY;
let lineAngle;

// Global variables for color palette
let squareColor;
let circleColor;
let lineColor;

function setup() {
  createCanvas(windowWidth, windowHeight); // [13]
  angleMode(DEGREES); // Measure angles in degrees (0-360) [5]
  rectMode(CENTER);   // Draw squares from their center [14, 15]
  pickNewRules();     // Pick initial random rules [12]
}

function draw() {
  background("red"); // Your red background [16]

  // --- 1. SQUARE (scale: 0.5x / 1x / 2x) ---
  push(); // Save coordinate state [6]
  translate(width / 2, height / 4); // Move origin to center [8]
  scale(squareScale);  // Apply scale rule [10]
  fill(squareColor);               // Set square fill color [5] 
  square(0, 0, 100);                // Draw at new origin [17]
  pop();  // Restore coordinate state [6]

  // --- 2. CIRCLE (translate: up / center / down) ---
  push(); // Save coordinate state [6]
  translate(width / 2, circleY); // Apply translation rule [8]
  fill(circleColor);                // Set circle fill color [5]
  circle(0, 0, 80);                                // Draw circle [18]
  pop();  // Restore coordinate state [6]

  // --- 3. LINE (rotate: 0° / 45° / 90°) ---
  push(); // Save coordinate state [6]
  translate(width / 2, (height * 3) / 4); // Move origin to center [8]
  rotate(lineAngle);                // Apply rotation rule [19]
  stroke(lineColor);                      // Set line color [6, 7]
  strokeWeight(4);                  // Set line thickness [20]
  line(-80, 0, 80, 0);            // Draw line through origin [21]
  pop();  // Restore coordinate state [6]
}

// Automatically runs whenever the user clicks [11]
function mousePressed() {
  pickNewRules();
}

// Picks a random choice from your rules array [12]
function pickNewRules() {
  squareScale   = random([0.5, 1, 2]);       // Scale choices [12]
 circleY = random([
  height / 4,        // UP：same height with Square 
  height / 2,        // CENTER
  (height * 3) / 4   // DOWN：same height with line 
]);
  lineAngle     = random([0, 45, 90]);       // Rotation angle choices [12]

   // 2. Pick new random colors from a list each click!
  squareColor = random(["blue", "yellow", "purple", "orange"]);
  circleColor = random(["white", "pink", "teal", "black"]);
  lineColor   = random(["white", "yellow", "black"]);
}