const client = new WebTorrent()

document.getElementById('torrentForm').addEventListener('submit', e => {
  e.preventDefault()
  const torrentId = document.getElementById('torrentInput').value.trim()
  if (torrentId) {
    client.add(torrentId, onTorrent)
  }
})

function onTorrent(torrent) {
  const results = document.getElementById('results')
  results.innerHTML = `<h3>Loaded Torrent: ${torrent.name}</h3>`

  torrent.files.forEach(file => {
    const fileDiv = document.createElement('div')
    fileDiv.innerHTML = `
      <p>${file.name}</p>
      <button>Stream</button>
    `
    const btn = fileDiv.querySelector('button')
    btn.addEventListener('click', () => {
      file.appendTo(results, {
        autoplay: true,
        controls: true
      })
    })
    results.appendChild(fileDiv)
  })
}
