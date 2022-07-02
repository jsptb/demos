window.onload = async function CrowdingDemo() {
  await LoadScript("3rdparty/opentype.min.js");
  const fontURL =
    "https://cdn.jsdelivr.net/gh/denispelli/CriticalSpacing/fonts/Sloan.otf";
  const font = await opentype.load(fontURL);
  // https://github.com/denispelli/CriticalSpacing/blob/master/fonts/Sloan.otf

  const fixationSize = 16;
  const letterSize = 32;
  const alphabet = "CDHKNORSVZ";

  let DrawFixation = (x) => {
    let size = fixationSize;
    FillRect(x - size / 2, 400 - size / 2, size, size, "black");
  };

  let DrawSloan = (c, x, y, color) => {
    let size = letterSize;
    const path = font.getPath(c, x - size / 2, y + size / 2, size);
    path.fill = color;
    path.draw(jsptb.ctx2d);
  };

  OpenWindow(800, 800, "gray");
  DrawText("Press SPACEBAR to start.", 400, 400, "white", "center");
  await Flip();
  await KbWait("Space");
  await Flip();
  await WaitSecs(1);

  for (let trial = 0; trial < 10; trial++) {
    let signal = RandChoice(alphabet),
      flanker1 = RandChoice(alphabet),
      flanker2 = RandChoice(alphabet);
    let spacing = RandInt(50, 100),
      x_fixation = RandInt(50, 200),
      peripheral = RandInt();

    let t;
    DrawFixation(x_fixation);
    t = await Flip();

    if (peripheral) DrawFixation(x_fixation);
    t = await Flip(t + 200);

    DrawFixation(x_fixation);
    DrawSloan(signal, 400, 400, "rgb(180,180,180)");
    DrawSloan(flanker1, 400 - spacing, 400, "rgb(220,220,220)");
    DrawSloan(flanker2, 400 + spacing, 400, "rgb(220,220,220)");
    t = await Flip(t + 200);
    Beeper(440, 1, 0.1);

    t = await Flip(t + 200);

    await WaitSecs(0.5);
    let areas = [];
    for (let i = 0; i < alphabet.length; i++) {
      let x = 175 + 50 * i,
        s = letterSize;
      areas.push([x - s / 2, 500 - s / 2, s, s]);
      DrawSloan(alphabet[i], x, 500, "rgb(220,220,220)");
    }
    await Flip();
    let { which } = await MouseWait(areas);

    await Flip();
    let correct = alphabet[which] == signal;
    console.log(`Trial ${trial} correct=${correct}`);
    Beeper(correct ? 880 : 220, 1, 0.1);
    await WaitSecs(1);
  }
  CloseWindow();
};
