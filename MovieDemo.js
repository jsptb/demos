window.onload = async function MovieDemo() {
  OpenWindow(1000, 600, "gray", "black");

  // browsers will block autoplay unless user makes an action
  DrawText("Click to play media", 20, 20, "#7f7");
  await Flip();
  await MouseWait();

  const audioURL = "3rdparty/nihao.ogg";
  let audio = await LoadAudio(audioURL, false);

  await audio.play();
  while (!audio.ended) {
    DrawText(audio.currentTime.toFixed(2), 20, 20, "white");
    await Flip();
  }
  audio.pause();

  DrawText("Loading movie...", 20, 20, "#f77");
  await Flip();

  const videoURL =
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Schlossbergbahn.webm/Schlossbergbahn.webm.480p.webm";

  let video = await LoadVideo(videoURL);
  await video.play();
  let t0 = GetMillis();
  while (!video.ended) {
    let keys = await KbCheck();
    if (keys["Escape"]) break;
    DrawImage(video, [], [20, 60]);
    DrawText(video.currentTime.toFixed(2), 20, 20, "white");
    await Flip();
  }

  CloseWindow();
  window.close();
};
