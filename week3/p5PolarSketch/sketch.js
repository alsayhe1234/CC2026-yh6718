// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(255,0,0);
  // Insert your drawing here
   setCenter(width / 2, height / 2);

   let rotation = 0;

   let mouseRotation = map(mouseX, 0, width, 0, 45);

  for (let distance = 120; distance <= 180; distance += 60) {

  push();

  rotate(rotation);

  polarSquares(8, 20, distance);

  pop();

  rotation += mouseRotation;;
}
}
