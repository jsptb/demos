window.onload = async function CFSDemo() {
  const w = 200,
    h = 240;

  //const imageURL = "3rdparty/lion.jpg";

  // drawing images without CORS taints the canvas
  // see https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
  // here we use data URL instead, so that the demo works offline

  await LoadScript("3rdparty/lion.jpg.js");

  const img1 = await LoadImage(imageURL);
  let imdata1 = await GetImageData(img1);

  let t0 = 0;
  let amp = 0;

  OpenWindow(w, h, "gray", "#000", true);

  while (true) {
    let keys = await KbCheck();
    let [, , buttons] = await GetMouse();
    if (keys["Escape"]) break;
    if (!keys["Space"] && !buttons) {
      amp = 0;
    } else {
      amp += 0.05;
      if (amp > 0.5) amp = 0.5;
    }
    jsptb.debugMessage = amp.toFixed(3);

    for (let i = 0; i < 250; i++)
      FillRect(
        RandInt(0, w),
        RandInt(0, h),
        RandInt(20, 100),
        RandInt(20, 100),
        "#" + RandInt(0, 0xffffff).toString(16)
      );

    const img2 = await GetCanvasImageBlob(false);
    let imdata2 = await GetImageData(img2);

    let arr = new Uint8ClampedArray(4 * w * h);
    for (let i = 0; i < 4 * w * h; i += 4) {
      arr[i] = amp * imdata1[i];
      arr[i + 1] = imdata2[i + 1];
      arr[i + 2] = imdata2[i + 2];
      arr[i + 3] = 255;
    }

    let imgData = new ImageData(arr, w);
    let bitmap = await createImageBitmap(imgData);
    DrawImage(bitmap);
    DrawText("+", w / 2, h / 2, "white", "center", 60);

    t0 = await Flip(t0 + 100 - 5);
  }
};
