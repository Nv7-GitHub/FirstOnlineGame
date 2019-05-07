$(document).ready(function(){
  // define variables
  window.target_FPS = 30

  //define functions
  function makeSVG(tag, attrs) { // SVG
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs)
                el.setAttribute(k, attrs[k]);
            return el;
  }

  function sleepfunc(ms) { // Wait
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function sleep() {
    await sleepfunc((1 / window.target_FPS) * 1000)
  }

  var lastCalledTime;
  var fps;

  function calcFPS() {

    if(!lastCalledTime) {
       lastCalledTime = Date.now();
       fps = 0;
       return;
    }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
  }

  //make socket
  socket = io.connect('http://' + document.domain + ':' + location.port + '/');

  // define socket functions
  socket.on('updateclient', function(players) {
    //FPS Control
    calcFPS()
    if (fps > window.target_FPS) {
      sleep((1 / window.target_FPS) * 1000)
      console.log(fps)
    }


    // Rendering
    $('#svg').empty();
    for (var i = 0; i < players.length; i++){
      var circle = makeSVG('circle', {cx: players[i].x, cy: players[i].y, r: '5vw', stroke: '#00FFFF', 'stroke-width': '0px', fill: '#00FFFF'})
      document.getElementById('svg').appendChild(circle);
    }

    // Key Press
    $(document).keydown(function(e) {
      switch(e.which) {
          case 37: // left
            socket.emit('update', 'left');
            break;

          case 38: // up
            socket.emit('update', 'up');
            break;

          case 39: // right
            socket.emit('update', 'right');
            break;

          case 40: // down
            socket.emit('update', 'down');
            break;

          default:
          break;
      }
      e.preventDefault(); // prevent the default action (scroll / move caret)
    });

    socket.emit('update', 'No Keys')
  })

  socket.emit('update', 'No Keys')

})
