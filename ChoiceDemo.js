window.onload = async function () {
  const params = new URL(document.location).searchParams;
  const keyboard = params.get("keyboard");
  const uploadURL = params.get("upload");

  OpenWindow(400, 400, "gray");

  let blockData = [];
  for (let trial = 0; trial < 5; trial++) {
    let moveLeft = Math.random() < 0.5;
    for (let frame = 1; frame < 10; frame++) {
      let x = frame * 40;
      if (moveLeft) x = 400 - x;
      DrawDots(x, 200, 16, "cyan");
      await Flip();
      await WaitMillis(50);
    }
    await Flip();
    await WaitMillis(100);

    let rectLeft = [50, 250, 100, 100];
    let rectRight = [250, 250, 100, 100];
    FillRect(...rectLeft, "indigo");
    DrawText("←", 100, 300, "yellow", "center", 40, "bold");
    FillRect(...rectRight, "indigo");
    DrawText("→", 300, 300, "yellow", "center", 40, "bold");
    let msg = `Which direction? Use ${keyboard ? "keyboard" : "mouse"}`;
    DrawText(msg, 200, 100, "white", "center", 25);
    let t0 = await Flip();

    if (keyboard) {
      var { code, timeStamp } = await KbWait(["ArrowLeft", "ArrowRight"]);
      var responseLeft = code == "ArrowLeft";
    } else {
      var { which, timeStamp } = await MouseWait([rectLeft, rectRight]);
      var responseLeft = which == 0;
    }
    var correct = responseLeft == moveLeft;

    let trialData = {
      trial: trial + 1,
      condition: moveLeft ? "left" : "right",
      correct,
      RT: (timeStamp - t0).toFixed(3),
    };
    blockData.push(trialData);

    if (correct) {
      DrawText("correct", 200, 200, "rgb(100, 255, 100)", "center", 30);
    } else {
      DrawText("oops", 200, 200, "rgb(255, 100, 100)", "center", 30);
    }
    await Flip();
    await WaitSecs(1);
  }

  let csv = ArrayToCSV(blockData, ["trial", "condition", "correct", "RT"]);
  DrawText(csv, 20, 20, "white", "left", 20);
  await Flip();

  SaveFile(csv, `Demo-${+new Date()}.csv`, "text/csv");
  if (uploadURL) UploadJSON(blockData, uploadURL);
};
