require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

import "bootstrap";
import Konva from "konva"
import { initCanvas } from "./canvas"

document.addEventListener('turbolinks:load', () => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
  initCanvas()
});

import "controllers"
