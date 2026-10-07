function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent('week5-sketch'); // do not delete
}

function draw() {

  // ==========================================
  // 1. CENTER
  // ==========================================

  let centerX = width / 2;
  let centerY = height / 2;


  // ==========================================
  // 2. TIME
  // ==========================================

  // Get the real current time
  let hr = hour();
  let min = minute();
  let sec = second();

  // Convert real time into one continuous number
  // Example: 14:30 = 14.5
  let realTime =
    hr +
    min / 60 +
    sec / 3600;


  // Start from the real time,
  // then accelerate it:
  // 1 real second = 1 hour in the artwork
  let h =
    (realTime + millis() / 1000) % 24;


  // ==========================================
  // 3. MOUSE TIME CONTROL
  // ==========================================

  // If mouse is inside the canvas,
  // mouse position controls the time
  if (
    mouseX >= 0 &&
    mouseX <= width &&
    mouseY >= 0 &&
    mouseY <= height
  ) {

    let angle = atan2(
      mouseY - centerY,
      mouseX - centerX
    );

    let degree = degrees(angle);

    // Make top = 0 degrees
    degree = degree + 90;

    if (degree < 0) {
      degree = degree + 360;
    }

    // Convert mouse angle into 24 hours
    h = map(
      degree,
      0,
      360,
      0,
      24
    );
  }


  // ==========================================
  // 4. SKY
  // ==========================================

  let nightColor = color("#14213D");
  let morningColor = color("#F6BD60");
  let noonColor = color("#87CEEB");
  let sunsetColor = color("#F28482");

  let skyColor;


  // Midnight -> Sunrise
  if (h < 6) {

    let amount = map(
      h,
      0,
      6,
      0,
      1
    );

    skyColor = lerpColor(
      nightColor,
      morningColor,
      amount
    );
  }


  // Sunrise -> Noon
  else if (h < 12) {

    let amount = map(
      h,
      6,
      12,
      0,
      1
    );

    skyColor = lerpColor(
      morningColor,
      noonColor,
      amount
    );
  }


  // Noon -> Sunset
  else if (h < 18) {

    let amount = map(
      h,
      12,
      18,
      0,
      1
    );

    skyColor = lerpColor(
      noonColor,
      sunsetColor,
      amount
    );
  }


  // Sunset -> Midnight
  else {

    let amount = map(
      h,
      18,
      24,
      0,
      1
    );

    skyColor = lerpColor(
      sunsetColor,
      nightColor,
      amount
    );
  }


  background(skyColor);


  // ==========================================
  // 5. SUN + MOON
  // ==========================================

  let orbitRadius = 180;


  // Convert 24 hours into one full rotation
  let sunAngle = map(
    h,
    0,
    24,
    90,
    450
  );


  // ---------- SUN ----------

  let sunX =
    centerX +
    cos(radians(sunAngle)) * orbitRadius;

  let sunY =
    centerY +
    sin(radians(sunAngle)) * orbitRadius;


  noStroke();
  fill("#FFD166");

  circle(
    sunX,
    sunY,
    50
  );


  // ---------- MOON ----------

  // Moon is always 180 degrees
  // opposite from the sun
  let moonAngle =
    sunAngle + 180;


  let moonX =
    centerX +
    cos(radians(moonAngle)) * orbitRadius;

  let moonY =
    centerY +
    sin(radians(moonAngle)) * orbitRadius;


  fill("#F1F1E6");

  circle(
    moonX,
    moonY,
    45
  );


  // ==========================================
  // 6. FLOWER BLOOM
  // ==========================================

  let bloom;


  // 6 AM -> 12 PM
  // Flower slowly opens
  if (h >= 6 && h <= 12) {

    bloom = map(
      h,
      6,
      12,
      0,
      1
    );
  }


  // 12 PM -> 6 PM
  // Flower slowly closes
  else if (h > 12 && h <= 18) {

    bloom = map(
      h,
      12,
      18,
      1,
      0
    );
  }


  // Night
  else {

    bloom = 0;
  }


  // ==========================================
  // 7. DRAW FLOWER
  // ==========================================

  push();

  translate(
    centerX,
    centerY
  );


  // Petals move outward as the flower opens
  let petalDistance = map(
    bloom,
    0,
    1,
    10,
    45
  );


  // Petals rotate while opening
  let petalRotation = map(
    bloom,
    0,
    1,
    0,
    30
  );


  fill("#F7A8B8");
  noStroke();


  // Draw 8 petals
  for (let i = 0; i < 8; i++) {

    push();

    rotate(
      radians(
        i * 45 + petalRotation
      )
    );

    ellipse(
      0,
      -petalDistance,
      35,
      80
    );

    pop();
  }


  // ==========================================
  // 8. FLOWER CENTER PULSE
  // ==========================================

  // second() controls a subtle pulse
  // in the center of the flower
  let pulse = map(
  sin(radians(sec * 30)),
  -1,
  1,
  28,
  42
  );


  fill("#FFD166");

  circle(
    0,
    0,
    pulse
  );


  pop();


  // ==========================================
  // 9. TIME DISPLAY
  // Temporary for testing
  // ==========================================

  fill(0);
  noStroke();
  textSize(16);

  text(
    nf(h, 2, 1),
    20,
    30
  );
}