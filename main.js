var main = {
  preload: function() {
    // This function will be executed at the beginning     
    // That's where we load the game's assets

    game.load.image('paddle', 'assets/paddle.png');
    game.load.image('brick', 'assets/brick.png');
    game.load.image('ball', 'assets/ball.png');
  },

  create: function() { 
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc. 

    /**************************************
                  Paddle
    ***************************************/
    // Initialize the physics system of the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create a variable to handle the arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();

    // Create the paddle at the bottom of the screen
    this.paddle = game.add.sprite(200, 400, 'paddle');

    // Enable the physics system for the paddle
    game.physics.arcade.enable(this.paddle);

    this.paddle.body.immovable = true;

    /**************************************
                  Bricks
    ***************************************/
    this.bricks = game.add.group();
    this.bricks.enableBody = true;

    // Create the 16 bricks
    for (var i = 0; i < 5; i++)
      for (var j = 0; j < 5; j++)
        game.add.sprite(50+i*60, 55+j*35, 'brick', 0, this.bricks);

    // Make sure that the bricks won't move
    this.bricks.setAll('body.immovable', true);


    /**************************************
                  Ball
    ***************************************/
    // Create the ball with physics
    this.ball = game.add.sprite(200, 300, 'ball');
    game.physics.arcade.enable(this.ball);

    // Add velocity to the ball
    this.ball.body.velocity.x = 200; 
    this.ball.body.velocity.y = 200;

    // Make the ball bouncy 
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
  },

  update: function() {
    // This function is called 60 times per second    
    // It contains the game's logic


    /**************************************
                  Move Paddle
    ***************************************/
    // If the right arrow is pressed, move the paddle to the right
    if (this.cursor.right.isDown) 
      this.paddle.body.velocity.x = 350;

    // If the left arrow if pressed, move left
    else if (this.cursor.left.isDown) 
      this.paddle.body.velocity.x = -350;

    // If no arrow is pressed, stop moving
    else 
      this.paddle.body.velocity.x = 0;


    if (game.input.activePointer.isDown) {
      if (this.smoothMouseInput) {
        this.paddle.targetXPosition = game.input.activePointer.x - 50;
        this.paddle.body.velocity.x = (this.paddle.targetXPosition - this.paddle.x) / 0.1;
      } else {
        this.paddle.x = game.input.activePointer.x - 50;
      }
    }

    /**************************************
                Collision detection
    ***************************************/
    // Make the paddle and the ball collide
    game.physics.arcade.collide(this.paddle, this.ball);

    // Call the 'hit' function when the ball hit a brick
    game.physics.arcade.collide(this.ball, this.bricks, this.hit, null, this);
  },

  hit: function(ball, brick) {
    // When the ball hits a brick, kill the brick
    brick.kill();
  }
};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(400, 480, Phaser.AUTO, 'gameDiv');

game.state.add('main', main);
game.state.start('main');