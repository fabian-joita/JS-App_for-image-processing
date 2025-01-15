// Elemente HTML
const fetchButton = document.getElementById('fetchButton');
const dogInfoDiv = document.getElementById('dogInfo');
const mirrorCanvas = document.getElementById('mirrorCanvas');
const grayscaleCanvas = document.getElementById('grayscaleCanvas');
const mirrorCtx = mirrorCanvas.getContext("2d"); // Obtinem contextul 2D pentru canvas-ul de oglindire
const grayscaleCtx = grayscaleCanvas.getContext("2d"); // Obtinem contextul 2D pentru canvas-ul de grayscale

// Elemente pentru timpi
const mirrorTimeDiv = document.getElementById('mirrorTime');
const grayscaleTimeDiv = document.getElementById('grayscaleTime');

/*
Functie asincrona pentru a obtine o imagine random de caine de la API-ul DOG.
Foloseste 'async/await' pentru a astepta raspunsul de la server.
 */
async function fetchDogImage() {
  try {
    // Folosim 'await' pentru a astepta ca cererea de fetch sa fie completa
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json(); // Convertim raspunsul JSON intr-un obiect

    console.log(data);
    dogInfoDiv.textContent = `JSON Components: ${JSON.stringify(data)}`; // Afisam componentele JSON in browser

    // Cream un obiect imagine (img) pentru a incarca imaginea de la URL-ul obtinut din JSON
    const img = new Image();
    img.crossOrigin = "anonymous"; // Permitem preluarea imaginii dintr-o sursa externa
                                 //altfel nu imi functiona codul
    img.src = data.message; // Setam sursa imaginii din JSON

    // 'img.onload' se va executa atunci cand imaginea este complet incarcata
    img.onload = () => {
      // Setam dimensiunile canvas-urilor pentru a corespunde dimensiunii imaginii
      mirrorCanvas.width = grayscaleCanvas.width = img.width;
      mirrorCanvas.height = grayscaleCanvas.height = img.height;

      // Desenam imaginea pe canvas-ul de oglindire
      mirrorCtx.drawImage(img, 0, 0, mirrorCanvas.width, mirrorCanvas.height);

      // Incepem cronometrul pentru aplicarea efectului de oglindire
      const mirrorStart = new Date(); 
      setTimeout(() => {
        // Aplicam efectul de oglindire pe imagine
        applyMirrorEffect(mirrorCtx, mirrorCanvas);

        // Terminam cronometrul pentru oglindire si afisam timpul de procesare
        const mirrorEnd = new Date();
        const mirrorDuration = mirrorEnd - mirrorStart;
        mirrorTimeDiv.textContent = `Processing time: ${mirrorDuration} ms`;

        // Incepem cronometrul pentru aplicarea efectului de grayscale
        const grayscaleStart = new Date();
        setTimeout(() => {
          // Aplicam efectul de grayscale pe imaginea oglindita
          applyGrayscaleEffect(mirrorCtx, mirrorCanvas, grayscaleCtx);
          
          // Terminam cronometrul pentru grayscale si afisam timpul de procesare
          const grayscaleEnd = new Date();
          const grayscaleDuration = grayscaleEnd - grayscaleStart;
          grayscaleTimeDiv.textContent = `Processing time: ${grayscaleDuration} ms`;
        }, 1000); // Introducem o intarziere de 1 secunda inainte de aplicarea grayscale
      }, 1000); // Introducem o intarziere de 1 secunda inainte de aplicarea efectului de oglindire
    };
  } catch (error) {
    // In cazul in care apare o eroare in procesul fetch
    console.error('Error fetching the dog image:', error);
    dogInfoDiv.textContent = 'Failed to fetch the dog image. Please try again.';
  }
}

/**
 * Aplica oglindirea imaginii pe canvas.
 * Se inverseaza pixelii din jumatatea dreapta a imaginii cu cei din jumatatea stanga.
 */
function applyMirrorEffect(ctx, canvas) {
  console.log("Applying mirror effect...");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Preluam datele imaginii din canvas
  const pixels = imageData.data; // Obtinerea array-ului de pixeli (RGBA)
  const width = canvas.width;
  const height = canvas.height;

  // Iteram prin fiecare rand al imaginii
  for (let y = 0; y < height; y++) {
    // Iteram doar prin jumatatea stanga a imaginii pentru a inversa pixelii
    for (let x = 0; x < width / 2; x++) {
      const leftIndex = (y * width + x) * 4; // Indexul pixelului din stanga
      const rightIndex = (y * width + (width - 1 - x)) * 4; // Indexul pixelului din dreapta

      // Schimbam valorile pixelilor intre stanga si dreapta
      for (let i = 0; i < 4; i++) { // Fiecare pixel are 4 componente: R, G, B, A
        const temp = pixels[leftIndex + i];
        pixels[leftIndex + i] = pixels[rightIndex + i];
        pixels[rightIndex + i] = temp;
      }
    }
  }

  // Punem datele procesate inapoi pe canvas
  ctx.putImageData(imageData, 0, 0);
  console.log("Mirror effect applied.");
}

/**
 * Aplica conversia in grayscale pe imaginea oglindita.
 * Aici se face media componentelor RGB pentru a obtine valoarea de gri.
 */
function applyGrayscaleEffect(sourceCtx, sourceCanvas, targetCtx) {
  console.log("Applying grayscale effect...");
  const imageData = sourceCtx.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height); // Preluam datele imaginii de pe canvas-ul de oglindire
  const pixels = imageData.data; // Obtinerea array-ului de pixeli

  // Iteram prin fiecare pixel al imaginii pentru a calcula valoarea medie
  for (let i = 0; i < pixels.length; i += 4) {
    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3; // Calculam media valorilor RGB
    pixels[i] = pixels[i + 1] = pixels[i + 2] = avg; // Setam toate componentele RGB ale pixelului la valoarea medie
  }

  // Punem imaginea procesata in canvas-ul de grayscale
  targetCtx.putImageData(imageData, 0, 0);
  console.log("Grayscale effect applied.");
}

// Adaugam evenimentul de click pentru butonul de fetch
fetchButton.addEventListener('click', fetchDogImage);
