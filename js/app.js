function randomIntFromInterval(min,max){
  return Math.floor(Math.random()* max -min) + min;
}

function seededRandomIntFromInterval(seed,min,max){

    var rnd = (Math.random()+Math.sin(seed++)) * 10000 * 0.5;
    return Math.floor((rnd - Math.floor(rnd))* max -min) + min;

}
// Enemies our player must avoid
var Enemy = function(seed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    var initPos = [ [-101,60],[-101,142],[-101,229],[-202,60],[-202,142],[-202,229],[-303,60],[-303,142],[-303,229],[-404,60],[-404,142],[-404,229],];
    //var test = seededRandomIntFromInterval(seed,1,9);

    var test = seededRandomIntFromInterval(seed,0,11);
    this.x = initPos[test][0];
    this.y = initPos[test][1];
    this.speed;
    //console.log(seed,"x", this.x);

}
  // initial y pos
    //var yrange= [60,142,229]; /* each tile is 88px, start at half pos then increment by 88 */
    //ar yindex = Math.floor(Math.random()* max -min) + min;
    //this.y = yrand[yindex];
/*
Enemy.prototype.reset = function(seed){
    var initPos = [ [-101,60],[-101,142],[-101,229],[-202,60],[-202,142],[-202,229],[-303,60],[-303,142],[-303,229],[-404,60],[-404,142],[-404,229],];
    //var test = seededRandomIntFromInterval(seed,1,9);
    var test = seededRandomIntFromInterval(seed,0,11);
    this.x = initPos[test][0];
    this.y = initPos[test][1];
}
*/

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (dt * 50 );
	  if(this.x > 505) {
		       this.x = -101;
	  }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/char-princess-girl.png';
    this.x = 202;
    this.y= 405;
}

Player.prototype.update = function(){
    //check for collisions

    if(this.collide() === true){
      console.log("collide!");
        player.reset();

    }

    //check for edge conditions
    if (this.x <0) {
        this.x = 0;
    }
    if (this.x > 400) {
        this.x = 400;
    }
    if (this.y < -50) {
        this.y = -50;
    }
    if (this.y < -8) {
        player.reset();
    }
    if (this.y > 435) {
        this.y =435;
    }
};

Player.prototype.collide = function() {
    //console.log("length again",allEnemies.length);
    var len = allEnemies.length;
    for (var i = 0; i < len; i++) {
        //console.log(i," " ,allEnemies[i].x);
        if (this.x < allEnemies[i].x + 50 && this.x + 50 > allEnemies[i].x && this.y < allEnemies[i].y + 30 && this.y + 30 > allEnemies[i].y){
          console.log("Collision is true");
          return true;
          break;
        }
    }
}


Player.prototype.render = function() {
    //console.log(this.y);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode){
  //each keystroke is 1/4 of block for more control
  switch(keyCode) {
    case 'left':
        this.x = this.x - 25;
        break;
    case 'right':
        this.x = this.x + 25;
        break;
    case 'up':
        this.y = this.y - 21;
        break;
    case 'down':
        this.y = this.y + 21;
        break;
    default:
        break;
  }
};

Player.prototype.reset = function() {
        this.x = 202;
        this.y = 405;

};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();

var enemyCount = 9;
var allEnemies = [];
for (var i = 1; i < enemyCount; i++) {
  //console.log(i,"create");
  allEnemies.push(new Enemy(i));
}
console.log("length", allEnemies.length);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
