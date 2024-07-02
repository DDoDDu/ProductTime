var Engine = Matter.Engine,
    Rander = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    World = Matter.World;

// 엔진 선언
const engine = Engine.create();

// 레더 선언
const rander = Rander.create({
    engine,
    element : document.body,
    option : {
        wireframes : false,
        background : '#F7F4C8',
        width : 620,
        height : 850,
    },
});

const world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
    // 고정시켜주는 
    isStatic : true,
    render : {
        fillStyle : '#E6B143'
    }
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
    // 고정시켜주는 
    isStatic : true,
    render : {
        fillStyle : '#E6B143'
    }
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
    // 고정시켜주는 
    isStatic : true,
    render : {
        fillStyle : '#E6B143'
    }
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
    // 고정시켜주는 
    isStatic : true,
    render : {
        fillStyle : '#E6B143'
    }
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Rander.run(rander);
Runner.run(engine);


