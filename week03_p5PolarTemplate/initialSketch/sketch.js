// For your initial sketch

function setup() {
  createCanvas(500, 500);
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(255,255,0);
  // Insert your drawing here
  // For where mouse close to, we don't need this anymore
  // let squareSize = 40;
  let spacing = 60; // Distance between the starts of each square
  let margin = 50;

   let row = 1; // Track row count

  // Loop down the Y-axis
  for (let y = margin; y <= height - margin; y += spacing) {
    let col = 1; // Track column count


     for (let x = margin; x <= width - margin; x += spacing) {
      // 1. Calculate distance from mouse cursor
      let d = dist(x, y, mouseX, mouseY);

        // 2. Map distance to size (close = 60px, far = 20px)
      let dynamicSize = map(d, 0, 200, 41, 20, true);

    //for (let x = margin; x <= width - margin - squareSize; x += spacing){
      push();
      translate(x, y);

       // Flipped logic:
      if (row % 2 !== 0 && col % 2 === 0) {
        rotate(45); // Odd row: rotate EVEN columns
      } else if (row % 2 === 0 && col % 2 !== 0) {
        rotate(45); // Even row: rotate ODD columns
      }

       // 3. Draw using dynamicSize!
      square(0, 0, dynamicSize);
      pop();

      col++;
    }
    row++;
  }
}
