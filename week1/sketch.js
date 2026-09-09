// change the quotes in this array. Be mindful of the quotation marks!
// this is the only part of the file you need to edit!

const quotes = [
  { text: "programming for artistic expression, not utility.", source: "Quiet Canvas Staff, 2026" },
  { text: "the practice of combining programming techniques with artistic expression in order to create aesthetically pleasing and optimized interactive digital experiences.", source: "SMU Meadows School of the Arts, 2024" },
  { text: "not a tool; it is a new material for expression.", source: "John Maeda, 1999" },
  { text: "a mode of computer-based work “that emphasizes the expressivity of computer programming beyond something pragmatic and functional", source: "John Maeda, 2004" },
  { text: "a new interdisciplinary art form that bridges the gap between technologists and artists.", source: "Ahmad Moussa, 2023" },
  { text: "a loosely defined term used to describe a wide range of artistic practices that use computer code as a medium.", source: "Raphaël de Courville, naoto-hieda, and Alexandre B A Villares, 2021" },
  { text: "where programming becomes a medium for self-expression and innovation.", source: "Laylah Bulman, 2025" },
  { text: "a process, based on exploration, iteration, reflection and discovery, where code is used as the primary medium to create a wide range of media artifacts.", source: "Mark Mitchell, Oliver C. Bown, 2013" }
];
// no need to edit anything below this line! 
// if you have made an error, you can check your history to see what might have gone wrong

// a variable that holds the current quote
let current = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Seed with millis() so each page load gives a different quote.
  randomSeed(millis());
  textSize(36);
  fill(10, 255, 236);
  // calls the function to pick a quote
  pickQuote();
}

function pickQuote() {
  // take a random number and use that to identify what quote to use
  current = quotes[floor(random(quotes.length))];
}

function draw() {
  background(128, 56, 236); // set the background color
  drawQuote();  // draw the quote on screen
}

function drawQuote() {   // draw text
  fill(10,31,236);
  textFont("Helvetica");
  textAlign(CENTER, CENTER);
  text("Creative Coding is.....", width / 2, height / 2 - 48);
  textStyle(BOLD);
  text("'" + current.text + "'", width / 2, height / 2);
  textAlign(RIGHT, CENTER);
  text("-" + current.source, width - 100, height - 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function newQuote() {
  pickQuote();
  redraw();
}

function mousePressed() {
  newQuote();
}