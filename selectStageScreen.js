class SelectStageScreen {
  constructor(arcadeFont, stages, selectedStage, stageImages) {
    this.arcadeFont = arcadeFont;
    this.stages = stages;
    this.selectedStage = selectedStage;
    this.stageImages = stageImages;
  }

  show() {
    background(255); // Fondo negro
    textAlign(CENTER, CENTER); // Alineación centrada
    textFont(this.arcadeFont); // Aplicar fuente estilo arcade

    // Hacer que el texto "Select a stage" palpite y sea más grande
    let titlePulse = 1.2 + 0.2 * sin(millis() / 3000); // Ajusta la velocidad y amplitud del pulso para el título
    textSize(32 * titlePulse);
    fill(0, 0, 0);
    text("Select a stage", width / 2, height / 5);

    // Mostrar las etapas disponibles
    textSize(32); // Restablecer el tamaño del texto para las etapas
    let stagesX = width / 5;
    let stagesY = height / 2.8;
    for (let i = 0; i < this.stages.length; i++) {
      if (i === this.selectedStage) {
        let stagePulse = 1.2 + 0.2 * sin(millis() / 1000); // Pulso para la etapa seleccionada
        textSize(32 * stagePulse);
        fill(255, 0, 0); // Color rojo para la etapa seleccionada
      } else {
        textSize(32);
        fill(0); // Color blanco para las otras etapas
      }
      text(this.stages[i], stagesX, stagesY + i * 40); // Texto alineado a la izquierda
    }

    // Mostrar la imagen de vista previa de la etapa seleccionada
    let previewImage = this.stageImages[this.selectedStage];
    let previewWidth = previewImage.width - 700;
    let previewHeight = previewImage.height - 400;
    let previewX = width / 2 - previewWidth / 2 + 100;
    let previewY = height / 1.6 - previewHeight / 2;

    // Dibujar cuadro para la vista previa
    push(); // Guardar el estado de los estilos de dibujo
    noFill();
    stroke(0); // Contorno blanco
    strokeWeight(2);
    rect(previewX - 10, previewY - 10, previewWidth + 20, previewHeight + 20); // Margen alrededor de la imagen
    pop(); // Restaurar el estado de los estilos de dibujo

    // Dibujar la imagen de vista previa
    image(previewImage, previewX, previewY, previewWidth, previewHeight);
  }
}
