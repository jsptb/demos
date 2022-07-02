window.onload = async function MouseDemo() {
  OpenWindow(500, 500, "#777", "#000", true);

  const icon = await LoadImage("3rdparty/icon.svg", false);

  let slider = { x: 10, y: 18, w: 200, h: 5 };
  let handle = { x: 10, y: 10, w: 15, h: 20 };
  let reset = { x: 300, y: 10, w: 50, h: 20 };

  let area = { x: 10, y: 40, w: 400, h: 400 };
  let icons = [];

  function InRect(x, y, rect) {
    let dX = x - rect.x,
      dY = y - rect.y;
    return dX >= 0 && dX < rect.w && dY >= 0 && dY < rect.h;
  }

  let dragOffset = 0;

  while (true) {
    let [x, y, buttons] = await GetMouse();

    if (!buttons) dragOffset = 0; // released

    if (dragOffset) {
      let x1 = x - dragOffset;
      x1 = Math.max(x1, slider.x);
      x1 = Math.min(x1, slider.x + slider.w);
      handle.x = x1;
    } else if (buttons && InRect(x, y, handle)) {
      dragOffset = x - handle.x;
    }

    let value = Math.floor(((handle.x - slider.x) / slider.w) * 100);
    FillRect(slider.x, slider.y, slider.w + handle.w, slider.h, "#fff");
    FillRect(handle.x, handle.y, handle.w, handle.h, "#77f");
    DrawText(`${value}`, 250, 20, "#fff", "center", 20);
    FillRect(reset.x, reset.y, reset.w, reset.h, "#f00");

    FillRect(area.x, area.y, area.w, area.h, "#ccc");

    if (buttons && InRect(x, y, area) && !dragOffset) {
      let s = value * 0.8 + 20,
        r = Math.random() * 360;
      icons.push({ x, y, s, r });
      while (buttons) [, , buttons] = await GetMouse(); // wait for release
    }

    if (buttons && InRect(x, y, reset) && !dragOffset) icons = [];

    for (let { x, y, s, r } of icons)
      DrawImage(icon, [], [x - s / 2, y - s / 2, s, s], r);

    if (InRect(x, y, area)) {
      HideCursor();
      DrawDots(x, y, 3, "cyan"); // draw custom cursor
    } else {
      ShowCursor();
    }
    await Flip();
  }
};
