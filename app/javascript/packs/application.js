require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

import "bootstrap";
import Konva from "konva"
import { initMap } from "./map"

document.addEventListener('turbolinks:load', () => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
  initMap()
});

import "controllers"
