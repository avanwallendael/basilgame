// Create a new Phaser game instance
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var logsGroup; 
var energyBarPercentage = 100; // Initial energy value (e.g., 100%)
var napstopper = 100
var score = 0;
var scoreText;
var rewardText;
var instrucText1;
var instrucText2;
var instrucText3;
var instrucText4;
var instrucText5;



// Preload assets
function preload() {
    this.load.image('background', 'assets/background_basil_big.png');
    this.load.image('BA', 'assets/BA.png');
    this.load.image('ground',     'assets/foreground_basil_big.png');
    this.load.image('log_bg',     'assets/driftwood1.png');
    this.load.image('log',     'assets/minilog.png');
    this.load.image('bed1',     'assets/bed2.png');
    this.load.image('fish',     'assets/fish.png');
    this.load.image('jelly',     'assets/jelly.png');
    this.load.image('tooth',     'assets/tooth.png');
    this.load.image('bed4',     'assets/bed4.png');
    this.load.image('kibble',     'assets/kibble.png');
    this.load.spritesheet('dog',  'assets/basilturn.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('dog-jump', 'assets/dogjump4.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('dog-nap', 'assets/dognap2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('dog-zoom', 'assets/zoom.png', { frameWidth: 32, frameHeight: 32 });
    this.load.audio('bgMusic', 'assets/13 Good Vibrations.mp3');
    //this.load.audio('bgMusic', 'assets/basil1.mp3');
    this.load.audio('bork', 'assets/basil1.mp3');
    this.load.audio('grembel', 'assets/grembel.mp3');
}

function updateEnergyBar(percentage) {
//energyBar.clear();

    // Draw the energy bar background (red)
    energyBar.fillStyle(0xff0000);
    energyBar.fillRect(10, 10, 150, 20);

    // Calculate the width of the green bar based on percentage
    var greenWidth = (150 * percentage) / 100;

    // Draw the energy bar fill (green)
    energyBar.fillStyle(0x00ff00);
    energyBar.fillRect(10, 10, greenWidth, 20);
}

// Create the game environment
function create() {
    this.add.image(3304, 65.5, 'background');

    // Create the ground
    var ground = this.physics.add.staticGroup();
    ground.create(3304, 365.5, 'ground').setScale(1).refreshBody();
    
    logsGroup1 = this.physics.add.staticGroup();
	logsGroup1.create(300, 450, 'log_bg'); // Example log creation, adjust position
	
	logsGroup = this.physics.add.staticGroup();
	logsGroup.create(282, 595, 'log'); // Example log creation, adjust position
	
	BA = this.physics.add.staticGroup();
	BA.create(6300, 300, 'BA'); // Example log creation, adjust position
	
	jelly = this.physics.add.staticGroup();
	jelly.create(2500, 200, 'jelly'); // Example log creation, adjust position
	
	fish = this.physics.add.staticGroup();
	fish.create(4500, 150, 'fish'); // Example log creation, adjust position
	
	tooth = this.physics.add.staticGroup();
	tooth.create(5800, 200, 'tooth'); // Example log creation, adjust position
	
	bigbed_bg = this.physics.add.staticGroup();
	bigbed_bg.create(2000, 395, 'bed4'); // Example log creation, adjust position
	
	bigbed = this.physics.add.staticGroup();
	bigbed.create(2000, 390, 'bed4'); // Example log creation, adjust position
	
	bigbed1 = this.physics.add.staticGroup();
	bigbed1.create(6000, 390, 'bed4'); // Example log creation, adjust position
	
	bigbed_bg1 = this.physics.add.staticGroup();
	bigbed_bg1.create(6000, 395, 'bed4'); // Example log creation, adjust position
	
	var music = this.sound.add('bgMusic');
    music.play({ loop: true });
    music.setVolume(0.5);

	kibble = this.physics.add.staticGroup();

    // Define the area boundaries
    var minX = 100;
    var maxX = 6500;
    var minY = 200;
    var maxY = 600;

    // Number of items to spawn
    var numItems = 20;

    // Spawn items randomly
    for (var i = 0; i < numItems; i++) {
        var randomX = Phaser.Math.Between(minX, maxX);
        var randomY = Phaser.Math.Between(minY, maxY);

        // Create an item sprite and add it to the group
        var item = kibble.create(randomX, randomY, 'kibble');
        kibble.add(item);
    }
	
	minorbed = this.physics.add.staticGroup({
	key: 'bed1',
	repeat: 3,
	setXY: { x: 1000, y: 590, stepX: 2000}
	});
	
	scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
	
	rewardText = this.add.text(16, 100, '', { fontSize: '64px', color: '#75f542', fontFamily: 'Impact' });
	punishText = this.add.text(16, 100, '', { fontSize: '64px', color: '#fc0303', fontFamily: 'Impact' });
	
	instrucText1 = this.add.text(10, 130, 'FIND THE PACK', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });
	instrucText2 = this.add.text(10, 150, 'Arrow keys to move', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });
	instrucText3 = this.add.text(10, 170, 'Space to jump', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });
	instrucText4 = this.add.text(10, 190, 'Down + Right to zoom', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });
	instrucText5 = this.add.text(10, 210, 'Down to nap on bed', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });
	instrucText6 = this.add.text(10, 230, 'Collect kibbles', { fontSize: '15px', color: '#0a114d', fontFamily: 'Helvetica' });

    // Create the player dog
    this.player = this.physics.add.sprite(100, 450, 'dog');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Create dog animations
   // this.anims.create({
   // 	key: 'jump',
   //	 	frames: this.anims.generateFrameNumbers('dog-jump', { start: 0, end: 1 }),
   // 	frameRate: 10,
   // 	repeat: -1 
	//});

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dog', { start: 0, end: 1 }),
        frameRate: 10,
    	repeat: -1
    });
    
    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('dog-jump', { start: 1, end: 2 }),
        frameRate: 10,
    	repeat: 1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dog', frame: 2 } ],
        frameRate: 1
    });

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dog', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });
	
	this.anims.create({
        key: 'nap',
        frames: this.anims.generateFrameNumbers('dog-nap', { start: 0, end: 2 }), // Replace '5' and '6' with the frame range for 'nap'
        frameRate: 1,
        repeat: -1, 
    });
    
    this.anims.create({
        key: 'sleep',
        frames: this.anims.generateFrameNumbers('dog-nap', { start: 4, end: 5 }), // Replace '5' and '6' with the frame range for 'nap'
        frameRate: 1,
        repeat: -1, 
    });
    
        this.anims.create({
        key: 'zoom',
        frames: this.anims.generateFrameNumbers('dog-zoom', { start: 4, end: 7 }), // Replace '5' and '6' with the frame range for 'nap'
        frameRate: 20,
        repeat: -1, 
    });
	
	// Create energy bar
    energyBar = this.add.graphics();
    updateEnergyBar(100); // Initial energy value (e.g., 100%)


    // Set up collisions
    //this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, logsGroup);
    //this.physics.add.collider(this.player, minorbed);
    this.physics.add.collider(this.player, bigbed_bg);
    this.physics.add.collider(this.player, bigbed_bg1);
	//this.physics.add.collider(kibble, ground);    
	
    this.physics.add.overlap(this.player, kibble, collectKibble, null, this);
    this.physics.add.overlap(this.player, minorbed, collectEnergyOnBed, null, this);
    this.physics.add.overlap(this.player, bigbed, collectEnergyOnBigbed, null, this);
    this.physics.add.overlap(this.player, bigbed1, collectEnergyOnBigbed, null, this);
    this.physics.add.overlap(this.player, BA, collectReward, null, this);
    this.physics.add.overlap(this.player, fish, collectPunish, null, this);
    this.physics.add.overlap(this.player, tooth, collectTooth, null, this);
    this.physics.add.overlap(this.player, jelly, collectPunish, null, this);
    // Set up camera to follow the player
    this.cameras.main.setBounds(0, 0, 6608, 600); // Set camera bounds to match game width and height
    this.physics.world.setBounds(0, 0, 6608, 600); // Set world bounds
    this.cameras.main.startFollow(this.player, true, 0.8, 0.8, 0, 0);

    // Cursor input
    this.cursors = this.input.keyboard.createCursorKeys();
    
}

function collectKibble (player, kibble){
    kibble.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    var collectSound = this.sound.add('bork');
    collectSound.play();
}

function collectTooth (player, tooth){
    tooth.disableBody(true, true);
    score += 100;
    scoreText.setText('Score: ' + score);
    var collectSound = this.sound.add('bork');
    collectSound.play();
}

function collectReward (player, BA){
 	punishText.setText('');
    rewardText.setText("You Found Them!");
    //var collectSound = this.sound.add('bork');
    //collectSound.play();
}

function collectPunish (player, fish){
    punishText.setText("BAD DOG!");
    fish.disableBody(true, true);
    energyBarPercentage = Math.max(0, energyBarPercentage - 40)
    var collectSound = this.sound.add('grembel');
    collectSound.play();
}

function collectPunish2 (player, jelly){
    punishText.setText("BAD DOG!");
    fish.disableBody(true, true);
    energyBarPercentage = Math.max(0, energyBarPercentage - 20)
    var collectSound = this.sound.add('grembel');
    collectSound.play();
}

function collectEnergyOnBed(player, bed) {
	if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'nap' && energyBarPercentage < 100) {
        energyBarPercentage = Math.min(100, energyBarPercentage + 1); // Restore 0.5% energy per second
        updateEnergyBar(energyBarPercentage);
        napstopper = Math.min(100, energyBarPercentage + 1);
        var bedSound1 = this.sound.add('grembel');
    bedSound1.play();
    }
}

function collectEnergyOnBigbed(player, bigbed) {
	if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'nap' && energyBarPercentage < 100) {
        energyBarPercentage = Math.min(100, energyBarPercentage + 3); // Restore 0.5% energy per second
        updateEnergyBar(energyBarPercentage);
        napstopper = Math.min(100, energyBarPercentage + 3);
        var bedSound2 = this.sound.add('grembel');
    bedSound2.play();
    }
}

    

// Update function for game logic
function update() {

    if (this.cursors.left.isDown && this.player.anims.currentAnim !== 'nap' && energyBarPercentage > 0 && napstopper === 100) {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
        energyBarPercentage -= .1; // Decrease energy as the dog moves
    } else if (this.cursors.right.isDown && !this.cursors.down.isDown && this.player.anims.currentAnim !== 'nap' && energyBarPercentage > 0 && napstopper === 100) {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
        energyBarPercentage -= .1; // Decrease energy as the dog moves
    } else if (this.cursors.right.isDown && this.cursors.down.isDown && energyBarPercentage > 0 && napstopper === 100) {
        this.player.setVelocityX(320);
        this.player.anims.play('zoom', true);
        energyBarPercentage -= .3; // Decrease energy as the dog moves
    } else if (this.cursors.down.isDown) {
     	this.player.setVelocityX(0);
    	this.player.anims.play('nap');
    } else if (this.player.anims.currentAnim !== 'nap' && energyBarPercentage > 0 && napstopper === 100){
        this.player.setVelocityX(0);
        this.player.anims.play('right');
    } else {
     	this.player.setVelocityX(0);
    	this.player.anims.play('sleep');
    }
    
    if (this.cursors.up.isDown) {
    	this.player.setVelocityY(-50); // Apply upward force for the jump
    	this.player.anims.play('right', true);
        }
        
   //if (this.cursors.right.isDown && this.cursors.down.isDown && this.player.anims.currentAnim !== 'nap' && energyBarPercentage > 0 && napstopper === 100) {
   //     this.player.setVelocityX(320);
   //     this.player.anims.play('zoom', true);
   //     energyBarPercentage -= .2; // Decrease energy as the dog moves
   //     }
    
    if (this.cursors.space.isDown && energyBarPercentage > 0  && napstopper === 100) {
    	this.player.setVelocityY(-400); // Apply upward force for the jump
    	this.player.anims.play('up', true); // Play the jump animation
        energyBarPercentage -= .1; // Decrease energy as the dog moves
        }
        
	if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'nap') {
        energyBarPercentage = Math.min(100, energyBarPercentage + .2); // Restore .5% energy per second
        updateEnergyBar(energyBarPercentage);
        napstopper = Math.min(100, energyBarPercentage + .1);
    }
    
    if (this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'sleep') {
        energyBarPercentage = Math.min(100, energyBarPercentage + .1); // Restore .5% energy per second
        updateEnergyBar(energyBarPercentage);
        napstopper = Math.min(100, energyBarPercentage + .1);
    }
   

	energyBarPercentage = Math.max(0, energyBarPercentage);
	updateEnergyBar(energyBarPercentage);

	energyBar.x = this.player.x - 20; // Adjust the value as needed
	scoreText.x = this.player.x +300;
	punishText.x = this.player.x;
	rewardText.x = this.player.x - 100;

    

    
    //if ((this.player.x < minorbed.x + 30 && this.player.x > minorbed.x - 30 && this.player.y > minorbed.y) && this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'nap') {
    //    energyBarPercentage = Math.min(100, energyBarPercentage + .5); // Restore .5% energy per second
    //    updateEnergyBar(energyBarPercentage);
    //    napstopper = Math.min(100, energyBarPercentage + 1);
	//}
	//
	//if ((this.player.x < (bigbed.x + 75) && this.player.x > (bigbed.x - 75))) {
	//// && this.player.y > bigbed.y && this.player.anims.isPlaying && this.player.anims.currentAnim.key === 'nap'
    //	console.log('Nap animation is playing on top of the object.');
    //    energyBarPercentage = Math.min(100, energyBarPercentage + 3);
    //    updateEnergyBar(energyBarPercentage);
    //    napstopper = Math.min(100, energyBarPercentage + 1);
	//}
}
