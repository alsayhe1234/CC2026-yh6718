
let video;
let handPose;
let hands = [];
let fireflies = [];
let audioStarted = false;
let audioContext;

// C major pentatonic scale: C D E G A
const musicalNotes = [
  261.63, 293.66, 329.63,
  392.00, 440.00, 523.25,
  587.33, 659.25, 783.99
];

// Firefly Class
class Firefly {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(12, 20);
    this.speedX = random(-1.5, 1.5);
    this.speedY = random(-1.5, 1.5);

    // Each firefly has its own musical note
    this.baseFreq = random(musicalNotes);
    this.lastCatchTime = -1000;
  }

  update() {
    // Floating movement
    this.x += this.speedX + sin(frameCount * 0.05);
    this.y += this.speedY + cos(frameCount * 0.05);

    // Screen wrap
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  display() {
    noStroke();

    // Outer glow
    fill(255, 255, 150, 100);
    circle(this.x, this.y, this.size * 1.8);

    // Firefly body
    fill(255, 240, 100);
    circle(this.x, this.y, this.size);
  }

  checkCatch(fingerX, fingerY) {
    let d = dist(
      fingerX,
      fingerY,
      this.x,
      this.y
    );

    // Catch firefly with cooldown
    if (
      d < this.size + 15 &&
      millis() - this.lastCatchTime > 250
    ) {
      this.lastCatchTime = millis();

      // Play the firefly's note
      playFireflyNote(this.baseFreq);

      // Respawn the firefly
      this.x = random(width);
      this.y = random(height);
    }
  }
}

// Play a short musical note
function playFireflyNote(frequency) {
  if (!audioStarted || !audioContext) return;

  let now = audioContext.currentTime;

  // Create oscillator
  let note = audioContext.createOscillator();
  let gain = audioContext.createGain();

  note.type = "sine";
  note.frequency.setValueAtTime(frequency, now);

  // Musical envelope:
  // quick attack, gentle decay
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(
    0.16,
    now + 0.025
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    now + 0.65
  );

  note.connect(gain);
  gain.connect(audioContext.destination);

  note.start(now);
  note.stop(now + 0.7);

  note.onended = () => {
    note.disconnect();
    gain.disconnect();
  };
}

async function setup() {
  createCanvas(640, 480);

  // Webcam setup
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Generate 12 fireflies
  for (let i = 0; i < 12; i++) {
    fireflies.push(new Firefly());
  }

  // Load HandPose model
  handPose = await ml5.handPose();
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(20, 25, 45);

  // Mirror webcam horizontally
  push();
  translate(width, 0);
  scale(-1, 1);

  tint(255, 60);
  image(video, 0, 0, width, height);

  pop();

  // Update and display fireflies
  for (let f of fireflies) {
    f.update();
    f.display();
  }

  // Detect index fingertip
  if (hands.length > 0) {
    let indexTip = hands[0].keypoints[8];

    if (indexTip) {
      // Mirror fingertip coordinates
      let mirroredX = width - indexTip.x;
      let mirroredY = indexTip.y;

      // Draw catcher circle
      noFill();
      stroke(100, 255, 200, 200);
      strokeWeight(3);

      circle(mirroredX, mirroredY, 35);

      // Check firefly collisions
      for (let f of fireflies) {
        f.checkCatch(mirroredX, mirroredY);
      }
    }
  }

  // Audio activation prompt
  if (!audioStarted) {
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);

    text(
      "Click anywhere on canvas to activate sound!",
      width / 2,
      height - 30
    );
  }
}

// HandPose callback
function gotHands(results) {
  hands = results;
}

// Start audio after user interaction
async function mousePressed() {
  if (!audioStarted) {
    try {
      audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
      )();

      await audioContext.resume();
      audioStarted = true;

      console.log("Audio activated!");
    } catch (error) {
      console.error("Audio failed:", error);
    }
  }
}
