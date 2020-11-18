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
    if (data.name === 'draw') {
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
}
