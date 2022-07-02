window.onload = async function LongTextDemo() {
  const text =
    "兰亭集序\n\n永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右，引以为流觞曲水，列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。\n是日也，天朗气清，惠风和畅，仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  OpenWindow(800, 800, "gray", "black");
  await Flip();

  for (let w = 40; w < 750; w += 20) {
    DrawText(text, 400, 30, "white", "center", 30, "Ariel", w);
    await Flip();
    await WaitSecs(0.2);
  }
};
