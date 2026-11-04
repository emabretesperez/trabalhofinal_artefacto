let video;
let pg;

// 4 Cores representadas por números/nomes diretos
// 0: Vermelho, 1: Preto, 2: Branco, 3: Verde
let colorNames = ['Vermelho', 'Preto', 'Branco', 'Verde'];
let colorValues = ['#FF0055', '#000000', '#FFFFFF', '#00FFCC'];
let colorIdx = 0;

let brushSizes = [3, 12]; // Pincel fino (3px) e intermédio (12px)
let brushIdx = 0;

let scrollX = 0;
let moving = false;
let count = 0;
let drawing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Câmara frontal em proporção quadrada para não esticar a cara
  video = createCapture(VIDEO);
  video.size(160, 160);
  video.hide();

  pg = createGraphics(width, height);
  pg.clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let old = pg;
  pg = createGraphics(width, height);
  pg.image(old, 0, 0);
}

function draw() {
  background(0); // Fundo preto total

  let totalFrames = 4;
  let gap = 16; 
  let paddingX = 20; 
  
  // O tamanho do quadrado ocupa de uma ponta à outra do ecrã
  let size = (width - (paddingX * 2) - (gap * (totalFrames - 1))) / totalFrames;
  let fitaH = size + 50;
  let fitaY = (height - fitaH - 60) / 2; // Centrado verticalmente

  // Animação quando se completam os 4 desenhos
  if (moving) {
    scrollX += 6;
    let totalStep = size + gap;
    if (scrollX >= totalStep) {
      scrollX = 0;
      moving = false;
      pg.clear();
      count = 0;
      colorIdx = 0;
    }
  }

  // --- 1. ROLO DE FILME DE PONTA A PONTA ---
  fill(20);
  noStroke();
  rect(0, fitaY, width, fitaH);

  fill(240);
  for (let x = -40 - (scrollX % 40); x < width + 40; x += 40) {
    rect(x, fitaY + 6, 16, 10, 2);
    rect(x, fitaY + fitaH - 16, 16, 10, 2);
  }

  // --- 2. 4 QUADROS DA CÂMARA DE UMA PONTA À OUTRA ---
  for (let i = 0; i < totalFrames + (moving ? 1 : 0); i++) {
    let x = paddingX + i * (size + gap) - scrollX;
    let y = fitaY + 25;

    fill(0);
    rect(x - 4, y - 4, size + 8, size + 8);

    if (video.loadedmetadata) {
      push();
      translate(x + size, y);
      scale(-1, 1);
      image(video, 0, 0, size, size);
      pop();
    }

    blendMode(MULTIPLY);
    fill(255, 140, 40);
    rect(x, y, size, size);
    blendMode(BLEND);
  }

  // --- 3. DESENHO COM O PINCEL ---
  if (mouseIsPressed && !moving && mouseY < height - 70) {
    pg.stroke(colorValues[colorIdx]);
    pg.strokeWeight(brushSizes[brushIdx]);
    pg.strokeCap(ROUND);
    pg.line(pmouseX, pmouseY, mouseX, mouseY);

    if (!drawing) {
      drawing = true;
      count++;
      if (count < 4) colorIdx = count; // Avança para a próxima cor automaticamente
      if (count >= 4) moving = true;   // Ao 4.º desenho, o rolo avança!
    }
  }

  image(pg, 0, 0);

  // --- 4. BARRA INFERIOR COM AS 4 CORES E PINCÉIS ---
  drawUI();
}

function mouseReleased() {
  drawing = false;
}

function drawUI() {
  noStroke();
  fill(25, 25, 25, 240);
  rect(0, height - 70, width, 70);

  let centerY = height - 35;
  let startX = width / 2 - 240;

  // Desenhar os botões das 4 cores com os respetivos códigos visuais
  for (let i = 0; i < 4; i++) {
    fill(colorValues[i]);
    rect(startX + i * 50, centerY - 20, 40, 40, 8);
    
    // Contorno branco se for a cor selecionada
    if (colorIdx === i) {
      stroke(255);
      strokeWeight(3);
      noFill();
      rect(startX + i * 50 - 2, centerY - 22, 44, 44, 10);
      noStroke();
    }
  }

  // Botão Pincel Fino
  fill(60);
  rect(width / 2 + 20, centerY - 20, 80, 40, 8);
  fill(255); textSize(12); text("Fino", width / 2 + 48, centerY + 4);
  if (brushIdx === 0) { stroke(255); strokeWeight(3); noFill(); rect(width / 2 + 18, centerY - 22, 84, 44, 10); noStroke(); }

  // Botão Pincel Intermédio
  fill(60);
  rect(width / 2 + 110, centerY - 20, 95, 40, 8);
  fill(255); text("Intermédio", width / 2 + 125, centerY + 4);
  if (brushIdx === 1) { stroke(255); strokeWeight(3); noFill(); rect(width / 2 + 108, centerY - 22, 99, 44, 10); noStroke(); }

  // Contador e estado atual
  fill(220);
  textSize(13);
  text(`Quadros: ${count} / 4  |  Cor: ${colorNames[colorIdx]}`, 30, centerY + 4);
}

function mousePressed() {
  if (mouseY >= height - 70) {
    let startX = width / 2 - 240;
    // Clicar nas 4 cores
    for (let i = 0; i < 4; i++) {
      if (mouseX >= startX + i * 50 && mouseX <= startX + i * 50 + 40) {
        colorIdx = i;
      }
    }
    // Clicar nos pincéis
    if (mouseX >= width / 2 + 20 && mouseX <= width / 2 + 100) { brushIdx = 0; }
    if (mouseX >= width / 2 + 110 && mouseX <= width / 2 + 205) { brushIdx = 1; }
  }
}

function keyPressed() {
  if (key === 'c' || key === 'C') colorIdx = (colorIdx + 1) % colorValues.length;
  if (key === 'p' || key === 'P') brushIdx = (brushIdx + 1) % brushSizes.length;
  if (key === 'l' || key === 'L') { pg.clear(); count = 0; colorIdx = 0; }
}