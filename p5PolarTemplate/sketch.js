// p5Polar Template
// https://github.com/liz-peng/p5.Polar
// https://liz-peng.github.io/p5.Polar/
// Review the index.html for the <script></script> 

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(255,0,0);

  drawing01();

  noLoop() // stops draw() from looping
}

function drawing01() {
  //code goes here
  // Insert your drawing here
  //ellipse(100, height/2, 50);
  //ellipse(150, height/2, 50);
  //ellipse(200, height/2, 50);
  //ellipse(250, height/2, 50);
  //ellipse(300, height/2, 50);

  //for loop - a piece of code that repeats a certain number of times
  //until a condition is met

  const startingX = 100;
  const s = 50; //size
  const space = 80; // space in between shapes
  for (i=0; i<5; i++){
    ellipse(startingX + i * space, height/2, s);
  }
}

// My first nested for loop
function drawing02() {
  const startingX = 100;
   const s = 50; //size
    const space = 80; // space in between shapes
    for (let i = 0; i < 5; i++) {
     for (let j = 0; j < 5; j++) {
      ellipse(startingX + i * space, height/2, s);
      console.log(j);
    }
  }
}