import Rails from '@rails/ujs'

const initMap = () => {
  const canvasCollection = document.querySelectorAll(".map")
  const tabPanes = document.querySelectorAll(".tab-pane")
  const measures = {}

  tabPanes.forEach((pane) => {
    pane.classList.add('show')
    pane.classList.add('active')

    const map = document.getElementById(`map-${pane.dataset.mapId}`)

    const width = map.offsetWidth
    const height = map.offsetHeight

    if (map) {
      measures[pane.dataset.mapId] = [width, height]
    }

    if (pane.dataset.mapName !== "Monde") {
      pane.classList.remove('show')
      pane.classList.remove('active')
    }
    // pane.classList.remove('show active')
  })

  canvasCollection.forEach((canvas) => {
    const context = canvas.getContext('2d')

    if (canvas.dataset.mapId) {
      context.canvas.width = measures[canvas.dataset.mapId][0]
      context.canvas.height = measures[canvas.dataset.mapId][1]

      const img = new Image();
      img.onload = function() {
        context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
      };
      // img.src = 'myImage.png';
      img.src = 'http://res.cloudinary.com/hugs/image/upload/c_fill/' + canvas.dataset.image;
    } else {
      // context.canvas.width = measures['draw'][0]
      // context.canvas.height = measures['draw'][1]

      // canvas.addEventListener('mousedown', startPainting);
      // canvas.addEventListener('mouseup', stopPainting);
      // canvas.addEventListener('mousemove', sketch);

      // let coord = {x:0 , y:0};
      // let paint = false;

      // function getPosition(event){
      //   coord.x = event.clientX - canvas.offsetWidth;
      //   coord.y = event.clientY - canvas.offsetTop;
      // }

      // function startPainting(event){
      //   paint = true;
      //   getPosition(event);
      // }
      // function stopPainting(){
      //   paint = false;
      // }

      // function sketch(event){
      //   if (!paint) return;
      //   context.beginPath();
      //   context.lineWidth = 5;
      //   context.lineCap = 'round';
      //   context.strokeStyle = 'green';
      //   context.moveTo(coord.x, coord.y);
      //   getPosition(event);
      //   context.lineTo(coord.x , coord.y);
      //   context.stroke();
      // }
    }
  })


  window.addEventListener('load', () => { initCanvas() })

  const initCanvas = () => {
    const content = document.getElementById('map-draw').dataset.content
    let stage;
    let layer;

    if (content !== '') {
      console.log(content.toJSON())
      stage = Konva.Node.create(content, 'map-draw');
    } else {
      stage = new Konva.Stage({
        container: 'map-draw',
        width: measures['draw'][0],
        height: measures['draw'][1]
      })

      layer = new Konva.Layer();
      stage.add(layer);
    }

    var isPaint = false;
    var mode = 'brush';
    var lastLine;

    stage.on('mousedown touchstart', function (e) {
      isPaint = true;
      var pos = stage.getPointerPosition();
      lastLine = new Konva.Line({
        stroke: '#df4b26',
        strokeWidth: mode === 'brush' ? 5 : 20,
        globalCompositeOperation:
          mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y],
      });
      layer.add(lastLine);
    });

    stage.on('mouseup touchend', function () {
      isPaint = false;
      const json = stage.toJSON();

      fetch('/drawings', {
        method: 'post',
        body: JSON.stringify(json),
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': Rails.csrfToken()
        },
        credentials: 'same-origin'
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data)
      });
    });

    stage.on('mousemove touchmove', function () {
      if (!isPaint) {
        return;
      }

      const pos = stage.getPointerPosition();
      var newPoints = lastLine.points().concat([pos.x, pos.y]);
      lastLine.points(newPoints);
      layer.batchDraw();
    });

    var select = document.getElementById('tool');
    select.addEventListener('change', function () {
      mode = select.value;
    });

  }
}

export { initMap }
