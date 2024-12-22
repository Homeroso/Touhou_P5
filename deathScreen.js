class DeathScreen {
  constructor(arcadeFont, deathIndex) {
    this.arcadeFont = arcadeFont;
    this.deathIndex = deathIndex;
  }

  show() {
    background(0, 150); // Fondo semi-transparente
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont(arcadeFont); // Aplicar fuente estilo arcade
    text("You are Dead", width / 2, height / 2 - 100);

    textSize(24);
    for (let i = 0; i < 3; i++) {
      if (i === deathIndex) {
        fill(255, 0, 0); // Resaltar el elemento seleccionado en rojo
      } else {
        fill(255);
      }
      if (i === 0) {
        text("Restart", width / 2, height / 2 + 50);
      } else if (i === 1) {
        text("Select Stage", width / 2, height / 2 + 100);
      } else if (i === 2) {
        text("Main Menu", width / 2, height / 2 + 150);
      }
    }
  }
}
