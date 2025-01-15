# JS-App_for-image-processing

Documentație pentru Cod JavaScript - Efecte pe Imaginea Câinelui
Joița Fabian-Gabriel - 323AC

1. Elemente HTML

- fetchButton: Butonul care, atunci când este apăsat, inițiază procesul de preluare a imaginii și aplicarea efectelor.
- dogInfoDiv: Div-ul în care sunt afișate informațiile JSON ale imaginii primite de la API-ul DOG.
- mirrorCanvas: Canvas-ul pe care este desenată imaginea originală și aplicat efectul de oglindire.
- grayscaleCanvas: Canvas-ul pe care este aplicat efectul de conversie în grayscale.
- mirrorCtx: Contextul 2D pentru canvas-ul de oglindire.
- grayscaleCtx: Contextul 2D pentru canvas-ul de grayscale.
- mirrorTimeDiv: Div-ul în care este afișat timpul de procesare pentru efectul de oglindire.
- grayscaleTimeDiv: Div-ul în care este afișat timpul de procesare pentru efectul de grayscale.

2. Funcția fetchDogImage

Aceasta este o funcție asincronă care preia o imagine aleatorie de câine de la API-ul DOG (https://dog.ceo/api/breeds/image/random) și o procesează. Folosește `async/await` pentru a aștepta răspunsul de la server și a manipula imaginea.

Pași:

1.1. Fetch de la API-ul DOG:

- Folosește `fetch` pentru a obține o imagine aleatorie cu un câine de la API-ul DOG.
- `await` este utilizat pentru a aștepta răspunsul de la server.
- Răspunsul este un obiect JSON care conține URL-ul imaginii.

  1.2. Crearea unui obiect Image:

- Se creează un obiect de tip `Image` pentru a încărca și a desena imaginea pe canvas.
- `img.crossOrigin = "anonymous"` permite accesul imaginii dintr-o sursă externă, evitând problemele de **Cross-Origin Resource Sharing (CORS)**.

  1.3. Setarea sursei imaginii:

- `img.src` este setat la URL-ul imaginii obținut din JSON.

  1.4. Când imaginea este încărcată (`img.onload`):

- Se setează dimensiunile canvas-urilor de oglindire și grayscale la dimensiunile imaginii.
- Imaginea este desenată pe canvas-ul de oglindire.

  1.5. Începerea cronometrului pentru efectul de oglindire:

- După 1 secundă, se aplică efectul de oglindire pe imaginea de pe canvas.
- Se măsoară timpul de procesare pentru acest efect.

  1.6. Începerea cronometrului pentru efectul de grayscale:

- După încă 1 secundă, se aplică efectul de conversie în grayscale pe imaginea oglindită.
- Se măsoară timpul de procesare pentru acest efect.

3. Funcția applyMirrorEffect

Această funcție aplică efectul de oglindire asupra imaginii.

Pași:

3.1. Preluarea datelor imaginii de pe canvas:

- `ctx.getImageData()` este folosit pentru a prelua datele imaginii pe care o vom manipula (RGBA).

  3.2. Schimbarea pixelilor pentru efectul de oglindire:

- Se iterează prin fiecare pixel din jumătatea stângă a imaginii.
- Fiecare pixel din stânga este schimbat cu pixelul corespunzător din dreapta (pe axa orizontală).
- Se folosesc indexuri pentru a accesa fiecare componentă a pixelilor: `R`, `G`, `B`, `A`.

  3.3. Punerea datelor procesate înapoi pe canvas:

- După modificarea pixelilor, se folosește `ctx.putImageData()` pentru a pune imaginea procesată înapoi pe canvas.

4. Funcția applyGrayscaleEffect

Această funcție aplică efectul de conversie în grayscale asupra imaginii oglindite.

Pași:

4.1. Preluarea datelor imaginii de pe canvas-ul de oglindire:

- Se folosește `sourceCtx.getImageData()` pentru a obține datele imaginii pe care dorim să o transformăm în grayscale.

  4.2. Calcularea mediei valorilor RGB pentru fiecare pixel:

- Pentru fiecare pixel, se calculează media valorilor `R`, `G` și `B`, pentru a obține o nuanță de gri.
- `pixels[i]`, `pixels[i + 1]`, și `pixels[i + 2]` sunt setate la acea valoare medie, astfel încât toți cei 3 parametri RGB devin egali.

  4.3. Punerea imaginii procesate pe canvas-ul de grayscale:

- După ce toate pixelii au fost transformați într-o nuanță de gri, se folosește `targetCtx.putImageData()` pentru a pune imaginea procesată pe canvas-ul de grayscale.

5. Evenimentul de click

La apăsarea butonului cu ID-ul `fetchButton`, se declanșează funcția `fetchDogImage(`.

fetchButton.addEventListener('click', fetchDogImage);
