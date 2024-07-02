var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    World = Matter.World,
    Events = Matter.Events;

import { FRUITS_BASE } from "./Anima.js";

let FRUITS = FRUITS_BASE;

const engine = Engine.create();
const render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  }
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let score = 0;
let rank = "Beginner";

const rankThresholds = {
  Beginner: 0,
  Intermediate: 50,
  Advanced: 100,
  Expert: 200,
  Master: 500,
};

function addFruit(x = 310, y = 50) {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(x, y, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` }
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
  updateScore(0); // Update score display when a new fruit is added
}

function updateScore(points) {
  score += points;
  document.getElementById("score").innerText = `Score: ${score}`;
  updateRank();
}

function updateRank() {
  if (score >= rankThresholds.Master) {
    rank = "Master";
  } else if (score >= rankThresholds.Expert) {
    rank = "Expert";
  } else if (score >= rankThresholds.Advanced) {
    rank = "Advanced";
  } else if (score >= rankThresholds.Intermediate) {
    rank = "Intermediate";
  } else {
    rank = "Beginner";
  }
  document.getElementById("rank").innerText = `Rank: ${rank}`;
}

window.onmousemove = (event) => {
  if (currentBody && currentBody.isSleeping) {
    let mouseX = event.clientX;
    const radius = currentFruit.radius;

    // 벽을 넘지 않도록 x 좌표 제한
    const leftBoundary = 30 + radius;
    const rightBoundary = 590 - radius;

    if (mouseX < leftBoundary) mouseX = leftBoundary;
    if (mouseX > rightBoundary) mouseX = rightBoundary;

    Body.setPosition(currentBody, {
      x: mouseX,
      y: currentBody.position.y,
    });
  }
};

window.onclick = (event) => {
  if (disableAction) {
    return;
  }

  currentBody.isSleeping = false;
  disableAction = true;

  setTimeout(() => {
    addFruit(event.clientX, 50);
    disableAction = false;
  }, 1000);
};

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FRUITS.length - 1) {
        return;
      }

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` }
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);

      // 점수 업데이트
      updateScore(10); // 충돌할 때마다 점수 추가
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
      alert("Game over");
    }
  });
});

addFruit();
