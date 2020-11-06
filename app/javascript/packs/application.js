require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")

import "bootstrap";

document.addEventListener('turbolinks:load', () => {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
  $(function () {
    $('[data-toggle="popover"]').popover()
  })
});

import "controllers"
