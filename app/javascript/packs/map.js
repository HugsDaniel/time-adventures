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
  })

  canvasCollection.forEach((canvas) => {
    // const context = canvas.getContext('2d')
    const stage = new Konva.Stage({
      container: canvas,
      width: measures[canvas.dataset.mapId][0],
      height: measures[canvas.dataset.mapId][1],
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    const imageObj = new Image();
    imageObj.onload = () => {
      const image = new Konva.Image({
        x: 0,
        y: 0,
        id: canvas.dataset.mapId,
        image: imageObj,
        width: measures[canvas.dataset.mapId][0],
        height: measures[canvas.dataset.mapId][1]
      });

      layer.add(image);
      layer.draw();
    }
    imageObj.src = 'http://res.cloudinary.com/hugs/image/upload/c_fill/' + canvas.dataset.image

    const markers = document.querySelectorAll(`.marker-for-${canvas.dataset.mapId}`)

    markers.forEach((marker) => {

      const markerImageObj = new Image();

      markerImageObj.onload = () => {
        setTimeout(() => {
          var markerImage = new Konva.Image({
            x: parseInt(marker.dataset.x),
            y: parseInt(marker.dataset.y),
            image: markerImageObj,
            name: marker.dataset.id,
            width: 50,
            height: 50,
            draggable: true,
            dragBoundFunc: function (pos) {
              var newY = pos.y < 0 ? 0 : pos.y;
              var newX = pos.x < 0 ? 0 : pos.x;
              return {
                x: newX,
                y: newY,
              };
            },
          });

          layer.add(markerImage);
          layer.draw();

        }, 2000);
      }
      markerImageObj.src = `assets/marker-${marker.dataset.name}.png`
    })

    stage.on('dragend', function (e) {
      moveMarker(stage, e.target.attrs.name, e.target.attrs.x, e.target.attrs.y)
    });
  })

  const moveMarker = (stage, id, x, y) => {
    fetch(`/markers/${id}`, {
      method: 'put',
      body: JSON.stringify({ id: id, x: x, y: y }),
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
  }

  window.addEventListener('load', () => { initCanvas() })
  const initCanvas = () => {
    const content = document.getElementById('map-draw').dataset.content
    let stage;
    let layer;

    if (content !== '') {
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
