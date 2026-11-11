let pMapper;
let quad0, quad1, quad2, quad3, quad4, quad5;



//Sisley Variables 
    // position of the skater
    let skaterX;
    let skaterY;

    let traces = [];//stores the traces, empty array that I put values in

    // time variables
    let previousSecond; // remembers the previous second
    let previousHour; // remembers the previous hour
    let secondStartMillis; // remembers the start time of the current second in milliseconds

    //ice resurfacer
    let cleaning = false; // not cleaning 
    let resurfacerX = 0; //ice resurfacer position
    let resurfacerWidth = 100; // width of cleaning area

  // Yuqian Variables
  let yuqianTime;
  let yuqianPreviousMillis;
  let yuqianSpeed = 1;
  let yuqianPG;


function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    // create mapper object
    pMapper = createProjectionMapper(this);

    quad2 = pMapper.createQuadMap(200,200);
    quad3 = pMapper.createQuadMap(500,500);
    quad4 = pMapper.createQuadMap(600,600);
    quad5 = pMapper.createQuadMap(800,450);
    // loads calibration in the "maps" directory
    pMapper.load("../maps/map.json");

    yuqianPG = createGraphics(500, 500);

    sisleySetup();
    yuqianheSetup();
    yuetongSetup();
    zetaoSetup();

}

function draw() {
    background(0);

    //quad0.display("red");
   // quad1.display("magenta");
    quad2.displaySketch(sisleyTexture);
    quad3.displaySketch(yuqianheTexture);
    quad4.displaySketch(yuetongTexture);
    quad5.displaySketch(zetaoTexture);

    //quad0.displaySketch(yourNameTexture);
}

function keyPressed() {
    switch (key) {
        case "c":
            pMapper.toggleCalibration();
            break;
        case "f":
            let fs = fullscreen();
            fullscreen(!fs);
            break;
        case "l":
            pMapper.load("maps/map.json");
            break;

        case "s":
            pMapper.save("map.json");
            break;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function sisleySetup(pg){
    //  let canvas = createCanvas(500, 500);
  //pg.canvas.parent('week5-sketch'); // do not delete - links to your index.html pages (description)
  // HSB: Hue (0-360), Saturation (0-100), Brightness (0-100)
  //colorMode(RGB, 255, 255, 255);

  //remember the previous second
  previousSecond = second();
  // remember the previous hour
  previousHour = hour();
  // remember the start time of the current second in milliseconds
  secondStartMillis = millis();

  // calculate the beginning of the current hour
  let hourStart = hour() * 3600;
  let secondsInHour = minute() * 60 + second();

  // rebuild traces from the beginning of this hour, t = time
  for (let t = 0; t <= secondsInHour; t++) {
    let pastTime = hourStart + t;

    let pastX = 200 * noise(pastTime * 0.05);
    let pastY = 200 * noise(pastTime * 0.05 + 100);

    // trace color changes based on the past minute
    let pastColor = lerpColor(
      color(133, 155, 166),
      color(93, 63, 115),
      t / 3599
    );

    traces.push({
      x: pastX,
      y: pastY,
      c: pastColor
    });
  }
    
}
function sisleyTexture(pg){
    pg.clear();
    pg.push();
    pg.colorMode(RGB, 255, 255, 255, 255);
    // second: 0 - 59
  let currentSecond = second();
  // minute: 0 - 59
  let currentMinute = minute();
  // hour: 0 - 23
  let currentHour = hour();
 
  // changes trace color based on the current minute gradually 
  let traceColor = lerpColor(
    pg.color(103, 142, 166),
    pg.color(31, 55, 89),
    currentMinute / 59
  );

  // the ice color become darker as time passes
  let cleanIce = pg.color(218, 242, 247); 
  let oldIce = pg.color(141, 179, 217); 

  // how many seconds have passed in the hour (0 to 3599), so the color change of ice happens smoothly every second
  let secondsInHour = currentMinute * 60 + currentSecond;

  // changes the ice color as time changes
  // calculate the progress of ice cleaning based on the current minute, mapping it from 0 to 1
  let iceProgress = map(secondsInHour, 0, 3599, 0, 1);
  let iceColor = lerpColor(cleanIce, oldIce, iceProgress);
  
  pg.background(iceColor);


  // current time in seconds
  let currentTime = currentHour * 3600 + currentMinute * 60 + currentSecond;

    // if a new second has started, !== means not equal to
  if (currentSecond !== previousSecond) {
    secondStartMillis = millis();
    previousSecond = currentSecond;
  }

  // use millis() to calculate movement in a fraction of a second, (takes the moduolo and make it into a number between 0 - 1)
  let move = (millis() - secondStartMillis) / 1000;
    // keep move between 0 and 1
    if (move > 1) {
      move = 1;
    }
    if (move < 0) {
      move = 0;
    }

  // calculate positions at the current and the next second
  let startX = 200 * noise(currentTime * 0.05);
  let startY = 200 * noise(currentTime * 0.05 + 100);

  // where the skater should be in the next second
  let endX = 200 * noise((currentTime + 1) * 0.05);
  let endY = 200 * noise((currentTime + 1) * 0.05 + 100);

  // smoothly move between positions
  skaterX = lerp(startX, endX, move);
  skaterY = lerp(startY, endY, move);

  // record skater's position as it moves when not cleaning
  if (cleaning === false) {
    traces.push({
      x: skaterX,
      y: skaterY,
      c: traceColor
    });
  }

  // clean the ice when a new hour starts
  if (currentHour !== previousHour) {
    cleaning = true;
    resurfacerX = 0;
    previousHour = currentHour;
  }
  
  //draw traces
  pg.strokeWeight(2);

  // draw the traces stored in the array
  // when i = 1, we draw a line from the first trace to the second trace
  for (let i = 1; i < traces.length; i++) {

    // draw traces when it's not cleaning 
    if (cleaning === false ||
        (traces[i].x > resurfacerX &&
        traces[i - 1].x > resurfacerX)) {
      pg.stroke(traces[i].c);
      pg.line(
        traces[i - 1].x,
        traces[i - 1].y,
        traces[i].x,
        traces[i].y
      );
    }
  }

  // ice resurfacer
  if (cleaning === true) {
    // draw the ice resurfacer
    pg.fill(55, 119, 184);
    pg.noStroke();
    pg.rect(resurfacerX, 0, resurfacerWidth, 200);

    // move the resurfacer to right
    resurfacerX += 3;
    }

    // when resurfacer leaves the canvas, stop cleaning
    if (resurfacerX > 200) {
      cleaning = false;
      traces = []; 
    }

  // only show skater when resurfacer is not cleaning
  if (cleaning === false) {
    //draw skater 
    pg.fill(255, 0, 0);
    pg.noStroke();
    pg.ellipse(skaterX, skaterY, 12);
  }
  pg.pop();
}


function yuqianheSetup(pg) {
  // Start from real time
  yuqianTime = hour() + minute() / 60 + second() / 3600;
  yuqianPreviousMillis = millis();
  yuqianSpeed = 1;
}

function yuqianheTexture(pg) {
  pg.push();

  // Keep the coordinate system provided by Projection Mapper
  // Do NOT use pg.resetMatrix()

  pg.angleMode(RADIANS);
  pg.colorMode(RGB, 255, 255, 255, 255);

  // Diagnostic: print the graphics dimensions once
  if (frameCount === 30) {
    console.log("Yuqian Flower Clock:", {
      width: pg.width,
      height: pg.height,
      renderer: pg._renderer?.isP3D ? "WEBGL" : "2D"
    });
  }

  // =====================================
  // 1. CENTER AND TIME
  // =====================================

let centerX = 250;
let centerY = 250;

  let now = millis();
  let deltaTime = (now - yuqianPreviousMillis) / 1000;
  yuqianPreviousMillis = now;

  // Mouse proximity accelerates time
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  let targetSpeed = 1;

  if (d < 180) {
    targetSpeed = map(d, 0, 180, 8, 1, true);
  }

  yuqianSpeed = lerp(yuqianSpeed, targetSpeed, 0.05);

  // One simulated day in 40 seconds
  yuqianTime += deltaTime * (24 / 40) * yuqianSpeed;
  yuqianTime = yuqianTime % 24;

  let h = yuqianTime;

  // =====================================
  // 2. SKY COLOR
  // =====================================

  let night = pg.color("#14213D");
  let morning = pg.color("#F6BD60");
  let noon = pg.color("#87CEEB");
  let sunset = pg.color("#F28482");

  let sky;

  if (h < 6) {
    sky = pg.lerpColor(night, morning, map(h, 0, 6, 0, 1));
  } else if (h < 12) {
    sky = pg.lerpColor(morning, noon, map(h, 6, 12, 0, 1));
  } else if (h < 18) {
    sky = pg.lerpColor(noon, sunset, map(h, 12, 18, 0, 1));
  } else {
    sky = pg.lerpColor(sunset, night, map(h, 18, 24, 0, 1));
  }

  pg.background(sky);

  // =====================================
  // 3. SUN AND MOON
  // =====================================

  let orbitRadius = 180;

  let sunAngle = pg.radians(map(h, 0, 24, 90, 450));

  let sunX = centerX + pg.cos(sunAngle) * orbitRadius;
  let sunY = centerY + pg.sin(sunAngle) * orbitRadius;

  let moonX = centerX + pg.cos(sunAngle + PI) * orbitRadius;
  let moonY = centerY + pg.sin(sunAngle + PI) * orbitRadius;

  let scaleSize = 1;

  pg.noStroke();

  // Sun glow
  pg.fill(255, 209, 102, 35);
  pg.circle(sunX, sunY, 75 * scaleSize);

  // Sun
  pg.fill("#FFD166");
  pg.circle(sunX, sunY, 50 * scaleSize);

  // Moon
  pg.fill("#F1F1E6");
  pg.circle(moonX, moonY, 45 * scaleSize);

  // =====================================
  // 4. FLOWER BLOOM
  // =====================================

  let bloom = 0;

  // Flower opens from 6 AM to noon
  if (h >= 6 && h <= 12) {
    bloom = map(h, 6, 12, 0, 1);
  }

  // Flower closes from noon to 6 PM
  else if (h > 12 && h <= 18) {
    bloom = map(h, 12, 18, 1, 0);
  }

  // Smooth transition
  bloom = bloom * bloom * (3 - 2 * bloom);

  let petalDistance = map(bloom, 0, 1, 10, 48);
  let petalWidth = map(bloom, 0, 1, 13, 38);
  let petalLength = map(bloom, 0, 1, 48, 85);
  let petalRotation = map(bloom, 0, 1, 0, 30);

  pg.push();

  pg.translate(centerX, centerY);
  pg.scale(scaleSize);
  pg.noStroke();

  // Draw eight petals
  for (let i = 0; i < 8; i++) {
    pg.push();

    pg.rotate(pg.radians(i * 45 + petalRotation));
    pg.fill("#F7A8B8");

    pg.ellipse(
      0,
      -petalDistance,
      petalWidth,
      petalLength
    );

    pg.pop();
  }

  // =====================================
  // 5. FLOWER CENTER PULSE
  // =====================================

  // Four-second pulse cycle
  let sec = millis() / 1000;

  let pulse = map(
    pg.sin(TWO_PI * sec / 4),
    -1,
    1,
    28,
    38
  );

  pg.fill("#FFD166");
  pg.circle(0, 0, pulse);

  pg.pop();
  pg.pop();
}


// =====================================
// YUQIAN MAPPING BRIDGE
// =====================================

function yuqianheMappedTexture(pg) {
  pg.push();

  pg.imageMode(CORNER);
  pg.noTint();

  pg.image(
    yuqianPG,
    0,
    0,
    pg.width,
    pg.height
  );

  pg.pop();
}


const bluePalette = [ // 16 blue colors, from light to dark
    "#91A9B3", "#849FAB", "#7795A5", "#6A8C9E",
    "#5D8296", "#52788E", "#486E85", "#3F647C",
    "#385B73", "#32526B", "#2E4963", "#2A415B",
    "#273953", "#24324B", "#212B43", "#1E243B"
  ];

function yuetongSetup(pg){
  angleMode(DEGREES);
  textFont("Helvetica");
}
function yuetongTexture(pg) {

  const bluePalette = [ // 16 blue colors, from light to dark
    "#91A9B3", "#849FAB", "#7795A5", "#6A8C9E",
    "#5D8296", "#52788E", "#486E85", "#3F647C",
    "#385B73", "#32526B", "#2E4963", "#2A415B",
    "#273953", "#24324B", "#212B43", "#1E243B"
  ];

  pg.clear();
  pg.push();

  pg.background("#F2EDE1");

  pg.angleMode(DEGREES);
  pg.textFont("Helvetica");


  // current time
  let h = hour();
  let m = minute();
  let s = second();


  // Seconds
  // More blue layers appear as the seconds increase
  pg.noStroke();

  for (let i = 0; i <= s; i++) {

    let inset = i * 3.4;
    let colorIndex = i;

    // After reaching the darkest blue, start going back
    if (colorIndex >= 30) {
      colorIndex = colorIndex - 30;
    }

    if (colorIndex > 15) {
      colorIndex = 30 - colorIndex;
    }

    pg.fill(bluePalette[colorIndex]);

    // each rectangle gets smaller and moves toward the center
    pg.rect(
      141 + inset,
      8 + inset,
      451 - inset * 2,
      436 - inset * 2
    );
  }


  // Hours
  // The red slowly changes from dark red to light red during the day
  let red1 = color("#7D171D");
  let red2 = color("#F16A52");

  // 24 hours = 1440 minutes, map the time of day from 0 to 1
  let transition = map(h * 60 + m, 0, 1440, 0, 1);

  // lerpColor reference from the Week 6 class example:
  // Extended: Transitioning between color and size
  // https://editor.p5js.org/melodyloveless/sketches/o7dNhl_ib
  pg.fill(lerpColor(red1, red2, transition));

  pg.rect(0, 450, 135, 150);


  // Minutes
  // the yellow part grows upward
  let minuteHeight = map(m, 0, 60, 0, 136);

  pg.fill("#EAC84F");
  pg.rect(546, 592 - minuteHeight, 46, minuteHeight);


  // I wanted the time to always show two digits for minutes and seconds
  let minuteText = m;
  let secondText = s;

  if (m < 10) {
    minuteText = "0" + m;
  }

  if (s < 10) {
    secondText = "0" + s;
  }


  // Time and date on the left side
  pg.push();

  pg.translate(108, 218);
  pg.rotate(90);
  pg.textAlign(LEFT, CENTER);

  pg.fill("#202320");
  pg.textSize(24);
  pg.text(h + ":" + minuteText + ":" + secondText, 0, 0);

  pg.textSize(14);
  pg.text(month() + "." + day() + "." + year(), 0, 30);

  pg.pop();


  // black dividers
  pg.stroke("#202320");
  pg.strokeWeight(12);

  pg.line(135, 0, 135, 600);
  pg.line(0, 450, 600, 450);
  pg.line(0, 195, 135, 195);
  pg.line(67.5, 0, 67.5, 195);
  pg.line(540, 450, 540, 600);


  // outside border
  pg.noFill();
  pg.strokeWeight(8);
  pg.rect(4, 4, 592, 592);

  pg.pop();
}

/* Template for texture/animation



function yourNameSetup(pg) {
    // optional - put this function in setup() as needed
}

function yourNameTexture(pg) {
    // put your animation here
}

*/
const barHeight = 80;
const leftMargin = 50;

function zetaoSetup(pg){
  noStroke();
  rectMode(CORNER);
}

function zetaoTexture(pg) {
  pg.clear();
  pg.push();

  pg.background(151, 71, 255);
  pg.noStroke();
  pg.rectMode(CORNER);


  let barHeight = 80;
  let leftMargin = 50;
  let maxLength = 800 - leftMargin * 2;

  let s = second();
  let m = minute();
  let h = hour();

  let mLength = map(m, 0, 60, 0, maxLength);

  // Seconds
  let secondWidth = maxLength / 60;

  pg.fill(244, 191, 255);

  for (let i = 0; i < s; i++) {
    pg.rect(
      leftMargin + i * secondWidth,
      80,
      secondWidth - 2,
      20
    );
  }

  // Minutes
  pg.fill(194, 255, 215);
  pg.rect(leftMargin, 190, mLength, 50);

  // Hours
  let blockWidth = maxLength / 24;

  for (let i = 0; i < h; i++) {
    if (i == 0) {
      pg.fill(90, 80, 140);
    }
    if (i == 1) {
      pg.fill(100, 85, 155);
    }
    if (i == 2) {
      pg.fill(115, 95, 175);
    }
    if (i == 3) {
      pg.fill(135, 110, 195);
    }
    if (i == 4) {
      pg.fill(160, 130, 210);
    }
    if (i == 5) {
      pg.fill(190, 150, 220);
    }
    if (i == 6) {
      pg.fill(230, 170, 210);
    }
    if (i == 7) {
      pg.fill(250, 185, 190);
    }
    if (i == 8) {
      pg.fill(225, 200, 160);
    }
    if (i == 9) {
      pg.fill(255, 215, 140);
    }
    if (i == 10) {
      pg.fill(250, 230, 150);
    }
    if (i == 11) {
      pg.fill(225, 240, 160);
    }
    if (i == 12) {
      pg.fill(194, 255, 175);
    }
    if (i == 13) {
      pg.fill(150, 245, 185);
    }
    if (i == 14) {
      pg.fill(112, 235, 200);
    }
    if (i == 15) {
      pg.fill(100, 220, 220);
    }
    if (i == 16) {
      pg.fill(100, 195, 235);
    }
    if (i == 17) {
      pg.fill(120, 170, 240);
    }
    if (i == 18) {
      pg.fill(180, 145, 230);
    }
    if (i == 19) {
      pg.fill(180, 125, 215);
    }
    if (i == 20) {
      pg.fill(195, 110, 190);
    }
    if (i == 21) {
      pg.fill(165, 100, 175);
    }
    if (i == 22) {
      pg.fill(135, 90, 160);
    }
    if (i == 23) {
      pg.fill(110, 80, 150);
    }

    pg.rect(
      leftMargin + i * blockWidth,
      300,
      blockWidth - 3,
      barHeight
    );
  }

  pg.pop();
}