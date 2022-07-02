window.onload = async function BasicDrawingDemo() {
  OpenWindow(400, 400, "gray");

  DrawLine(20, 200, 380, 200, "black", 2);
  FillOval(200, 100, 60, 60, "rgb(100, 200, 100)");
  FrameOval(200, 100, 80, 60, "#ff7777", 10);
  DrawDots(200, 100, 4, "white");

  await Flip();

  const image = await LoadImage("3rdparty/lion.jpg", false);
  DrawImage(image, [], [150, 40, 100, 120]);

  DrawLine(20, 200, 380, 200, "black", 2);
  FrameRect(100, 250, 80, 100, "indigo", 6);
  FillRect(220, 280, 100, 40, "rgb(100, 100, 100)");

  DrawDots([100, 200, 300], [180, 220, 180], 5, "#cad");
  DrawText("(200,220)", 200, 220, "black", "left", 20);

  DrawText("+", 140, 300, "#F8EA8C", "center", 50);
  DrawText("Times", 270, 300, "white", "center", 20, "Times");

  await WaitMillis(1500);
  await Flip();
};
