import Rails from '@rails/ujs'


const initCanvas = () => {
  const content = document.getElementById('map-draw').dataset.content
  let stage;
  let layer;

  const pane = document.getElementById("nav-draw")
  const map  = document.getElementById("map-draw")

  pane.classList.add('show')
  pane.classList.add('active')

  const width = map.offsetWidth
  const height = map.offsetHeight

  pane.classList.remove('show')
  pane.classList.remove('active')


  if (content !== '') {
    stage = Konva.Node.create(content, 'map-draw');
  } else {
    stage = new Konva.Stage({
      container: 'map-draw',
      width: width,
      height: height
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

export { initCanvas }
