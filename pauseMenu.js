class PauseMenu {
  constructor(arcadeFont, pauseMenuIndex) {
    this.arcadeFont = arcadeFont;
    this.pauseMenuIndex = pauseMenuIndex;
  }

  show() {
    background(0, 150); // Fondo semi-transparente
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    textFont(arcadeFont); // Aplicar fuente estilo arcade
    text("Paused", width / 2, height / 2 - 100);

    textSize(24);
    for (let i = 0; i < 4; i++) {
      if (i === pauseMenuIndex) {
        fill(255, 0, 0); // Resaltar el elemento seleccionado en rojo
      } else {
        fill(255);
      }
      if (i === 0) {
        text("Reanudar", width / 2, height / 2);
      } else if (i === 1) {
        text("Reiniciar", width / 2, height / 2 + 50);
      } else if (i === 2) {
        text("Seleccionar Nivel", width / 2, height / 2 + 100);
      } else if (i === 3) {
        text("Menu principal", width / 2, height / 2 + 150);
      }
    }
  }
}
