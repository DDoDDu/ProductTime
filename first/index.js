// 공격 추가
// 체력 추가 -> html로 이동

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "/first/img/background.png",
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imageSrc: "/first/img/shop.png",
    scale: 2.75,
    framesMax: 6,
})

c.fillRect(0, 0, canvas.width, canvas.height);
// 시작점과 끝점



// 플레이어 선언
const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: "/first/img/1p/Idle.png",
    framesMax: 8,
    scale: 2.5,

    offset: {
        x: 215,
        y: 157,
    },

    sprites: {
        idle: {
            imageSrc: "/first/img/1p/Idle.png",
            framesMax: 8,
        },
        run: {
            imageSrc: "/first/img/1p/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "/first/img/1p/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "/first/img/1p/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "/first/img/1p/Attack1.png",
            framesMax: 6,
        },
        takeHit: {
            imageSrc: "/first/img/1p/Takehit.png",
            framesMax: 4,
        },
        death: {
            imageSrc: "/first/img/1p/Death.png",
            framesMax: 6,
        }
    },
    // attack offset setting
    attackBox : {
        offset: {
            x : 100,
            y : 50
        },
        width : 160,
        height : 50,
    }
});

// 적 선언
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0,
    },
    imageSrc: "/first/img/2p/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imageSrc: "/first/img/2p/Idle.png",
            framesMax: 4,
        },
        run: {
            imageSrc: "/first/img/2p/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "/first/img/2p/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "/first/img/2p/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "/first/img/2p/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imageSrc: "/first/img/2p/Takehit.png",
            framesMax: 3,
        },
        death: {
            imageSrc: "/first/img/2p/Death.png",
            framesMax: 7,
        }
    },
    attackBox : {
        offset: {
            x : -170,
            y : 50
        },
        width : 170,
        height : 50,
    }
});

// 콘솔을 열어 player의 위치 확인 가능
console.log(player);

// 중복 키 입력시 발생하는 문제 수정
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    // 작성하고 애니메이트 안으로 이동

    w: {
        pressed: false,
    },

    // 적 방향키 lastKey
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

decreaseTimer();

// 재귀함수?
// 애니메이트 선언
function animate() {
    window.requestAnimationFrame(animate);
    // console.log("go");
    // 계속 부르는 것을 확인하기 위한 로그, 확인 후 없앤다.

    // 캔버스 새로 그리기
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    // c.clearRect 와 비교해보는 것도 좋음
    // 캔버스 크기 설정
    // 캔버스 새로 그리는게 위에 있는 이유, 새로 그리고 이미지를 업데이트해야 보임. 안그러면 아무것도 안보임

    background.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.15)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    player.update();
    enemy.update();
    // 실행 후 확인하면 아래로 쭉 그어지는 것을 볼 수 있다.
    // 개별 개체이므로 캔버스를 계속 비워야 한다.

    // 아무것도 입력하지 않았을 경우, 좌우로 움직이지 않음.
    player.velocity.x = 0;

    enemy.velocity.x = 0;

    // 이렇게 바꿔도 약간의 문제 발생, d를 누른 상태로 a를 누르면 왼쪽으로 가지만, a를 누른 상태로 d를 누르면 그대로임
    // 그래서 가장 마지막에 입력한 last key를 설정함
    //player.image = player.sprites.idle.image;

    // 개량한 if문
    if (keys.a.pressed && player.lastKey === "a") {
        //player.image = player.sprites.run.image;
        player.velocity.x = -2;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === "d") {
        //player.image = player.sprites.run.image;
        player.velocity.x = 2;
        player.switchSprite('run');
    }
    else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // lastKey를 player.lastKey로 변경
    // this.lastKey를 추가했기 때문에 추가한 let lastKey는 삭제해도 된다.
    // 적의 방향키 lastKey를 추가
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -2;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 2;
        enemy.switchSprite('run');
    }
    else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    if (
        // ractangle 스펠링 확인하기!
        rectangularColision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking && player.framesCurrent === 4
    ) {
        // 콘솔 로그 열어보고 부딪히면 hit메세지가 계속 뜸.
        // 정확히는 충돌 판정이 아니라 x값 기준으로만 판단하기에 넘어가도 계속 뜨는 것.
        // 그래서 두번째 조건문으로 추가해야 함.
        console.log("hit");
        player.isAttacking = false;

        // 공격시 health값 감소
        enemy.takeHit();
        //document.querySelector("#enemyHealth").style.width = enemy.health + "%";

        gsap.to("#enemyHealth", {
            width: enemy.health + "%"
        })
    }

    if(player.isAttacking && player.framesCurrent === 4)
    {
        player.isAttacking = false;
    }

    if (rectangularColision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        console.log("enemy attack success");
        enemy.isAttacking = false;

        // 플레이어 health 값 감소
        player.takeHit();
        //document.querySelector("#playerHealth").style.width = player.health + "%";
        gsap.to("#playerHealth", {
            width: player.health + "%"
        })
    }

    if(enemy.isAttacking && enemy.framesCurrent === 2)
    {
        enemy.isAttacking = false;
    }

    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }

}

animate();
// 애니메이트 사용

// 키보드 눌렀을 때, 이벤트 발생
window.addEventListener("keydown", (event) => {
    // console.log(event);
    console.log(event.key);
    // 키입력 로그 확인

    if(!player.dead)
    {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                break;
            case "w":
                player.velocity.y = -10;
                break;
            case "s":
                player.attack();
                break;
        }
    }
   
    if(!enemy.dead)
    {
        switch (event.key) {
            // 방향키도 추가
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y = -10;
                break;
            // 적 공격키 추가
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});

// 키보드 눌렀다 땠을 때, 이벤트 발생
window.addEventListener("keyup", (event) => {
    // console.log(event);
    console.log(event.key);
    // 키입력 로그 확인

    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        // 왼쪽 추가
        case "a":
            keys.a.pressed = false;
            break;

        // w의 lastKey를 추가할 필요는 없다. 추가하면 점프하고 움직임이 안됨

        // 방향키도 추가
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
});