
 // Flower Clock — A Living Garden
 // Creative Coding — Interactivity Exploration
 // Extended from Week 5 & Week 6 Flower Clock

let simulatedTime;
let previousMillis;
let currentSpeed = 1;

// NEW: Array of interactive flowers
let flowers = [];
let mainFlower;

// ==========================================
// SETUP
// ==========================================

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week7-sketch'); // do not delete

  angleMode(RADIANS);

  simulatedTime = hour() + minute() / 60 + second() / 3600;
  previousMillis = millis();

  // NEW: Create the original central flower as an object
  mainFlower = new Flower(250, 250, 1, "#F7A8B8");
}

// ==========================================
// DRAW
// ==========================================

function draw() {
  let centerX = width / 2;
  let centerY = height / 2;

  // ==========================================
  // 1. TIME AND MOUSE INTERACTION
  // ==========================================

  let now = millis();
  let deltaTime = (now - previousMillis) / 1000;
  previousMillis = now;

  let mouseDistance = dist(
    mouseX, mouseY,
    centerX, centerY
  );

  let mouseInside =
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;

  let targetSpeed = 1;

  if (mouseInside && mouseDistance < 180) {
    targetSpeed = map(
      mouseDistance, 0, 180, 8, 1, true
    );
  }

  currentSpeed = lerp(currentSpeed, targetSpeed, 0.05);

  simulatedTime +=
    deltaTime * (24 / 40) * currentSpeed;

  simulatedTime = simulatedTime % 24;

  let h = simulatedTime;

  // ==========================================
  // 2. SKY COLOR — ORIGINAL
  // ==========================================

  let nightColor = color("#14213D");
  let morningColor = color("#F6BD60");
  let noonColor = color("#87CEEB");
  let sunsetColor = color("#F28482");

  let skyColor;

  if (h < 6) {
    skyColor = lerpColor(
      nightColor, morningColor,
      map(h, 0, 6, 0, 1)
    );
  } else if (h < 12) {
    skyColor = lerpColor(
      morningColor, noonColor,
      map(h, 6, 12, 0, 1)
    );
  } else if (h < 18) {
    skyColor = lerpColor(
      noonColor, sunsetColor,
      map(h, 12, 18, 0, 1)
    );
  } else {
    skyColor = lerpColor(
      sunsetColor, nightColor,
      map(h, 18, 24, 0, 1)
    );
  }

  background(skyColor);

  // ==========================================
  // 3. SUN AND MOON — ORIGINAL
  // ==========================================

  let orbitRadius = 180;
  let sunAngle = map(h, 0, 24, 90, 450);

  let sunX = centerX +
    cos(radians(sunAngle)) * orbitRadius;
  let sunY = centerY +
    sin(radians(sunAngle)) * orbitRadius;

  let moonAngle = sunAngle + 180;

  let moonX = centerX +
    cos(radians(moonAngle)) * orbitRadius;
  let moonY = centerY +
    sin(radians(moonAngle)) * orbitRadius;

  noStroke();

  fill(255, 209, 102, 35);
  circle(sunX, sunY, 75);

  fill("#FFD166");
  circle(sunX, sunY, 50);

  fill("#F1F1E6");
  circle(moonX, moonY, 45);

  // ==========================================
  // 4. BLOOM BASED ON TIME — ORIGINAL
  // ==========================================

  let bloom = 0;

  if (h >= 6 && h <= 12) {
    bloom = map(h, 6, 12, 0, 1);
  } else if (h > 12 && h <= 18) {
    bloom = map(h, 12, 18, 1, 0);
  }

  bloom = bloom * bloom * (3 - 2 * bloom);

  // ==========================================
  // 5. INTERACTIVE FLOWER GARDEN — NEW
  // ==========================================

  // Draw flowers stored in the array
  for (let flower of flowers) {
    flower.display(bloom);
  }

  // Keep the original large flower at the center
  mainFlower.display(bloom);
}

// ==========================================
// 6. CUSTOM FLOWER CLASS — NEW
// ==========================================

class Flower {
  constructor(x, y, size, petalColor) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.petalColor = petalColor;
    this.rotationOffset = random(0, 360);
  }

  // Method: display a flower based on time
  display(bloom) {
    push();

    translate(this.x, this.y);
    scale(this.size);

    let petalDistance = map(bloom, 0, 1, 10, 48);
    let petalWidth = map(bloom, 0, 1, 13, 38);
    let petalLength = map(bloom, 0, 1, 48, 85);
    let petalRotation = map(bloom, 0, 1, 0, 30);

    noStroke();

    for (let i = 0; i < 8; i++) {
      push();

      rotate(radians(
        i * 45 + petalRotation + this.rotationOffset
      ));

      fill(this.petalColor);

      ellipse(
        0,
        -petalDistance,
        petalWidth,
        petalLength
      );

      pop();
    }

    // Original breathing flower center
    let sec = second() +
      (millis() % 1000) / 1000;

    let pulse = map(
      sin(TWO_PI * sec / 4),
      -1, 1, 28, 38
    );

    fill("#FFD166");
    circle(0, 0, pulse);

    pop();
  }
}

// ==========================================
// 7. MOUSE INTERACTION — NEW
// ==========================================

function mousePressed() {
  // Only add flowers inside the canvas
  if (
    mouseX < 0 || mouseX > width ||
    mouseY < 0 || mouseY > height
  ) {
    return;
  }

  // Avoid placing new flowers directly on the main flower
  if (dist(mouseX, mouseY, width / 2, height / 2) < 95) {
    return;
  }

  let flowerColors = [
    "#F7A8B8",
    "#FFD6A5",
    "#CDB4DB",
    "#B8E0D2",
    "#FFAFCC"
  ];

  let chosenColor = random(flowerColors);

  let newFlower = new Flower(
    mouseX,
    mouseY,
    random(0.35, 0.65),
    chosenColor
  );

  // Array Method 1: add a new object
  flowers.push(newFlower);
}

// ==========================================
// 8. KEYBOARD INTERACTION — NEW
// ==========================================

function keyPressed() {
  // Array Method 2: remove the newest flower
  if (keyCode === BACKSPACE) {
    if (flowers.length > 0) {
      flowers.pop();
    }
    return false;
  }

  // Array Method 3: clear all added flowers
  if (key === "c" || key === "C") {
    flowers.splice(0, flowers.length);
  }
}
