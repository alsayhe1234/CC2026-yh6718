
// Flower Clock - Final Version
// Creative Coding - Week 5 & Week 6

let simulatedTime;
let previousMillis;
let currentSpeed = 1;

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week5-sketch'); // do not delete

  // Begin at the current real-world time
  simulatedTime = hour() + minute() / 60 + second() / 3600;
  previousMillis = millis();
}

function draw() {

  let centerX = width / 2;
  let centerY = height / 2;

  // ==========================================
  // 1. TIME AND MOUSE INTERACTION
  // ==========================================

  let now = millis();
  let deltaTime = (now - previousMillis) / 1000;
  previousMillis = now;

  // Measure distance from mouse to flower
  let mouseDistance = dist(
    mouseX, mouseY,
    centerX, centerY
  );

  // Only respond when mouse is inside canvas
  let mouseInside =
    mouseX >= 0 && mouseX <= width &&
    mouseY >= 0 && mouseY <= height;

  let targetSpeed = 1;

  if (mouseInside && mouseDistance < 180) {
    // Closer mouse = faster time
    targetSpeed = map(
      mouseDistance,
      0, 180,
      8, 1,
      true
    );
  }

  // Smoothly transition between speeds
  currentSpeed = lerp(
    currentSpeed,
    targetSpeed,
    0.05
  );

  // One complete day takes 40 seconds normally
  // Mouse proximity makes the day pass faster
  simulatedTime +=
    deltaTime * (24 / 40) * currentSpeed;

  simulatedTime = simulatedTime % 24;

  let h = simulatedTime;


  // ==========================================
  // 2. SKY COLOR
  // ==========================================

  let nightColor = color("#14213D");
  let morningColor = color("#F6BD60");
  let noonColor = color("#87CEEB");
  let sunsetColor = color("#F28482");

  let skyColor;

  if (h < 6) {
    skyColor = lerpColor(
      nightColor,
      morningColor,
      map(h, 0, 6, 0, 1)
    );
  } else if (h < 12) {
    skyColor = lerpColor(
      morningColor,
      noonColor,
      map(h, 6, 12, 0, 1)
    );
  } else if (h < 18) {
    skyColor = lerpColor(
      noonColor,
      sunsetColor,
      map(h, 12, 18, 0, 1)
    );
  } else {
    skyColor = lerpColor(
      sunsetColor,
      nightColor,
      map(h, 18, 24, 0, 1)
    );
  }

  background(skyColor);


  // ==========================================
  // 3. SUN AND MOON
  // ==========================================

  let orbitRadius = 180;

  // 6 AM = left, 12 PM = top
  // 6 PM = right, 12 AM = bottom
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

  // Soft sun glow
  fill(255, 209, 102, 35);
  circle(sunX, sunY, 75);

  fill("#FFD166");
  circle(sunX, sunY, 50);

  // Moon
  fill("#F1F1E6");
  circle(moonX, moonY, 45);


  // ==========================================
  // 4. FLOWER BLOOM
  // ==========================================

  let bloom = 0;

  if (h >= 6 && h <= 12) {
    bloom = map(h, 6, 12, 0, 1);
  } else if (h > 12 && h <= 18) {
    bloom = map(h, 12, 18, 1, 0);
  }

  // Smooth easing for natural movement
  bloom = bloom * bloom * (3 - 2 * bloom);


  // ==========================================
  // 5. DRAW FLOWER
  // ==========================================

  push();
  translate(centerX, centerY);

  let petalDistance = map(
    bloom, 0, 1, 10, 48
  );

  let petalWidth = map(
    bloom, 0, 1, 13, 38
  );

  let petalLength = map(
    bloom, 0, 1, 48, 85
  );

  let petalRotation = map(
    bloom, 0, 1, 0, 30
  );

  noStroke();

  // Eight petals open and close together
  for (let i = 0; i < 8; i++) {
    push();

    rotate(radians(i * 45 + petalRotation));

    fill("#F7A8B8");

    ellipse(
      0,
      -petalDistance,
      petalWidth,
      petalLength
    );

    pop();
  }


  // ==========================================
  // 6. FLOWER CENTER BREATHING
  // ==========================================

  // Real seconds control a gentle pulse
  let sec = second() +
    (millis() % 1000) / 1000;

  let pulse = map(
    sin(TWO_PI * sec / 4),
    -1, 1,
    28, 38
  );

  fill("#FFD166");
  circle(0, 0, pulse);

  pop();
}
