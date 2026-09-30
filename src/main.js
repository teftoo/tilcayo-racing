const config = {
    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    parent: "game-container",

    backgroundColor: "#8fcf78",

    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },

    scene: {
        preload,
        create,
        update
    }
};

new Phaser.Game(config);


// ==========================================
// VARIABLES
// ==========================================

let player;

let cursors;
let keys;

let speed = 0;

const MAX_SPEED = 260;
const ACCELERATION = 180;
const FRICTION = 100;
const TURN_SPEED = 2.5;

let lap = 1;
const TOTAL_LAPS = 3;

let tilcayoCount = 0;

let lapText;
let tilcayoText;
let speedText;

let tilcayos;
let obstacles;


// ==========================================
// PRELOAD
// ==========================================

function preload() {

}


// ==========================================
// CREATE
// ==========================================

function create() {

    crearFondo(this);

    crearPista(this);

    crearDecoracion(this);

    crearJugador(this);

    crearControles(this);

    crearTilcayos(this);

    crearObstaculos(this);

    crearHUD(this);
}


// ==========================================
// FONDO
// ==========================================

function crearFondo(scene) {

    scene.add.rectangle(
        640,
        360,
        1280,
        720,
        0x8fcf78
    );

    scene.add.text(
        640,
        30,
        "🇧🇴 TILCAYO RACING",
        {
            fontSize: "36px",
            fontStyle: "bold",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6
        }
    ).setOrigin(0.5);

    scene.add.text(
        640,
        70,
        "EL VALLE",
        {
            fontSize: "18px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
        }
    ).setOrigin(0.5);
}


// ==========================================
// PISTA
// ==========================================

function crearPista(scene) {

    // Terreno
    scene.add.rectangle(
        640,
        380,
        1100,
        500,
        0x5a3d2e
    );

    // Pista
    scene.add.rectangle(
        640,
        380,
        900,
        350,
        0x666666
    );

    // Interior
    scene.add.rectangle(
        640,
        380,
        700,
        150,
        0x8fcf78
    );

    // Bordes

    scene.add.rectangle(
        640,
        205,
        900,
        6,
        0xffffff
    );

    scene.add.rectangle(
        640,
        555,
        900,
        6,
        0xffffff
    );

    // Línea de salida

    for (let x = 200; x < 1090; x += 40) {

        scene.add.rectangle(
            x,
            380,
            20,
            70,
            x % 80 === 0
                ? 0xffffff
                : 0x222222
        );
    }
}


// ==========================================
// DECORACIÓN
// ==========================================

function crearDecoracion(scene) {

    crearMontana(scene, 150, 150);
    crearMontana(scene, 1130, 150);

    crearArbol(scene, 120, 300);
    crearArbol(scene, 120, 500);

    crearArbol(scene, 1160, 300);
    crearArbol(scene, 1160, 500);
}


// ==========================================
// MONTAÑA
// ==========================================

function crearMontana(scene, x, y) {

    scene.add.triangle(
        x,
        y,
        0,
        200,
        150,
        0,
        300,
        200,
        0x52677a
    );
}


// ==========================================
// ÁRBOL
// ==========================================

function crearArbol(scene, x, y) {

    scene.add.rectangle(
        x,
        y + 20,
        14,
        45,
        0x704214
    );

    scene.add.circle(
        x,
        y,
        30,
        0x287a3d
    );
}


// ==========================================
// JUGADOR
// ==========================================

function crearJugador(scene) {

    player = scene.add.rectangle(
        640,
        480,
        42,
        65,
        0xd6668c
    );

    scene.physics.add.existing(player);

    player.body.setSize(42, 65);

    player.setDepth(10);
}


// ==========================================
// CONTROLES
// ==========================================

function crearControles(scene) {

    cursors = scene.input.keyboard.createCursorKeys();

    keys = scene.input.keyboard.addKeys({

        W: Phaser.Input.Keyboard.KeyCodes.W,

        A: Phaser.Input.Keyboard.KeyCodes.A,

        S: Phaser.Input.Keyboard.KeyCodes.S,

        D: Phaser.Input.Keyboard.KeyCodes.D

    });
}


// ==========================================
// TILCAYOS
// ==========================================

function crearTilcayos(scene) {

    tilcayos = scene.physics.add.staticGroup();

    const posiciones = [

        [500, 480],

        [550, 300],

        [750, 300],

        [850, 480],

        [400, 300],

        [950, 480]

    ];

    posiciones.forEach(([x, y]) => {

        const tilcayo = scene.add.circle(
            x,
            y,
            14,
            0xf7dce6
        );

        tilcayo.setStrokeStyle(
            4,
            0xd6668c
        );

        scene.physics.add.existing(
            tilcayo,
            true
        );

        tilcayos.add(tilcayo);

        scene.tweens.add({

            targets: tilcayo,

            scale: 1.3,

            duration: 500,

            yoyo: true,

            repeat: -1

        });

        scene.physics.add.overlap(
            player,
            tilcayo,
            recogerTilcayo,
            null,
            scene
        );
    });
}


// ==========================================
// RECOGER TILCAYO
// ==========================================

function recogerTilcayo(playerObject, tilcayo) {

    tilcayo.destroy();

    tilcayoCount++;

    tilcayoText.setText(
        `🪀 TILCAYOS: ${tilcayoCount}`
    );
}


// ==========================================
// OBSTÁCULOS
// ==========================================

function crearObstaculos(scene) {

    obstacles = scene.physics.add.staticGroup();

    crearObstaculo(
        scene,
        350,
        480
    );

    crearObstaculo(
        scene,
        930,
        300
    );

    crearObstaculo(
        scene,
        450,
        300
    );
}


// ==========================================
// OBSTÁCULO
// ==========================================

function crearObstaculo(scene, x, y) {

    const obstaculo = scene.add.rectangle(
        x,
        y,
        45,
        45,
        0x704214
    );

    scene.physics.add.existing(
        obstaculo,
        true
    );

    obstacles.add(obstaculo);

    scene.physics.add.collider(
        player,
        obstaculo,
        golpearObstaculo,
        null,
        scene
    );
}


// ==========================================
// COLISIÓN
// ==========================================

function golpearObstaculo() {

    speed *= 0.3;

    this.cameras.main.shake(
        100,
        0.005
    );
}


// ==========================================
// HUD
// ==========================================

function crearHUD(scene) {

    scene.add.rectangle(
        150,
        110,
        270,
        120,
        0x000000,
        0.65
    );

    lapText = scene.add.text(
        35,
        70,
        "VUELTA: 1/3",
        {
            fontSize: "20px",
            color: "#ffffff"
        }
    );

    tilcayoText = scene.add.text(
        35,
        105,
        "🪀 TILCAYOS: 0",
        {
            fontSize: "20px",
            color: "#ffffff"
        }
    );

    speedText = scene.add.text(
        35,
        140,
        "VELOCIDAD: 0",
        {
            fontSize: "20px",
            color: "#ffffff"
        }
    );

    scene.add.text(
        640,
        690,
        "WASD / FLECHAS",
        {
            fontSize: "18px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
        }
    ).setOrigin(0.5);
}


// ==========================================
// UPDATE
// ==========================================

function update() {

    moverJugador(this);

    speedText.setText(
        `VELOCIDAD: ${Math.round(Math.abs(speed))}`
    );

    comprobarVuelta();
}


// ==========================================
// MOVIMIENTO
// ==========================================

function moverJugador(scene) {

    const delta =
        scene.game.loop.delta / 1000;

    const acelerar =
        cursors.up.isDown ||
        keys.W.isDown;

    const frenar =
        cursors.down.isDown ||
        keys.S.isDown;

    const izquierda =
        cursors.left.isDown ||
        keys.A.isDown;

    const derecha =
        cursors.right.isDown ||
        keys.D.isDown;


    // Acelerar

    if (acelerar) {

        speed +=
            ACCELERATION * delta;

        speed = Math.min(
            speed,
            MAX_SPEED
        );
    }


    // Frenar

    else if (frenar) {

        speed -=
            ACCELERATION * delta;

        speed = Math.max(
            speed,
            -80
        );
    }


    // Fricción

    else {

        if (speed > 0) {

            speed -=
                FRICTION * delta;

            speed = Math.max(
                speed,
                0
            );
        }

        if (speed < 0) {

            speed +=
                FRICTION * delta;

            speed = Math.min(
                speed,
                0
            );
        }
    }


    // Movimiento

    player.y -=
        speed * delta;


    // Giro

    if (speed !== 0) {

        if (izquierda) {

            player.x -=
                TURN_SPEED *
                Math.abs(speed) *
                delta;
        }

        if (derecha) {

            player.x +=
                TURN_SPEED *
                Math.abs(speed) *
                delta;
        }
    }


    // Límites

    player.x = Phaser.Math.Clamp(
        player.x,
        180,
        1100
    );

    player.y = Phaser.Math.Clamp(
        player.y,
        180,
        580
    );


    // Inclinación visual

    if (izquierda) {

        player.rotation = -0.15;

    } else if (derecha) {

        player.rotation = 0.15;

    } else {

        player.rotation = 0;
    }
}


// ==========================================
// VUELTAS
// ==========================================

function comprobarVuelta() {

    if (player.y <= 210) {

        lap++;

        if (lap > TOTAL_LAPS) {

            terminarCarrera();

            return;
        }

        player.y = 540;

        lapText.setText(
            `VUELTA: ${lap}/${TOTAL_LAPS}`
        );
    }
}


// ==========================================
// FINAL
// ==========================================

function terminarCarrera() {

    speed = 0;

    player.body.setVelocity(
        0,
        0
    );

    const overlay =
        document.createElement("div");

    overlay.id =
        "resultado";

    overlay.innerHTML = `

        <div class="resultado-box">

            <h1>🏁 ¡CARRERA TERMINADA!</h1>

            <h2>🇧🇴 TILCAYO RACING</h2>

            <p>
                🪀 Tilcayos encontrados:
                <strong>${tilcayoCount}</strong>
            </p>

            <button
                onclick="location.reload()"
            >
                REPETIR CARRERA
            </button>

        </div>

    `;

    document.body.appendChild(
        overlay
    );
}