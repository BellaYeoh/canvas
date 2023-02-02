const clientWidth = window.innerWidth;
const clientHeight = window.innerHeight;

const mountainSvg = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'svg'
);

const startX = 0;
const startY = clientHeight;

mountainSvg.setAttribute('width', clientWidth);
mountainSvg.setAttribute('height', clientHeight);

mountainSvg.appendChild(drawPolygon(startX, startY));

document.body.appendChild(mountainSvg);

function drawPolygon(startX, startY) {
  const polygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );

  let points = '';

  for (var i = 0; i < 6; i++) {
    points += `${startX + i * 100} ${startY - i * 20},`;
  }

  for (var i = 5; i >= 0; i--) {
    if (i === 0) {
      points += `${startX + (10 - i) * 100} ${startY - i * 20}`;
    } else {
      points += `${startX + (10 - i) * 100} ${startY - i * 20},`;
    }
  }

  polygon.setAttribute('points', points);
  polygon.setAttribute('fill', '#2f90b9');

  polygon.appendChild(createAnimation());

  return polygon;
}

function createAnimation() {
  const animation = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'animateMotion'
  );

  animation.setAttribute('path', `M 0 0 L ${clientWidth} 0`);

  animation.setAttribute('repeatCount', 'indefinite');
  animation.setAttribute('dur', '20s');
  return animation;
}
