
/*
The Sound of Silence
Week 8 — Audioreactive Visualization
*/

// AUDIO
let audioContext;
let microphoneStream;
let microphoneSource;
let analyser;
let audioData;
let timeData;

let soundEnabled = false;
let starting = false;

let volume = 0;
let treble = 0;

let screamOscillator;
let screamGain;

// BIRD
const HOME_X = 250;
const HOME_Y = 270;

let birdX = HOME_X;
let birdY = HOME_Y;
let birdState = "calm";

let flightProgress = 0;
let returnProgress = 0;
let quietStart = 0;
let loudStart = 0;
let alertStart = 0;
let birdCooldownUntil = 0;
let wingPhase = 0;

// THRESHOLDS
const QUIET_THRESHOLD = 0.08;
const ALERT_THRESHOLD = 0.12;
const FLY_THRESHOLD = 0.20;

const MIN_ALERT_DURATION = 1000;
const RETURN_QUIET_TIME = 2500;
const RETURN_COOLDOWN = 2000;

// SETUP
function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("week8-sketch");
  angleMode(RADIANS);

  select("#mic-button").mousePressed(toggleMicrophone);
}

// MICROPHONE
async function toggleMicrophone() {
  if (starting) return;

  if (soundEnabled) {
    stopMicrophone();
    return;
  }

  starting = true;
  select("#mic-button").html("Connecting...");

  try {
    audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    await audioContext.resume();

    microphoneStream =
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        }
      });

    microphoneSource =
      audioContext.createMediaStreamSource(microphoneStream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.65;

    microphoneSource.connect(analyser);

    audioData = new Uint8Array(analyser.frequencyBinCount);
    timeData = new Uint8Array(analyser.fftSize);

    screamOscillator = audioContext.createOscillator();
    screamGain = audioContext.createGain();

    screamOscillator.type = "sine";
    screamOscillator.frequency.value = 1100;
    screamGain.gain.value = 0;

    screamOscillator.connect(screamGain);
    screamGain.connect(audioContext.destination);
    screamOscillator.start();

    soundEnabled = true;

    select("#mic-button").html("Disable Microphone");
    select("#status").html(
      "Listening... Try speaking or clapping."
    );

  } catch (error) {
    console.error(error);
    select("#status").html(
      "Microphone access failed. Check browser permissions."
    );
    select("#mic-button").html("Enable Microphone");
  }

  starting = false;
}

function stopMicrophone() {
  soundEnabled = false;

  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
  }

  if (audioContext) audioContext.close();

  microphoneStream = null;
  microphoneSource = null;
  analyser = null;
  screamOscillator = null;
  screamGain = null;

  volume = 0;
  treble = 0;

  select("#mic-button").html("Enable Microphone");
  select("#status").html("Microphone disabled.");
}

// AUDIO ANALYSIS
function analyzeSound() {
  if (!soundEnabled || !analyser) {
    volume = lerp(volume, 0, 0.1);
    treble = lerp(treble, 0, 0.1);
    return;
  }

  analyser.getByteFrequencyData(audioData);

  let highTotal = 0;
  let highCount = 0;

  for (
    let i = floor(audioData.length * 0.35);
    i < audioData.length;
    i++
  ) {
    highTotal += audioData[i];
    highCount++;
  }

  let rawTreble = highCount > 0
    ? highTotal / highCount / 255
    : 0;

  treble = lerp(treble, rawTreble, 0.2);

  analyser.getByteTimeDomainData(timeData);

  let sum = 0;

  for (let i = 0; i < timeData.length; i++) {
    let sample = (timeData[i] - 128) / 128;
    sum += sample * sample;
  }

  let rms = sqrt(sum / timeData.length);
  let targetVolume = constrain(rms * 8, 0, 1);

  volume = lerp(volume, targetVolume, 0.25);
}

// BIRD BEHAVIOR
function updateBird() {
  let now = millis();

  if (birdState === "calm") {
    birdX = HOME_X;
    birdY = HOME_Y;

    if (
      volume > ALERT_THRESHOLD &&
      now > birdCooldownUntil
    ) {
      birdState = "alert";
      alertStart = now;
      loudStart = 0;
    }
  }

  else if (birdState === "alert") {
    let alertDuration = now - alertStart;

    if (volume > FLY_THRESHOLD) {
      if (loudStart === 0) loudStart = now;
    } else {
      loudStart = 0;
    }

    if (
      alertDuration >= MIN_ALERT_DURATION &&
      loudStart !== 0 &&
      now - loudStart >= 350
    ) {
      birdState = "flying";
      flightProgress = 0;
      loudStart = 0;
    }

    else if (
      alertDuration >= MIN_ALERT_DURATION &&
      volume < QUIET_THRESHOLD
    ) {
      birdState = "calm";
    }
  }

  else if (birdState === "flying") {
    flightProgress += 0.018;

    birdX = HOME_X + flightProgress * 350;
    birdY = HOME_Y -
      sin(min(flightProgress, 1) * PI / 2) * 300;

    if (flightProgress >= 1) {
      birdState = "away";
      quietStart = 0;
    }
  }

  else if (birdState === "away") {
    if (volume < QUIET_THRESHOLD) {
      if (quietStart === 0) quietStart = now;

      if (now - quietStart > RETURN_QUIET_TIME) {
        birdState = "returning";
        returnProgress = 0;
      }
    } else {
      quietStart = 0;
    }
  }

  else if (birdState === "returning") {
    returnProgress += 0.012;

    let t = constrain(returnProgress, 0, 1);
    let eased = t * t * (3 - 2 * t);

    birdX = lerp(600, HOME_X, eased);
    birdY = lerp(-30, HOME_Y, eased);

    if (returnProgress >= 1) {
      birdState = "calm";
      birdX = HOME_X;
      birdY = HOME_Y;
      birdCooldownUntil = now + RETURN_COOLDOWN;
    }
  }
}

// BIRD VOICE
function updateBirdVoice() {
  if (!soundEnabled || !screamGain || !screamOscillator) {
    return;
  }

  let now = audioContext.currentTime;

  let isScared =
    birdState === "alert" ||
    birdState === "flying";

  let targetGain = 0;

  if (isScared) {
    let screamVolume = map(
      volume,
      ALERT_THRESHOLD,
      1,
      0.015,
      0.12,
      true
    );

    let chirp = pow(
      max(0, sin(frameCount * 0.28)),
      2
    );

    targetGain = screamVolume * chirp;
  }

  targetGain = constrain(targetGain, 0, 0.12);

  screamGain.gain.setTargetAtTime(
    targetGain, now, 0.025
  );

  let pitch = map(treble, 0, 1, 900, 2000);
  pitch += sin(frameCount * 0.28) * 250;

  screamOscillator.frequency.setTargetAtTime(
    pitch, now, 0.02
  );
}

// DRAW
function draw() {
  analyzeSound();
  updateBird();
  updateBirdVoice();

  drawBackground();
  drawTree();

  if (birdState !== "away") {
    drawBird();
  }

  // drawAudioMonitor();
}

// BACKGROUND
function drawBackground() {
  background("#DCEEDC");
  noStroke();

  fill("#F7F4DE");
  circle(410, 95, 85);

  fill("#C4DDBD");
  ellipse(100, 520, 500, 240);

  fill("#B0D2AE");
  ellipse(440, 530, 450, 250);

  for (let i = 0; i < 7; i++) {
    let x = (i * 83 + 30) % width;
    let y = (i * 61 + frameCount * 0.25) % height;

    fill("#A8C9A3");
    ellipse(x, y, 10, 5);
  }
}

// TREE
function drawTree() {
  noStroke();

  fill("#8B6B55");
  rect(70, 180, 55, 320, 15);

  stroke("#8B6B55");
  strokeWeight(20);
  strokeCap(ROUND);
  line(100, 310, 365, 310);

  noStroke();

  fill("#86B88A");
  ellipse(80, 160, 170, 130);

  fill("#9AC99A");
  ellipse(155, 130, 155, 120);

  fill("#78AC83");
  ellipse(40, 230, 130, 110);

  fill("#A8D4A0");
  ellipse(210, 190, 120, 95);
}

// BIRD
function drawBird() {
  push();
  translate(birdX, birdY);

  let flying =
    birdState === "flying" ||
    birdState === "returning";

  let alert = birdState === "alert";
  let scared = alert || birdState === "flying";

  // Gentle breathing
  if (!alert && !flying) {
    translate(0, sin(frameCount * 0.045) * 2);
  }

  // Wing speed responds to sound
  let wingSpeed;

  if (flying) {
    wingSpeed = 0.45 + treble * 0.5;
  } else if (alert) {
    wingSpeed = map(
      volume, ALERT_THRESHOLD, 1,
      0.2, 0.7, true
    );
  } else {
    wingSpeed = 0.04;
  }

  wingPhase += wingSpeed;

  let wingMovement;

  if (flying) {
    wingMovement = sin(wingPhase) * 45;
  } else if (alert) {
    wingMovement = sin(wingPhase) * 35;
  } else {
    wingMovement = sin(wingPhase) * 4;
  }

  // Body
  noStroke();
  fill("#E9A78F");
  ellipse(0, 0, 95, 105);

  // Wing
  push();
  translate(-22, 5);
  rotate(radians(wingMovement));

  fill("#D98D79");
  ellipse(-12, 0, 55, 35);
  pop();

  // Head
  fill("#E9A78F");
  circle(20, -48, 75);

  // Eye
  fill("#303030");
  circle(35, -55, 9);

  if (!scared && frameCount % 180 < 8) {
    stroke("#303030");
    strokeWeight(2);
    line(30, -55, 40, -55);
    noStroke();
  }

  // Beak
  let mouthOpen = scared
    ? map(volume, ALERT_THRESHOLD, 1, 8, 25, true)
    : 4;

  fill("#E7B35B");
  triangle(
    53, -40,
    76, -35,
    53, -40 + mouthOpen
  );

  // Feet
  stroke("#B36B55");
  strokeWeight(3);
  line(-15, 46, -15, 58);
  line(15, 46, 15, 58);

  noStroke();
  pop();
}

// AUDIO MONITOR
function drawAudioMonitor() {
  push();
  noStroke();

  fill(255, 255, 255, 210);
  rect(12, 12, 180, 76, 8);

  fill("#34463B");
  textSize(12);

  text("Volume: " + nf(volume, 1, 3), 22, 33);
  text("Treble: " + nf(treble, 1, 3), 22, 52);
  text("Bird: " + birdState, 22, 71);

  pop();
}
