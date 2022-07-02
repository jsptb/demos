window.onload = async function GaborDemo() {
  OpenWindow(800, 600, "gray", "#000", true);
  await LoadScript("3rdparty/math.js");

  const c1 = [
      [100, 100, 100],
      [0, 0, 0],
      [255, 0, 0],
    ],
    c2 = [
      [200, 200, 200],
      [255, 255, 255],
      [0, 255, 255],
    ],
    freqs = [0.1, 0.05, 0.02];

  DrawText("Generating Gabor patches...", 400, 300, "white", "center");
  await Flip();

  let jobs = [];
  for (let i of [0, 1, 2])
    for (let deg of [10, 30, 50, 70])
      for (let phase of [0, 1])
        jobs.push(MakeGabor(100, deg, 15, freqs[i], phase, c1[i], c2[i]));

  let gabors = await Promise.all(jobs);

  for (let f = 0; ; f++) {
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 4; j++) {
        let p = (i * 4 + j) * 2 + (f % 2);
        DrawImage(gabors[p], [], [50 + 200 * j, 50 + 200 * i]);
      }
    await Flip();
    await WaitMillis(200);
  }
};
