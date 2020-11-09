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

    measures[pane.dataset.mapId] = [width, height]

    if (pane.dataset.mapName !== "Monde") {
      pane.classList.remove('show')
      pane.classList.remove('active')
    }
    // pane.classList.remove('show active')
  })

  canvasCollection.forEach((canvas) => {
    const context = canvas.getContext('2d')

    context.canvas.width = measures[canvas.dataset.mapId][0]
    context.canvas.height = measures[canvas.dataset.mapId][1]

    const img = new Image();
    img.onload = function() {
      context.drawImage(img, 0, 0, context.canvas.width, context.canvas.height);
    };
    // img.src = 'myImage.png';
    img.src = 'http://res.cloudinary.com/hugs/image/upload/c_fill/' + canvas.dataset.image;
  })
}

export { initMap }
