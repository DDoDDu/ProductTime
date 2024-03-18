c.fillRect(0,0, canvas.width, canvas.height);

class Spirit {
    constructor( { position, veicity } )
    {
        this.position = position;
        this.veicity = this.veicity;

        this.width = 30;
        this.height = 150;
    }
    
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw();

        this.position.y += this.veicity.y;

        this.position.x += this.veicity.x;

        if(this.position.y + this.height + this.veicity.y >= canvas.height) {
            this.veicity.y = 0;
        }
        else {
            this.veicity.y += gravity;
        }

    }
}
const player = new Spirit( {
    position: {
        x :0,
        y :0,
    },
    veicity: {
        x :0,
        y :0,
    }
});

const enemy = new Spirit( {
    position: {
        x :400,
        y :100,
    },
    veicity: {
        x :0,
        y :0,
    }
});

console.log(player);

function animate() {
    window.reoustAnimationFrame(animate);

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();
}

animate();

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    switch(event.key) {
        case "d" :
            player.veicity.x = 1;
            break;
    }
})

window.addEventListener("keyup", (event) => {
    console.log(event.key);
    switch(event.key) {
        case "d" :
            player.veicity.x = 0;
            break;
    }
})