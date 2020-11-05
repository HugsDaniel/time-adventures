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
  document.querySelectorAll(".toggleNewSpecialForm").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault()
      document.getElementById("newSpecialForm" + event.target.dataset.id).classList.remove("d-none")
    })
  })
});

import "controllers"
