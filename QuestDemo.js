// adapted from https://github.com/kurokida/jsQUEST
window.onload = async function QuestDemo() {
  OpenWindow(600, 600, "gray");
  await LoadScript("3rdparty/jsQUEST.js");
  const tGuess = -1;
  const tGuessSd = 2;
  const pThreshold = 0.82;
  const beta = 3.5;
  const delta = 0.01;
  const gamma = 0.5;
  let q = jsQUEST.QuestCreate(tGuess, tGuessSd, pThreshold, beta, delta, gamma);
  const trialsDesired = 40;
  for (let k = 0; k < trialsDesired; k++) {
    // % Get recommended level.  Choose your favorite algorithm.
    let tTest = jsQUEST.QuestQuantile(q); // % Recommended by Pelli (1987), and still our favorite.
    // tTest=jsQUEST.QuestMean(q);		// % Recommended by King-Smith et al. (1994)
    // tTest=jsQUEST.QuestMode(q).mode;		// % Recommended by Watson & Pelli (1983)

    // % We are free to test any intensity we like, not necessarily what Quest suggested.
    // % 	tTest=min(-0.05,max(-3,tTest)); % Restrict to range of log contrasts that our equipment can produce.

    // % Simulate a trial
    const msg = `Trial ${k + 1} at Intensity ${tTest.toFixed(2)}
      Press F or J to simulate wrong or right response`;

    DrawText(msg, 300, 300, "white", "center", 20);
    await Flip();

    let { code } = await KbWait(["KeyF", "KeyJ"]);
    let response = +(code == "KeyJ");

    // % Update the pdf
    q = jsQUEST.QuestUpdate(q, tTest, response); // % Add the new datum (actual test intensity and observer response) to the database.

    await KbWait(false);
  }
  // % Ask Quest for the final estimate of threshold.
  const t = jsQUEST.QuestMean(q).toFixed(2); // % Recommended by Pelli (1989) and King-Smith et al. (1994). Still our favorite.
  const sd = jsQUEST.QuestSd(q).toFixed(2);
  const msg = `Final threshold estimate (mean+-sd) is ${t} +- ${sd}
      Mode threshold estimate is ${jsQUEST.QuestMode(q).mode},
      and the pdf is ${jsQUEST.QuestMode(q).pdf.toFixed(2)}
  
    Quest knew only your guess: ${tGuess} +- ${tGuessSd}.`;
  DrawText(msg, 300, 300, "white", "center", 20);
  await Flip();
};
