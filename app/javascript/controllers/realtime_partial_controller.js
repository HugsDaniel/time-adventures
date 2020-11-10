import { Controller } from "stimulus"
import consumer from "../channels/consumer"
import Rails from '@rails/ujs'

export default class extends Controller {
  initialize () {
    // Is run first. In this case we don't need to worry about anything.
  }

  connect() {
    let realtimePartialController = this;

    this.subscription = consumer.subscriptions.create(
      {
        channel: "RealtimePartialChannel",
        key: this.data.get("key")
      },
      {
        connected() {
          // Called when the subscription is ready for use on the server
        },
        disconnected() {
          // Called when the subscription has been terminated by the server
        },
        received(data) {
          realtimePartialController.renderPartial(data);
          realtimePartialController.afterRenderPartial(data);
        }
      }
    );
  }

  disconnect() {
    this.subscription.unsubscribe();
  }

  renderPartial(data) {
    console.log("salut")
    let newBody = this._parseHTMLResponse(data['body']);

    // Replace all data-turbolinks-permanent elements in the body with what was there
    // previously. This is useful for elements the user might interact with, such
    // as forms or dropdowns.
    let permanentNodes = this.element.querySelectorAll("[id][data-turbolinks-permanent]");
    permanentNodes.forEach(function(element){
      var oldElement = newBody.querySelector(`#${element.id}[data-turbolinks-permanent]`)
      oldElement.parentNode.replaceChild(element, oldElement);
    });

    // Remove all the current nodes from our element.
    while( this.element.firstChild ) { this.element.removeChild( this.element.firstChild ); }

    // When we're sending a new partial, which is a full replacement of our
    // element & not just a group of children.
    if( newBody.childElementCount === 1 && newBody.firstElementChild.dataset.realtimePartialKey === this.data.get("key") ){
      while( newBody.firstElementChild.firstChild ) { this.element.appendChild( newBody.firstElementChild.firstChild ); }
    } else {
      // Append the new nodes.
      while( newBody.firstChild ) { this.element.appendChild( newBody.firstChild ); }
    }
  }

  afterRenderPartial(data) {
    if (data.name === 'map') {
      this._reloadMapCanvas(data.id)
    } else {
      this._reloadDrawingCanvas()
    }
  }

  // From: https://stackoverflow.com/a/42658543/445724
  // using .innerHTML= is risky. Instead we need to convert the HTML received
  // into elements, then append them.
  // It's wrapped in a <template> tag to avoid invalid (e.g. a block starting with <tr>)
  // being mutated inappropriately.
  _parseHTMLResponse(responseHTML){
    let parser = new DOMParser();
    let responseDocument = parser.parseFromString( `<template>${responseHTML}</template>` , 'text/html');
    let parsedHTML = responseDocument.head.firstElementChild.content;
    return parsedHTML;
  }

  _reloadMapCanvas(id) {
    console.log(id)
    const canvas = document.getElementById(`map-${id}`)
    const pane = document.getElementById(`nav-${id}`)
    let width;
    let height;

    if (!pane.classList.contains('show') && !pane.classList.contains('active')) {
      pane.classList.add('show')
      pane.classList.add('active')

      width = canvas.offsetWidth
      height = canvas.offsetHeight

      pane.classList.remove('show')
      pane.classList.remove('active')
    } else {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
    }
    // const context = canvas.getContext('2d')
    const stage = new Konva.Stage({
      container: canvas,
      width: width,
      height: height,
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
        width: width,
        height: height
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

        }, 100);
      }
      markerImageObj.src = `assets/marker-${marker.dataset.name}.png`

      stage.on('dragend', function (e) {
        moveMarker(e.target.attrs.name, e.target.attrs.x, e.target.attrs.y)
      });
    })

    const moveMarker = (id, x, y) => {
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
  }

  _reloadDrawingCanvas() {
    const content = document.getElementById('map-draw').dataset.content
    let stage;
    let layer;

    if (content !== '') {
      // console.log(content.toJSON())
      stage = Konva.Node.create(content, 'map-draw');
      stage.getChildren((node) => {
        if (node.getClassName() === "Layer") {
          layer = node
        }
      })
      console.log(layer)
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
