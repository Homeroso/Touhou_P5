class StartScreen {
    constructor(menuImage, arcadeFont) {
      this.menuImage = menuImage;
      this.arcadeFont = arcadeFont;
      this.logoAlpha = 0;
      this.textAlpha = 0;
      this.logoFadeInDuration = 2000; // Duración de la transición del logo en milisegundos
      this.textFadeInDelay = 1000; // Retraso antes de que el texto comience a aparecer en milisegundos
    }
  
    show() {
      background(255); 
      textAlign(CENTER, CENTER);
      textSize(32);
      textFont(this.arcadeFont); // Aplicar fuente estilo arcade
  
      // Calcular la opacidad del logo (fade-in)
      if (millis() < this.logoFadeInDuration) {
        this.logoAlpha = map(millis(), 0, this.logoFadeInDuration, 0, 255);
      } else {
        this.logoAlpha = 255;
      }
  
      // Calcular la opacidad del texto (fade-in progresivo)
      if (millis() > this.logoFadeInDuration + this.textFadeInDelay) {
        let fadeProgress = millis() - (this.logoFadeInDuration + this.textFadeInDelay);
        this.textAlpha = constrain(map(fadeProgress, 0, 1000, 0, 255), 0, 255);
      }
  
      // Calcular la opacidad de palpitación del texto
      let textPulseAlpha = 255 * abs(sin(millis() / 1000)); // Cambia el divisor para ajustar la velocidad del parpadeo
  
      // Combinar fade-in y palpitación
      let finalTextAlpha = this.textAlpha * (textPulseAlpha / 255);
  
      // Mostrar imagen de fondo más pequeña y centrada con opacidad
      let imgWidth = this.menuImage.width / 1.2; // Ajusta el tamaño según sea necesario
      let imgHeight = this.menuImage.height / 1.2; // Ajusta el tamaño según sea necesario
      let imgX = (width - imgWidth) / 2;
      let imgY = (height - imgHeight) / 2;
      tint(255, this.logoAlpha); // Aplicar la opacidad calculada al logo
      image(this.menuImage, imgX, imgY, imgWidth, imgHeight);
      noTint(); // Restablecer el tinte
  
      // Mostrar texto en la parte inferior de la pantalla con opacidad combinada
      fill(0, 0, 0, finalTextAlpha); // Aplicar la opacidad combinada
      text('Press ENTER to start', width / 2, height - 50); // Posicionado cerca del borde inferior
    }
  }