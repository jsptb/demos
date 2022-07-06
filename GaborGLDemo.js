"use strict";

let vs = `
attribute vec4 position;

void main() {
  gl_Position = position;
}
`;

let fs = `
#define PI 3.1415926538
precision mediump float;

uniform int env; // 1: gaussian, 2: linear, 3: circle, otherwise: none
uniform float size, contrast, phase, std, deg, freq, c1[3], c2[3];

void main() {
    float rad = deg/180.0*PI;
    vec3 c1 = vec3(c1[0], c1[1], c1[2]);
    vec3 c2 = vec3(c2[0], c2[1], c2[2]);
    vec2 xy = gl_FragCoord.xy - vec2(size/2.0, size/2.0);
    vec2 t = vec2(cos(rad), sin(rad)) * freq * 2.0 * PI;
    float amp = 0.5 + 0.5 * sin(dot(t, xy) + phase * PI);
    float alpha = contrast;
    if (env==1) alpha *= exp(dot(xy, xy) * -0.5 / (std * std)); // gaussian
    else if (env==2) alpha *= 1.0 - (sqrt(dot(xy, xy)) / size * 2.0); // linear
    else if (env==3) alpha *= clamp(sign(size/2.0 - sqrt(dot(xy, xy))), 0.0, 1.0); // circle
    gl_FragColor = vec4(amp*c1 + (1.0-amp)*c2, alpha);
}
`;

let GL;

function InitWebGL(size) {
  let canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  let gl = canvas.getContext("webgl");
  let programInfo = twgl.createProgramInfo(gl, [vs, fs]);

  let arrays = {
    position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0],
  };
  let bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

  gl.useProgram(programInfo.program);
  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
  GL = { size, gl, canvas, bufferInfo, programInfo };
}

function MakeGaborGL(uniforms) {
  const size = uniforms.size;
  if (GL?.size != size) InitWebGL(size);
  const { gl, bufferInfo, programInfo } = GL;

  twgl.setUniforms(programInfo, uniforms);
  twgl.drawBufferInfo(gl, bufferInfo);

  let pixels = new Uint8ClampedArray(size * size * 4);
  gl.readPixels(0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  let imgData = new ImageData(pixels, size);
  return createImageBitmap(imgData);
}

const uniforms = {
  size: 100,
  deg: -60,
  std: 15,
  freq: 0.05,
  phase: 0,
  env: 1,
  contrast: 0.5,
  c1: [1, 1, 1],
  c2: [0, 0, 0],
};

window.onload = async function GaborGLDemo() {
  let [w, h] = GetWindowResolution();
  OpenWindow(w, h, "gray");
  await LoadScript("3rdparty/twgl-full.min.js");

  let dest = Array(50);
  let flipT = [];

  for (let f = 0; ; f++) {
    for (let i = 0; i < dest.length; i++) {
      let d = dest[i];
      if (d && d.x >= 0 && d.x < w && d.y >= 0 && d.y < h) {
        d.x += d.speed * Math.cos(d.dir);
        d.y += d.speed * Math.sin(d.dir);
      } else {
        d = {
          x: w * Math.random(),
          y: h * Math.random(),
          dir: 2 * Math.PI * Math.random(),
          ori: 360 * Math.random(),
          speed: Math.random(),
          size: 20 + 80 * Math.random(),
        };
        dest[i] = d;
      }
    }

    let gabor = await MakeGaborGL({ ...uniforms, phase: f * 0.02 });

    for (let i = 0; i < dest.length; i++) {
      let { x, y, size, ori } = dest[i];
      DrawImage(gabor, [], [x, y, size, size], ori);
    }
    DrawImage(gabor);

    let keys = await KbCheck();
    if (keys["KeyS"]) {
      let blob = await GetCanvasImageBlob();
      SaveFile(blob, `${~~GetMillis()}.png`);
      await KbWait(false);
    }

    let fps =
      1000 / ((flipT[flipT.length - 1] - flipT[flipT.length - 11]) / 10);
    let msg = `fps=${fps.toFixed(2)}
A Gabor patch is generated with WebGL on-the-fly every frame.
Press S key to take a screenshot.`;
    DrawText(msg, 50, 50, "white", "left", 30, "Arial", w - 100);

    let ts = await Flip();
    flipT.push(ts);
  }
};
