//My first p5.js sketch drawing

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("blue");
}

function draw() {
background(255,0,255);
  //size of the shapes
  let s1=375;//white
  let s2=200;//yellow
  //below is an array (list )
  let s3=[200,100];
  console.log(s3);

  background("red");
  //white circle
  fill(255,255,255);
  ellipse(200,200,150,s1);
  //yellow circle
  fill(255,255,0);
  ellipse(200,210,100,s2);
  //green square
  fill(0,255,0);
  rect(150,250,100,100);
  //green rectangle
  rectMode(CENTER);
  fill(0,255,0);
  rect(200,400,100,50,s3[0],s3[1]);

  //adding text
  textSize(100);
  fill(0,0,255);
  textAlign(CENTER);
  text("Hello World", width/2, height/2);
}

