let posX = 0;
let quadros = [];
let tamQ = 300; // Largura do quadro
let altQ = 200; // Altura do quadro
let esp = 360;  // Espaço total que cada quadro ocupa na fita

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Criamos 4 quadros simples
  for (let i = 0; i < 4; i++) {
    let pg = createGraphics(tamQ, altQ);
    pg.background(255); // Fundo branco dentro do quadro para desenhar
    quadros.push(pg);
  }
}

function draw() {
  background(220); // Fundo cinzento

  // O rolo anda devagar para a esquerda
  posX -= 0.8;
  let larguraTotal = quadros.length * esp;
  
  // Repete infinitamente
  if (posX <= -larguraTotal) {
    posX = 0;
  }

  let y = height / 2 - altQ / 2;

  // Desenhamos duas vezes para criar a ilusão de infinito sem falhas
  for (let j = 0; j < 2; j++) {
    let offsetLoop = j * larguraTotal;

    for (let i = 0; i < quadros.length; i++) {
      let x = posX + offsetLoop + (i * esp);

      // 1. Fundo escuro da fita de filme
      fill(50);
      noStroke();
      rect(x - 10, y - 10, tamQ + 20, altQ + 20);

      // 2. A imagem com o que desenhaste
      image(quadros[i], x, y);

      // 3. Moldura preta do quadro
      noFill();
      stroke(0);
      strokeWeight(2);
      rect(x, y, tamQ, altQ);

      // 4. Desenhar com o rato dentro do quadro atual
      let mx = mouseX - x;
      let my = mouseY - y;
      let pmx = pmouseX - x;
      let pmy = pmouseY - y;

      if (mouseIsPressed && mx > 0 && mx < tamQ && my > 0 && my < altQ &&
          pmx > 0 && pmx < tamQ && pmy > 0 && pmy < altQ) {
        quadros[i].stroke(0);        // Linha preta
        quadros[i].strokeWeight(3);  // Espessura
        quadros[i].line(pmx, pmy, mx, my); // Traço contínuo
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}