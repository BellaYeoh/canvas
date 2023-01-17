/**
 * 实现封面图片 兔年大吉 + 兔子图案 + 两侧烟花效果
 */
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var textCanvas = document.createElement('canvas');
textCanvas.width = 1000;
textCanvas.height = 300;
var textCtx = textCanvas.getContext('2d');
textCtx.fillStyle = '#000';
textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

var svgCanvas = document.createElement('canvas');
svgCanvas.width = 300;
svgCanvas.height = 300;
var svgCtx = svgCanvas.getContext('2d');

var particles = [];

var lastStamp = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  clearCanvas();
}

function clearCanvas() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas, false);

function mouseDownHandler(e) {
  var x = e.clientX;
  var y = e.clientY;

  createFireworks(
    x,
    y,
    ['', 'rabbit'][Math.floor(Math.random() * 2)]
  );
}

document.addEventListener('mousedown', mouseDownHandler);

function tick(opt = 0) {
  if (opt - lastStamp > 2000) {
    lastStamp = opt;
    createFireworks(
      canvas.width / 2,
      canvas.height * 0.2,
      '兔年大吉'
    );
    createFireworks(canvas.width / 2, canvas.height * 0.6, 'rabbit');
    createFireworks(canvas.width / 2 - 480, canvas.height * 0.5, '');
    createFireworks(canvas.width / 2 + 480, canvas.height * 0.5, '');
  }

  context.globalCompositeOperation = 'destination-out';
  context.fillStyle = 'rgba(0,0,0,' + 10 / 100 + ')';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = 'lighter';

  drawFireworks();

  requestAnimationFrame(tick);
}

tick();

function createFireworks(x, y, text = '') {
  if (text === 'rabbit') {
    createRabbitFirework(x, y);
  } else if (text !== '') {
    createTextFirework(x, y, text);
  } else {
    createBeautyFirework(x, y);
  }
}

function createRabbitFirework(x, y) {
  var image = new Image();
  image.src = getSvg();
  var hue = Math.random() * 360;
  var hueVariance = 30;

  image.onload = function () {
    svgCanvas.width = this.width;
    svgCanvas.height = this.height;
    svgCtx.clearRect(0, 0, this.width, this.height);
    svgCtx.drawImage(this, 0, 0);
    var rabbitData = svgCtx.getImageData(0, 0, 300, 300);

    var svgWidth = 300;
    var svgHeight = 300;

    var gap = 6;

    svgCtx.fillStyle = '#fff';
    svgCtx.fillRect(0, 0, svgCanvas.width, svgCanvas.height);

    for (var h = 0; h < svgHeight * 1.2; h += gap) {
      for (var w = 0; w < svgWidth; w += gap) {
        var position = (svgWidth * h + w) * 4;
        var a = rabbitData.data[position + 3];

        if (!a) continue;

        var p = {};
        p.x = x;
        p.y = y;

        p.fx = x + w - svgWidth / 2;
        p.fy = y + h - svgHeight / 2;

        p.size = Math.floor(Math.random() * 2) + 1;
        p.speed = 1;

        setupColors(p, hue, hueVariance);

        particles.push(p);
      }
    }
  };
}

function createTextFirework(x, y, text = '') {
  var gap = 6;
  var fontSize = 120;
  var hue = Math.random() * 360;
  var hueVariance = 30;

  textCtx.font = fontSize + 'px Verdana';
  textCtx.fillStyle = '#fff';

  var textWidth = textCtx.measureText(text).width;
  var textHeight = fontSize;

  textCtx.fillText(text, 0, textHeight);
  var imgData = textCtx.getImageData(
    0,
    0,
    textWidth,
    textHeight * 1.2
  );

  textCtx.fillStyle = '#000';
  textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);

  for (var h = 0; h < textHeight * 1.2; h += gap) {
    for (var w = 0; w < textWidth; w += gap) {
      var position = (textWidth * h + w) * 4;
      var r = imgData.data[position];
      var g = imgData.data[position + 1];
      var b = imgData.data[position + 2];

      if (r + g + b === 0) continue;

      var p = {};
      p.x = x;
      p.y = y;

      p.fx = x + w - textWidth / 2;
      p.fy = y + h - textHeight / 2;

      p.size = Math.floor(Math.random() * 2) + 1;
      p.speed = 1;

      setupColors(p, hue, hueVariance);

      particles.push(p);
    }
  }
}

function createBeautyFirework(x, y) {
  var count = 100;
  var hue = Math.random() * 360;
  var hueVariance = 30;
  for (var i = 0; i < count; i++) {
    var p = {};

    p.x = x;
    p.y = y;
    // 角度
    var angle = Math.floor(Math.random() * 360);
    // 弧度
    p.radians = (angle * Math.PI) / 180;
    // 速度
    p.speed = Math.random() * 5 + 0.4;
    // 半径
    p.radius = Math.random() * 81 + 50;
    // 大小
    p.size = Math.random() * 2 + 1;

    p.fx = x + Math.cos(p.radians) * p.radius;
    p.fy = y + Math.sin(p.radians) * p.radius;

    setupColors(p, hue, hueVariance);

    particles.push(p);
  }
}

function setupColors(p, hue, hueVariance) {
  // 色相 0 到 360 - 0 (或 360) 为红色, 120 为绿色, 240 为蓝色
  p.hue = hue - Math.floor(Math.random() * hueVariance);
  // 亮度 0% 为暗, 50% 为普通, 100% 为白
  p.brightness = Math.floor(Math.random() * 21) + 50;
  // 透明度 0（透完全明） 1（完全不透明）
  p.alpha = (Math.floor(Math.random() * 61) + 40) / 100;
}

function drawFireworks() {
  clearCanvas();

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];

    p.x += (p.fx - p.x) / 10;
    p.y += (p.fy - p.y) / 10 - (p.alpha - 1) * p.speed;

    p.alpha -= 0.006;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }

    context.beginPath();
    context.arc(p.x, p.y, p.size, 0, Math.PI * 2, false);
    context.closePath();

    context.fillStyle = `hsla(${p.hue},100%,${p.brightness}%,${p.alpha})`;
    context.fill();
  }
}

function getSvg() {
  return `
  data:image/svg+xml;charset=utf-8,
  <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 1024 1024" width="300" height="300">
   <path d="M927.214287 768.761116c-20.672648-20.672648-49.623265-32.140621-76.355137-32.814858v-7.113648c0-162.755518-133.620747-295.904002-296.242606-295.904002h-41.173023a230.235673 230.235673 0 0 0-34.899944-74.463115c41.464104-15.207465 79.102579-39.144371 110.788759-70.83055 57.824009-57.824009 89.25475-134.51775 89.25475-216.290547v-27.513037h-23.56266c-47.12829 0-93.312055 12.13627-135.034566 32.800007-0.99502-18.029163-3.579101-35.511807-7.737392-53.142961L506.653626 0l-23.734933 5.71171c-65.602984 15.445082-122.910177 51.069756-165.728695 102.899886-37.139481 44.954098-61.011043 100.443524-68.127661 157.991304-105.302784 20.230087-185.308307 113.057997-185.308307 224.158628v227.307048H256.627456c-30.599083 32.672288-47.894604 77.608565-47.894604 122.720084 0 100.767277 81.725273 183.21134 182.174738 183.21134h459.94859v-63.410971c26.731872-0.629684 56.038914-12.222406 76.68483-32.868321 43.825419-43.825419 43.495726-115.134173-0.326723-158.959592zM488.226455 157.103212a257.347732 257.347732 0 0 1 141.147255-60.084338c-5.809727 59.044765-31.617864 113.794609-74.124511 156.301256-31.439652 31.442622-70.150373 54.028084-112.553062 65.864362a229.528764 229.528764 0 0 0-37.739463-26.871472c12.71249-52.376648 41.823499-99.897006 83.269781-135.209808z m-133.424713-17.357896c30.501066-36.922656 69.761275-64.019863 114.614386-79.328315 1.502925 11.27788 2.260328 22.635955 2.260328 33.976209 0 4.410759-0.124749 8.824488-0.353455 13.214456a309.881801 309.881801 0 0 0-14.738172 11.785785c-47.12829 40.154242-80.893615 94.021934-96.989172 153.241941a227.310018 227.310018 0 0 0-60.54472-9.968018c7.345324-44.808558 26.645736-87.689451 55.750805-122.922058zM111.277358 670.542278v-179.783721c0-98.946539 81.356967-179.448087 180.303506-179.448086s179.875797 80.667879 179.875797 179.614418-80.070867 179.614418-179.020377 179.614418H111.277358z m279.633202 305.931424c-73.551261 0-133.389071-60.725903-133.389071-134.592006a129.109001 129.109001 0 0 1 10.443251-51.040054c16.163872 77.11551 62.300113 141.07894 125.50911 185.63206h-2.56329z m-80.629266-247.641092v-10.541269c118.80832-9.204675 210.317458-107.251241 210.317458-227.045669 0-2.783085 0.008911-4.85332-0.092076-7.823528h34.109868c131.903967 0 239.89479 103.915697 245.861938 234.500892-33.316823-36.200895-81.054006-59.175454-134.015785-59.175454-100.449464 0-182.171767 81.600524-182.171767 182.049988 0 53.092468 22.766644 100.883115 59.12496 134.208849-129.498099-5.889922-233.134596-114.082719-233.134596-246.173809z m490.08432 247.641092h-133.899947c-73.548291 0-133.383131-61.043715-133.383131-134.592006s60.093248-133.986083 133.641539-133.986083 133.644509 59.231888 133.644509 132.777209v135.80088z m92.349707-83.254931c-11.42936 11.432331-27.005131 17.966788-41.856171 18.578652v-127.074409c14.85104 0.641565 30.747593 7.098797 42.185864 18.537068 24.804207 24.801237 24.474514 65.157453-0.329693 89.958689z" p-id="5195">
	</path>
	<path d="M374.62788 499.009795c0-53.858782-43.816508-97.67232-97.67232-97.67232-53.858782 0-97.67529 43.816508-97.67529 97.67232 0 53.858782 43.816508 97.67529 97.67529 97.67529 53.855811 0 97.67232-43.816508 97.67232-97.67529z m-97.67232 48.886654c-26.957608 0-48.886653-21.932016-48.886653-48.886654s21.932016-48.886653 48.886653-48.886653 48.886653 21.929046 48.886654 48.886653-21.932016 48.886653-48.886654 48.886654z" p-id="5196">
	</path>
  </svg>
`;
}
