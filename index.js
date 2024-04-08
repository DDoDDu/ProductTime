// 공격 추가
// 체력 추가 -> html로 이동

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

c.fillRect(0, 0, canvas.width, canvas.height);
// 시작점과 끝점

class Sprite {
    constructor({ position, velocity, color = "red", offset }) {
        // velocity 추가하면서 중괄호로 묶는다. (편하게 관리하게 위해?)
        this.position = position;
        this.velocity = velocity;

        this.width = 50;
        this.height = 150;
        // 라스트키 추가, 플레이어와 적을 구분하기 위함
        this.lastKey;

        this.attackBox = {
            width: 100,
            height: 50,
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset,
        };

        this.color = color;

        this.isAttacking;

        // 체력 추가
        this.health = 100;
    }

    draw() {
        c.fillStyle = this.color;
        // 순서 중요 fillStyle이 먼저 있어야 함
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        // 플레이어의 시작점과 이미지 픽셀의 끄점

        if (this.isAttacking) {
            c.fillStyle = "green";
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }
    }

    update() {
        this.draw();

        // Box의 대소문자 확인!
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.y += this.velocity.y;
        // 값 변경하고 const player의 velocity안 값을 10으로 변경.

        //d를 눌렀을 때 x의 속도 변화
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            // this의 현재 위치와 this의 높이와 this의 속도가 canvas의 전체 높이보다 커지면 속도를 0으로 만든다.
        } else {
            this.velocity.y += gravity;
            // 중력 추가, else 때문에 더 이상 땅으로 들어가지 않는다.
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
        // 공격 딜레이 걸기
    }
}

// 플레이어 선언
const player = new Sprite({
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
});

// 적 선언
const enemy = new Sprite({
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

function rectangularColision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}


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

    player.update();
    enemy.update();
    // 실행 후 확인하면 아래로 쭉 그어지는 것을 볼 수 있다.
    // 개별 개체이므로 캔버스를 계속 비워야 한다.

    // 아무것도 입력하지 않았을 경우, 좌우로 움직이지 않음.
    player.velocity.x = 0;

    enemy.velocity.x = 0;

    // 이렇게 바꿔도 약간의 문제 발생, d를 누른 상태로 a를 누르면 왼쪽으로 가지만, a를 누른 상태로 d를 누르면 그대로임
    // 그래서 가장 마지막에 입력한 last key를 설정함

    // 개량한 if문
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -1;
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 1;
    }
    // lastKey를 player.lastKey로 변경
    // this.lastKey를 추가했기 때문에 추가한 let lastKey는 삭제해도 된다.

    // 적의 방향키 lastKey를 추가
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -1;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 1;
    }

    if (
        // ractangle 스펠링 확인하기!
        rectangularColision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking
    ) {
        // 콘솔 로그 열어보고 부딪히면 hit메세지가 계속 뜸.
        // 정확히는 충돌 판정이 아니라 x값 기준으로만 판단하기에 넘어가도 계속 뜨는 것.
        // 그래서 두번째 조건문으로 추가해야 함.
        console.log("hit");
        player.isAttacking = false;

        // 공격시 health값 감소
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    if (rectangularColision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        console.log("enemy attack success");
        enemy.isAttacking = false;

        // 플레이어 health 값 감소
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

}

animate();
// 애니메이트 사용

// 키보드 눌렀을 때, 이벤트 발생
window.addEventListener("keydown", (event) => {
    // console.log(event);
    console.log(event.key);
    // 키입력 로그 확인

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
        case " ":
            player.attack();
            break;

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