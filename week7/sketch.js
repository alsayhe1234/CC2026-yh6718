// Here I asked the course LLM if we still need to use the plotter for this
// week's assignment because the template still contained that code.
// It said no, so I removed the plotter code and kept only the basic
// p5.js structure to start my Week 5 assignment.

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  let h = hour();
  console.log(h);

  background(220);
  
}