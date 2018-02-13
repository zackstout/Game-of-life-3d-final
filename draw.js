
// -Dependencies for Browserify-
var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

// -Global variables-
var pos = new THREE.Vector3();
// var color1 = new THREE.Color("rgb(0, 0, 30)");
var color1 = new THREE.Color(" skyblue ");

var color2 = new THREE.Color("rgb(0, 0, 255)");
var geometry, cube;
var material = new THREE.MeshBasicMaterial( { color: color1 } );
var material2 = new THREE.MeshLambertMaterial( { color: color2 } );

var height = 0;
var count = 0;

// Toggle whether to view in 2d or 3d:
var threeD = true;
// Number of cells:
var n = 20;
// Size of each cell: ensures size is always 40 units.
var s = 40 / n;
// Array of arrays:
var currentVals = [];
var nextVals = [];
// var initial = [[10, 10], [10, 11], [10, 12], [11, 10], [12, 11]];
var initial = [[15, 15], [15, 16], [15, 17], [16, 15], [17, 16]];
// var initial = [[10, 10], [10, 11], [10, 12]];
// var initial = [[10, 10], [10, 11], [11, 10], [13, 12], [13, 13], [12, 13]];


// -Setup three.js-
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xB0E0E6 );
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.z = 45;
camera.position.y = 10;
camera.position.x = 20;
camera.rotation.x = Math.PI / 2;

var controls = new OrbitControls( camera );
controls.target.set( 0, 2, 0 );
controls.update();

// -Functions-
function initialize() {
  initial.forEach(function(a) {
    // Beautiful: this grabs the cell we care about:
    index = a[0] * n + a[1];
    currentVals[index][2] = 1;
  });
}

function setupVals() {
  for (var i=0; i < n; i++) {
    for (var j=0; j < n; j++) {
      // Initialize both arrays with all elements starting at value 0:
      currentVals.push([i, j, 0]);
      nextVals.push([i, j, 0]);
    }
  }
}

function liveOrDie(x) {
    var neighbors = getNeighbors(x);
    var total = 0;
    var oh, one, val;

    // Grab total of live neighbors:
    neighbors.forEach(function(neighbor) {
      oh = neighbor[0];
      one = neighbor[1];
      val = neighbor[2];

      if (val == 1) {
        total ++;
      }
    });

    // Game of Life logic:
    if (total < 2 || total > 3) {
      nextVals[x[0] * n + x[1]][2] = 0;
    }
    else if (total == 3) {
      nextVals[x[0] * n + x[1]][2] = 1;
    } else if (total == 2 && currentVals[x[0] * n + x[1]][2]){
      nextVals[x[0] * n + x[1]][2] = 1;
    } else {
      nextVals[x[0] * n + x[1]][2] = 0;
    }
    total = 0;
  }

  // x is our cell, i.e. array of 3 (e.g. [10, 10, 1]):
function getNeighbors(x) {
    var neighbors = [];
    var xPos, yPos, val;

    if (x[0] > 0) {
      xPos = x[0] - 1;
      yPos = x[1];
      val = currentVals[xPos * n + yPos][2];
      neighbors.push([x[0] - 1, x[1], val]);

      if (x[1] > 0) {
        xPos = x[0];
        yPos = x[1] - 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0], x[1] - 1, val]);
        xPos = x[0] - 1;
        yPos = x[1] - 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0] - 1, x[1] - 1, val]);
      }

      //shouldn't it be n-1?:
      if (x[1] < n - 1) {
        xPos = x[0];
        yPos = x[1] + 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0], x[1] + 1, val]);
        xPos = x[0] - 1;
        yPos = x[1] + 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0] - 1, x[1] + 1, val]);
      }
    } else {
      if (x[1] > 0) {
        xPos = x[0];
        yPos = x[1] - 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0], x[1] - 1, val]);
      }
      if (x[1] < n - 1) {
        xPos = x[0];
        yPos = x[1] + 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0], x[1] + 1, val]);
      }
    }

    if (x[0] < n - 1) {
      xPos = x[0] + 1;
      yPos = x[1];
      val = currentVals[xPos * n + yPos][2];
      neighbors.push([x[0] + 1, x[1], val]);

      if (x[1] > 0) {
        xPos = x[0] + 1;
        yPos = x[1] - 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0] + 1, x[1] - 1, val]);
      }
      if (x[1] < n - 1) {
        xPos = x[0] + 1;
        yPos = x[1] + 1;
        val = currentVals[xPos * n + yPos][2];
        neighbors.push([x[0] + 1, x[1] + 1, val]);
      }
    }

    return neighbors;
  } // end getNeighbors


  function drawGrid(y) {
  for (var i=0; i < n; i++) {
    for (var j=0; j < n; j++) {
      // Increment position by the size of each box:
      pos.set(i * s, y, j * s);
      geometry = new THREE.BoxGeometry(s*0.9, s*0.9, s*0.9);

      if (threeD) {
        if (currentVals[i * n + j][2]) {
          // console.log(count);
          if (count % 2 == 0) {
            cube = new THREE.Mesh( geometry, material );
          } else {
            cube = new THREE.Mesh( geometry, material2 );
          }
          cube.position.copy( pos );
          cube.receiveShadow = true;
          cube.castShadow = true;
          scene.add( cube );
          count ++;
        }
      } else {
        if (currentVals[i * n + j][2]) {
          cube = new THREE.Mesh( geometry, material );
        } else {
          cube = new THREE.Mesh( geometry, material2 );
        }

        cube.position.copy( pos );
        cube.receiveShadow = true;
        cube.castShadow = true;
        scene.add( cube );
      }
    }
  }
  updateGrid();
}

// for (var i=0; i < 10; i ++) {
//   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
//   var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
//   var cube = new THREE.Mesh( geometry, material );
//   cube.position.y = i * 1.2;
//   scene.add( cube );
// }

function updateGrid() {
  currentVals.forEach((v) => {
    liveOrDie(v);
  });

  currentVals = [];

  nextVals.forEach((a) => {
    clone = a.slice(0);
    currentVals.push(clone);
  });
}

// -Let's go!-
setupVals();
initialize();
drawGrid(height);

var t=0;
var light = new THREE.PointLight(0xffffff);
light.position.set(-20,50,20);
scene.add(light);

var animate = function () {
  setTimeout( function() {
    drawGrid(height);
    height += 1;
    if (!threeD) {
      camera.position.y = 10 + height;
      light.position.y = 20 + height;
    } else {
        // light.position.x = -10 * Math.sin(t);
        // light.position.z = 10 * Math.cos(t);
        // light.position.y = 20 + height;
        // t += 2;
    }

    requestAnimationFrame( animate );

  }, 400 );  renderer.render(scene, camera);

};

animate();
