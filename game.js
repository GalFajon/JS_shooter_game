/* ANIMATION LATER

-make sprites and add them to the game
-fix some spawning, re implement pillars
-add images
*/

//globals
let canvas;
let context;
let gamecontroller = new gameController;

function perframe() {
	gamecontroller.perframe(context,canvas)
}

function init() {
	canvas = document.createElement('canvas');
	canvas.id = 'canvas';

	//const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) RESPONSIVE MODE, EXPERIMENTAL
	//const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
	
	canvas.width = 1280;
	canvas.height = 700;

	context = canvas.getContext("2d");
	document.body.appendChild(canvas);

	gamecontroller = new gameController(canvas,context);
}

window.onload = function () {
	init();
	gamecontroller.titleScreen(canvas);
	setInterval(perframe,17);
}

