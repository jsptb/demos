window.onload = async function DotDemo() {
  await LoadScript("3rdparty/math.js");
  let [w, h] = GetWindowResolution();
  const size = Math.floor(Math.min(w, h) / 2);
  OpenWindow(size * 2, size * 2, "gray", "#000", true);

  let t0 = await Flip();
  await Flip();
  const N = 100;
  let R = math.random([N], size);
  let T = math.random([N], 2 * Math.PI);
  let Speed = math.randomInt([N], 1, 10);
  let Radius = math.randomInt([N], 4, 8);
  let Color = math.randomInt([N], 1, 0xffffff).map((i) => "#" + i.toString(16));

  while (true) {
    let keys = await KbCheck();
    if (keys["Escape"]) break;

    if (keys["KeyS"]) {
      let blob = await GetCanvasImageBlob();
      SaveFile(blob, `${GetMillis()}.png`);
      await KbWait(false);
    }

    let X = math.add(size, math.dotMultiply(R, math.cos(T)));
    let Y = math.add(size, math.dotMultiply(R, math.sin(T)));
    R = math.add(R, Speed);
    for (let i = 0; i < R.length; i++) {
      if (R[i] > size) {
        R[i] = math.random(size);
        T[i] = math.random(2 * Math.PI);
      }
    }

    DrawDots(X, Y, Radius, Color);
    await Flip();
  }

  CloseWindow();
  window.close();
};
