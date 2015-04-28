/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        startTime,
        lastTime;


    canvas.width = 505;
    canvas.height = 646;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0,
            elapsedTime = (now - startTime)/1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */

        update(dt,elapsedTime);


        // Each game begins with a 2 second start screen
        // 60 secs of game play
        // 1 sec on the end scrreen
        // player states are: init, startscreen, inplay, collide, success, endscreen
        // startscreen, first 2 secs, player is at middle of screen
        // reset, 1 sec timeout, player is at bottom of the screen frozen
        // inplay, player is movable, tallying collides,
        // collide, player has been hit by a bug,freeze position for 1sec timeout, show "ouch", reset
        // success, player makes it to water, add point, freeze for 1 sec timeout, show balloon, reset
        // endscreen, 1secs no player, option to restart

console.log("main", player.state);
        if (elapsedTime < 1) {
            // first second on start screen
            player.startScreen();
            renderStartScreen();
        } else if (elapsedTime >= 1 && elapsedTime <= 2){
            // player is repositioned to start position at bottom of the screen
            player.preGame("inplay");
            renderStartScreen();
        } else if (elapsedTime > 2 && player.life >= 0) {
            // 60 secs of gameplay
            // render gameplay until the player's life runs out
            render();

        } else if (player.life < 0){
            // 1 sec endscreen after his life runs out
            renderEndScreen();
        }
        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    // Function for keeping track of elapsed time
    function elapsedTimeInSeconds(now) {
        timer = (now - startTime) / 1000;
        return (Math.round(duration - timer));
    }

    // Function for generating clockString
    function clockString(countdown){
        var minutes =  Math.floor(countdown / 60);
        var seconds = countdown - minutes*60;

        // inline function for resolving padding
        function pad(a,b){return(1e15+a+"").slice(-b)};

        minutes = pad(minutes,2);
        seconds = pad(seconds,2);
        return (minutes + ":" + seconds);

    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        //track when game started but not gameplay
        startTime = Date.now();
        reset();

        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt,elapsedTime) {
        updateEntities(dt,elapsedTime);
        checkCollisions();
    }

    function checkCollisions(){
        player.collide();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt,elapsedTime) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(dt,elapsedTime);
        player.dead();
        balloon.update(player.state, player.x, player.y);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {

        // flat background that changes color based on player state
        renderBackground();

        // show amount of life left in seconds
        var lifeString = clockString(Math.round(player.life));
        renderCountdown(lifeString);

        // render accumulated points
        renderPlayerPoints();

        // terrain assets from Udacity
        renderTerrain();

        // character assets
        renderEntities();
    }

    function renderStartScreen() {

        renderBackground();
        renderTerrain();

        ctx.font = "30px courier";
        ctx.textAlign = "center"
        ctx.fillStyle = "white";

        var introText1 = "Hello Princess!";

        ctx.fillText(introText1, canvas.width/2, 40);

        player.render();

        var introText2 = "How many times?";
        var introText3 = "Can you reach the pond?";
        var introText4 = "In 1 minute?";
        var introText5 = "Use the arrow keys to move!";

        ctx.fillStyle="#ff1493";

        ctx.fillText(introText2, canvas.width/2, 200);
        ctx.fillText(introText3, canvas.width/2, 280);
        ctx.fillText(introText4, canvas.width/2, 360);

        ctx.fillStyle = "white";
        ctx.fillText(introText5, canvas.width/2, 620);
    }

    function renderEndScreen() {

        renderBackground();
        renderTerrain();

        ctx.font = "30px courier";
        ctx.fillStyle="white";
        ctx.textAlign = "center"

        var introText1 = "Not Bad!";
        ctx.fillText(introText1, canvas.width/2, 40);
        var scoreText = player.points;
        if (player.points === 1) {
            scoreText = scoreText + " point!";
        } else if (player.points > 1) {
            scoreText = scoreText + " points!";
        }

        if (player.points > 0){
            ctx.fillText(scoreText,canvas.width/2, 100);
        }


        player.render();

        ctx.fillStyle="#ff1493";
        var introText2 = "WANT TO TRY AGAIN?";
        ctx.fillText(introText2, canvas.width/2, 200);

        ctx.font = "30px courier";
        ctx.fillStyle="white";

        var introText3 = "Reload the page";

        ctx.fillText(introText3, canvas.width/2, 620);
    }


    function renderBackground() {
        ctx.clearRect(-10,-10,515,626);
        console.log("player", player.state);
        switch (player.state) {
            case "init":
            case "startscreen":
            case "success":
                ctx.fillStyle = "#ff1493";
                break;
            case "collide":
                ctx.fillStyle= "red";
                break;
            case "inplay":
                ctx.fillStyle= "#32cd32";
                break;
            case "death":
                ctx.fillStyle= "blue";
                break;
            default:
                ctx.fillStyle="#333";
                break;

        }
        ctx.fillRect(0,0,505,646);
    }

    function renderTerrain() {
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */


        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

    }
    function renderCountdown(timeprint) {
        ctx.font = "30px courier";
        ctx.fillStyle="white";
        ctx.textAlign = "center"

        ctx.fillText("You have " + timeprint + " left!", canvas.width/2, 30);
    }

    function renderPlayerPoints() {
        ctx.font = "30px courier";
        ctx.fillStyle="white";
        ctx.textAlign = "center"

        if (player.points === 1) {
            ctx.fillText(player.points + " point!",canvas.width/2, 620);
        }
        if (player.points > 1) {
            ctx.fillText(player.points + " points!",canvas.width/2, 620);
        }

    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        if (player.state === "collide" || player.state ==="success") {
            //balloon.update(player.state, player.x, player.y);
            balloon.render();
        }

        player.render();


        // speech balloons here?
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        player.init();
        lastTime = Date.now();
        startTime = Date.now();

        //hitTime = 0;
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-princess-girl.png',
        'images/Success.png',
        'images/Ouch.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
