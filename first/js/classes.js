class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        // velocity 추가하면서 중괄호로 묶는다. (편하게 관리하게 위해 쓰는거 같음)
        this.position = position;

        this.width = 50;
        this.height = 150;

        this.image = new Image();
        this.image.src = imageSrc;

        this.scale = scale;
        this.framesMax = framesMax;

        this.framesCurrent = 0;

        this.framesElapsed = 0;
        this.framesHold = 10;

        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            // 이미지 자르는 영역
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            // 이미지 자르는 영역 
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale);
    }

    animateFrame() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
            else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();
        this.animateFrame();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = "red",
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0, },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {

        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset,
        })

        // velocity 추가하면서 중괄호로 묶는다. (편하게 관리하게 위해 쓰는거 같음)
        //this.position = position;
        this.velocity = velocity;

        this.width = 50;
        this.height = 150;
        // 라스트키 추가, 플레이어와 적을 구분하기 위함
        this.lastKey;

        this.attackBox = {
            width: attackBox.width,
            height: attackBox.height,
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset : attackBox.offset,
        };

        this.color = color;

        this.isAttacking;

        // 체력 추가
        this.health = 100;

        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;

        this.sprites = sprites;

        this.dead = false;

        for (const sprite in sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    // draw() {
    //     c.fillStyle = this.color;
    //     // 순서 중요 fillStyle이 먼저 있어야 함
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     // 플레이어의 시작점과 이미지 픽셀의 끄점

    //     if (this.isAttacking) {
    //         c.fillStyle = "green";
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    //     }
    // }

    animateFrame() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            }
            else {
                this.framesCurrent = 0;
            }
        }
    }

    update() {
        this.draw();

        if(!this.dead)
        {
            this.animateFrame();
        }

        // Box의 대소문자 확인!
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        console.log(this.attackBox.position.x)

        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )


        this.position.y += this.velocity.y;
        // 값 변경하고 const player의 velocity안 값을 10으로 변경.

        //d를 눌렀을 때 x의 속도 변화
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 330;
            // this의 현재 위치와 this의 높이와 this의 속도가 canvas의 전체 높이보다 커지면 속도를 0으로 만든다.
        } else {
            this.velocity.y += gravity;
            // 중력 추가, else 때문에 더 이상 땅으로 들어가지 않는다.
        }

    }

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
        // 공격 딜레이 걸기
    }

    takeHit()
    {
        this.health -= 20;

        if(this.health <= 0)
        {
            this.switchSprite('death');
        }
        else{
            this.switchSprite('takeHit');
        }
    }


    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) 
        {
            if(this.framesCurrent === this.sprites.death.framesMax - 1)
            {
                this.dead = true;
            }
            return;
        }
        
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return;
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return;

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
}