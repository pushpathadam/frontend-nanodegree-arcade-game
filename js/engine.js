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
        birthTime,
        deathTime,
        startTime,
        lastTime,
        duration,
        timer,
        countdown;

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
            bdt = (now - birthTime)/1000.0;;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt,bdt);
        // need to redraw collided char and message for a few loops


        //console.log(player.state, player.hitTime, player.dht);

        //duration = 60;
        //timer = (now - startTime) / 1000;
        //countdown = Math.round(duration - timer);
        //bdt < 5secs is birth frame?
        if (bdt < 5) {
            player.birth();
            renderStartScreen();
        }

        // after 5 secs change state of player to inplay
        if (bdt >= 5) {
            countdown = elapsedTime(now);
            render();


            if (countdown <= 0) {
                reset();
            }
            if ((player.dht > 4) && (player.state === "collide" || player.state === "success")) {
                reset();
            }
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
    function elapsedTime(now) {
        duration = 60;
        timer = (now - startTime) / 1000;
        return (Math.round(duration - timer));
    }

    // Function for generating clockString
    function clockString(countdown){
        var minutes =  Math.floor(countdown / 60);
        var seconds = countdown - minutes*60;

        function pad(a,b){return(1e15+a+"").slice(-b)}

        minutes = pad(minutes,2);
        seconds = pad(seconds,2);
        return (minutes + ":" + seconds);

    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        birthTime = Date.now();

        reset();


        lastTime = Date.now();
        startTime = Date.now();
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
    function update(dt,bdt) {
        updateEntities(dt,bdt);
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
    function updateEntities(dt,bdt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update(bdt);
        balloon.update(player.state, player.x, player.y);
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
         /*
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
        */
        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */

/*
        var minutes =  Math.floor(countdown / 60);
        var seconds = countdown - minutes*60;

        function pad(a,b){return(1e15+a+"").slice(-b)}

        minutes = pad(minutes,2);
        seconds = pad(seconds,2);
        */
        var timeprint = clockString(countdown);

        //console.log(timeprint);

        renderBackground();
        renderCountdown(timeprint);
        renderPoints();
        renderGround();
        /*
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                 /*
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
        */


        renderEntities();
    }

    function renderStartScreen() {
        console.log("in-renderStartScreen");

        ctx.clearRect(-10,-10,515,626);

        renderBackground();
        renderGround();

        ctx.font = "30px courier";
        ctx.fillStyle="white";
        ctx.textAlign = "center"
        introText1 = "Hello!";
        ctx.fillText(introText1, canvas.width/2, 50);

        player.render();

        introText2 = "How many times";
        introText3 = "can you reach the pond";
        introText4 = "in 1 minute?";
        introText5 = "Use the arrow keys to move.";
        ctx.fillText(introText2, canvas.width/2, 100);
        ctx.fillText(introText3, canvas.width/2, 150);
        ctx.fillText(introText4, canvas.width/2, 550);
        ctx.fillText(introText5, canvas.width/2, 600);
    }

    function renderEndScreen() {
        ctx.clearRect(-10,-10,515,626);
        ctx.fillstyle = "#ff1493";
        ctx.fillRect(0,0,505,646);

        ctx.font = "30px courier";
        ctx.fillStyle="white";
        ctx.textAlign = "center"
        introText1 = "Not Bad!";
        ctx.fillText(introText1, canvas.width/2, 50);

        ctx.drawImage(Resources.get('images/char-princess-girl.png'),canvas.width/2,canvas.height/2);
        introText2 = "Try Again?";
        introText5 = "click the space bar to start";
        ctx.fillText(introText2, canvas.width/2, 150);
        ctx.fillText(introText3, canvas.width/2, 200);
        ctx.fillText(introText4, canvas.width/2, 250);
        ctx.fillText(introText5, canvas.width/2, 300);
    }


    function renderBackground() {
        ctx.clearRect(-10,-10,515,626);
        switch (player.state) {
            case "born":
                ctx.fillstyle = "#ff1493";
            case "success":
                ctx.fillStyle= "#ff1493";
                break;
            case "collide":
                ctx.fillStyle= "red";
                break;
            case "inplay":
                ctx.fillStyle= "#32cd32";
                break;
            default:
                ctx.fillStyle="#333";
                break;

        }
        ctx.fillRect(0,0,505,646);
    }

    function renderGround() {
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

    function renderPoints() {
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

        //}
        // player.reset();

        player.render();


        // speech balloons here?
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
        console.log("game starts");
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
