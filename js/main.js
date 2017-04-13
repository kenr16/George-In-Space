function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.animations.add('stop', [0]);
    this.animations.add('run', [1, 2], 8, true); // 8fps looped
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.move = function (direction) {
    const SPEED = 5;
    this.x += direction * SPEED;
    if (this.x < 0) {
       this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
       this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    const JUMP_SPEED = 600;  // How high you jump
    let canJump = this.body.touching.down;
    if (canJump) {
        this.body.velocity.y = -JUMP_SPEED;
    }

    return canJump;
};
Hero.prototype.bounce = function () {
    const BOUNCE_SPEED = 400;
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // jumping
    if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype.wound = function () {
    // update sprite to tint it red
    this.tint = 0xff00ff;
    //this.bounce();
    this.body.velocity.y = -500;
    this.body.velocity.x = (this.body.touching.right) ? -500: 500;

    this.animations.play('fall');
    //this.alpha = 0;
};

// function bitTwiddler = function(bit) {
//   bit.twiddled = true;
// }
//
// function testBitTwiddler = function() {
//   let expectedResult = true;
//   let bit = {};
//   bit.twiddled = false;
//   let actualResult = bitTwiddler(bit).twiddled;
//   assertEquals(expectedResult, actualResult);
// }
//
// function assert(boolean) {
//   if (!boolean) {
//     throw new AssertError('bad assertion');
//   }
// }
//
// function assertEquals(arg1, arg2) {
//   if (arg1 !== arg2) {
//     throw new AssertError('arguments are not equal');
//   }
// }

PlayState = {};
// load game assets here
const LEVEL_COUNT = 5;

PlayState.init = function (data) {
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP // add this line
    });
    this.game.renderer.renderSession.roundPixels = true;
    this.keys.up.onDown.add(function () {
        let didJump = this.hero.jump();
        if (didJump) {
            this.sfx.jump.play();
        }
    }, this);
    this.coinPickupCount = data.score||0;
    this.lives = data.lives || 3; //Allows the player a counter with three lives.
    this.hasKey = false;
    this.level = (data.level || 0) % LEVEL_COUNT;
};




PlayState.preload = function () {
    this.game.load.json('level:0', 'data/level00.json');
    this.game.load.json('level:1', 'data/level01.json');
    this.game.load.json('level:2', 'data/level02.json');
    this.game.load.json('level:3', 'data/level03.json');
    this.game.load.json('level:4', 'data/level04.json');
    this.game.load.spritesheet('hero', 'images/hero.png', 32, 32);
    this.game.load.image('background', 'images/background.png');
    this.game.load.image('ground', 'images/ground.png');
    this.game.load.image('grass:8x1', 'images/grass_8x1.png');
    this.game.load.image('grass:6x1', 'images/grass_6x1.png');
    this.game.load.image('grass:4x1', 'images/grass_4x1.png');
    this.game.load.image('grass:2x1', 'images/grass_2x1.png');
    this.game.load.image('grass:1x1', 'images/grass_1x1.png');
    this.game.load.audio('sfx:jump', 'audio/jump.wav');
    this.game.load.audio('sfx:coin', 'audio/coin.wav');
    this.game.load.spritesheet('coin', 'images/coin_animated.png', 32, 32);
    this.game.load.spritesheet('spider', 'images/spider.png', 32, 32);
    this.game.load.spritesheet('spikey', 'images/spikey.png', 32, 32);
    this.game.load.image('invisible-wall', 'images/invisible_wall.png');
    this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.game.load.image('icon:coin', 'images/coin_icon.png');
    this.game.load.image('font:numbers', 'images/numbers.png');
    this.game.load.spritesheet('door', 'images/door.png', 64, 64);
    this.game.load.image('key', 'images/key.png');
    this.game.load.image('icon:lifeIcon', 'images/lifecounter.png');
    this.game.load.audio('sfx:key', 'audio/key.wav');
    this.game.load.audio('sfx:door', 'audio/door.wav');
    this.game.load.audio('sfx:death', 'audio/death.mp3');
    this.game.load.spritesheet('icon:key', 'images/key_icon.png', 32, 32);
    this.game.load.tilemap('levelKai', 'data/test.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('lava', '/images/lava.png');
    this.game.load.image('platform', '/images/platform.png');
};

// create game entities and set up world here
PlayState.create = function () {
    // create sound entities
    this.sfx = {
        jump: this.game.add.audio('sfx:jump'),
        coin: this.game.add.audio('sfx:coin'),
        stomp: this.game.add.audio('sfx:stomp'),
        key: this.game.add.audio('sfx:key'),
        door: this.game.add.audio('sfx:door'),
    };
    this.game.add.image(0, 0, 'background');
    if (true) {
      this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    } else {
      this.map = this.game.add.tilemap('levelKai');
      this.map.addTilesetImage('lava', 'lava');
      this.map.addTilesetImage('door', 'door');
      this.map.addTilesetImage('door', 'door');
      this.map.addTilesetImage('key', 'key');
      this.map.addTilesetImage('coin', 'coin');
      this.map.addTilesetImage('spider', 'spider');
      this.map.addTilesetImage('hero', 'hero');
      this.map.addTilesetImage('platform', 'platform');
      this.layers = [];
      ['platforms', 'coins', 'spiders', 'spikes', 'door', 'hero', 'key'].forEach(function(elem) {
        this.layers.push(this.map.createLayer(elem));
      }, this
      );
      this.layers[0].resizeWorld();
  }
    this.game.world.setBounds(0,0, 960, 1300);
    //this._loadRandomPlatforms();
    this._createHud();
    this.game.camera.follow(this.hero);
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    if (data.hasOwnProperty('spikes')) {
      this.spikes = this.game.add.group();
      data.spikes.forEach(this._spawnSpikes, this);
    }
    // this.enemyWalls.visible = false;
    this.enemyWalls.alpha = 0.1;  //sets the transparency
    // spawn all platforms
    data.platforms.forEach(this._spawnPlatform, this);
    //...
    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});
    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
    this._spawnDoor(data.door.x, data.door.y);
    this._spawnKey(data.key.x, data.key.y);
    // enable gravity
    const GRAVITY = 1000;
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._loadRandomPlatforms = function() {
  const PLAYER_HEIGHT = 32;

  const JUMP_DISTANCE = 200;

  //

  var drawBars = function(startX, startY, endX, endY, playstate) {
  playstate.platforms = playstate.game.add.group();
  let blocksizes = [1 * PLAYER_HEIGHT, 2 * PLAYER_HEIGHT, 4 * PLAYER_HEIGHT, 8 * PLAYER_HEIGHT];
  // go bottom to top
  // place bar across bottom of worldlet
  // place bars above to top
  let originY = endY;
  let originX = startX;
  while (originY > startY) {
    while (originX < endX - PLAYER_HEIGHT) {
      //grab a random sized block, see if it fits in the line
      //if not, try a smaller one
      let randomSize = blocksizes[Math.floor(Math.random() * blocksizes.length)];
      if (originX + randomSize > endX) {
        randomSize = blocksizes[Math.floor(Math.random() * blocksizes.indexOf(randomSize))];
      }
      playstate.platforms.add(generatePlatform(0, originY, randomSize, playstate));
      originX += randomSize;
    }
    originY -= PLAYER_HEIGHT * 2;
  }
  // knock out segments as long as doing so will not create an inaccessible area

  //return game;
  }

  var generatePlatform = function(x, y, width, state) {
    let sprite = state.platforms.create(x, y, 'grass:1x1');
    //sprite.width = width;
    //sprite.tint = 0xff00ff;
    state.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    return sprite;
  }

  // function drawStars(game, startX, startY, endX, endY) {
  //
  //
  //
  // return game;
  // }

  var checkCorners = function(obj, existing, game) {
    let result = false;
    ['top', 'bottom'].forEach(function(v) {
      ['left', 'right'].forEach(function(s) {
        if (this.getNearestObject(obj[v], obj[s], existing) < JUMP_DISTANCE) {
          result = true;
        }
      })
    });
    return result;
  }

  var getNearestObject = function(x, y, existing) {
    let closest = existing.reduce(function(acc, curr) {
      let distance = this.game.arcade.distanceToXY(curr, x, y);
      if (distance < acc) acc = distance;
    });
    return closest;
  }
  drawBars(0,0,this.stage.height,this.stage.width, this);
}

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
        NUMBERS_STR, 6);
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
        coinIcon.height / 2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5);

    this.lifeFont = this.game.add.retroFont('font:numbers', 20, 26,
    NUMBERS_STR, 6);
    this.lifeIcon = this.game.make.image(0, 19, 'icon:lifeIcon');  //Change this to a heart icon or something later on.
    //this.lifeIcon.anchor.set(0, 0.5);
    let lifeIcon = this.game.make.image(this.lifeIcon.width + 125, 0, 'icon:lifeIcon');
    let lifeScoreImg = this.game.make.image(lifeIcon.x + lifeIcon.width,
      lifeIcon.height / 2, this.lifeFont);
      lifeScoreImg.anchor.set(0, 0.5);

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(coinScoreImg);
    this.hud.add(lifeIcon);
    this.hud.add(lifeScoreImg);
    this.hud.add(this.keyIcon);
    //this.hud.position.set(10, 750);

    this.hud.fixedToCamera = true;
    this.hud.cameraOffset.setTo(10, 10);
};


PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(platform.x, platform.y, platform.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;  //Makes the platform unmovable.
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};
PlayState._spawnSpikes = function (spike) {
    let sprite = this.spikes.create(spike.x, spike.y, spike.image);
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;  //Makes the spike unmovable.
    this._spawnEnemyWall(spike.x, spike.y, 'left');
    this._spawnEnemyWall(spike.x + sprite.width, spike.y, 'right');
};
PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(((side === 'left') ? 1 : 0), 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);
    sprite.animations.add('rotate', [0, 1, 2, 3], 2, true); // 6fps, looped
    sprite.animations.play('rotate');
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
};

PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
       let sprite = new Spider(this.game, spider.x, spider.y);
       this.spiders.add(sprite);
    }, this);
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.hero.checkWorldBounds = true;
    this.hero.events.onOutOfBounds.add(function(hero) {
      this.lives--;
      this.game.state.restart(true, false, {level: this.level, lives: this.lives, score:this.score});
    }, this);
    this.hero.body.friction.x = .5;
    this.game.add.existing(this.hero);
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;
    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();
    this.coinFont.text = `x${this.coinPickupCount}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
    this.lifeFont.text = `x${this.lives}`;
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.hero, this.platforms, this._onHeroVsplatforms,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
        if(this.hasOwnProperty('spikes')) {
          this.game.physics.arcade.collide(this.hero, this.spikes, this._onHeroVsSpikes, null, this);
          this.game.physics.arcade.collide(this.spiders, this.spikes, this._onMobileVsSpikes, null, this);
        }
};

PlayState._onHeroVsCoin = function (hero, coin) {
    this.sfx.coin.play();
    coin.kill();
    this.coinPickupCount++;
    if (this.coinPickupCount === 100) {
      this.coinPickupCount = 0;
      this.lives++;
    }
};

PlayState._onHeroVsplatforms = function (hero) {
    hero.tint = 0xffffff;
    hero.alpha = 1;
};
var highscores = [];
PlayState._onHeroVsEnemy = function (hero, enemy) {
    if (hero.body.velocity.y > 0) { // kill enemies when hero is falling
        hero.bounce();
        enemy.die();
        this.sfx.stomp.play();
    }
    else { // game over -> restart the game
        this.sfx.stomp.play();
        hero.wound();
        game.add.tween(hero).to({alpha:0}, 200, Phaser.Easing.Linear.None, true, 0, 5, true);
        this.lives--;
        if (this.lives === -1) {

          $("#insertTextHere").text(this.coinPickupCount);
          $(".end-screen").fadeIn(1000);
          $(".dropping-text").animate({top: '600px'}, 650);
          let initials = prompt('enter your initials');
          highscores.push({initials: initials, score:this.coinPickupCount});
          setTimeout(startNewGame, 5000);
          setTimeout(function(){$(".end-screen").hide()}, 5000);
        }
    }
};

PlayState._onHeroVsKey = function (hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};

PlayState._onHeroVsDoor = function (hero, door) {
    this.sfx.door.play();
    this.game.state.restart(true, false, { level: this.level + 1, score: this.coinPickupCount, lives:this.lives });
};

PlayState._onMobileVsSpikes = function (mobile, spikes) {
  this.sfx.stomp.play();
  mobile.kill();
}

PlayState._onHeroVsSpikes = function (hero, spikes) {
  this.sfx.stomp.play();
  hero.bounce();
  hero.body.checkCollision.none = true;
  hero.body.collideWorldBounds = false;
}

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    this.keys.up.onDown.add(function () {
        this.hero.jump();
    }, this);

};


function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5, 0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 20, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

Spider.SPEED = 200;

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    let speed = Spider.SPEED + (PlayState.level * 10);
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -speed ;//- (this.level * 10); // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = speed;// + (this.level * 10); // turn right
    }
    if (this.body.velocity.x < 0) {
       this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
       this.scale.x = 1;
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}
