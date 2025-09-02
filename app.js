// Simple browser WebTorrent player demo
(function(){
  const client = new WebTorrent(); // creates client in browser (WebRTC)
  const logPre = document.getElementById('logPre');
  const fileList = document.getElementById('fileList');
  const filesSection = document.getElementById('filesSection');
  const player = document.getElementById('player');
  const mediaContainer = document.getElementById('mediaContainer');

  function log(...args){
    const s = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
    logPre.textContent += s + '\n';
    logPre.scrollTop = logPre.scrollHeight;
    console.debug('[group4]', ...args);
  }

  document.getElementById('addMagnet').addEventListener('click', () => {
    const magnet = document.getElementById('magnet').value.trim();
    if(!magnet) return alert('Paste a magnet link first.');
    addTorrent(magnet);
  });

  document.getElementById('torrentFile').addEventListener('change', (ev) => {
    const f = ev.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      addTorrent(new Uint8Array(buffer));
    };
    reader.readAsArrayBuffer(f);
  });

  function addTorrent(torrentId){
    log('Adding torrent:', torrentId && torrentId.toString().slice(0,80));
    client.add(torrentId, { announce: [ /* optionally add trackers */ ] }, (torrent) => {
      log('Torrent metadata ready:', torrent.name);
      filesSection.classList.remove('hidden');
      player.classList.remove('hidden');
      fileList.innerHTML = '';
      mediaContainer.innerHTML = '';

      // Show files
      torrent.files.forEach((f, idx) => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.textContent = 'Stream';
        btn.style.marginRight = '10px';
        btn.addEventListener('click', () => streamFile(f));
        li.appendChild(btn);
        li.appendChild(document.createTextNode(f.name + ' (' + formatBytes(f.length) + ')'));
        fileList.appendChild(li);
      });

      // Log progress
      torrent.on('done', () => log('Torrent download finished'));
      torrent.on('download', (bytes) => {
        log('Progress:', (torrent.progress*100).toFixed(2) + '%', 'downloaded', formatBytes(torrent.downloaded));
      });
    });
  }

  function streamFile(file){
    log('Streaming file:', file.name);
    mediaContainer.innerHTML = '';
    // choose tag based on file type
    const isVideo = /\.mp4$|\.mkv$|\.webm$|\.ogg$/i.test(file.name);
    const isAudio = /\.mp3$|\.flac$|\.wav$|\.m4a$/i.test(file.name);

    const container = document.createElement(isVideo ? 'video' : 'audio');
    container.controls = true;
    container.autoplay = true;

    // Use file.renderTo or getBlobURL via file.getBlobURL
    // webtorrent provides file.renderTo (for older versions) and file.getBlobURL
    file.getBlobURL((err, url) => {
      if(err){
        log('Error creating blob URL', err);
        alert('Could not create stream URL: ' + err.message);
        return;
      }
      container.src = url;
      mediaContainer.appendChild(container);
      log('Playing from blob URL');

      // Revoke object URL when finished
      container.addEventListener('ended', () => {
        URL.revokeObjectURL(url);
        log('Stopped and revoked URL');
      });
    });
  }

  function formatBytes(bytes){
    if(bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B','KB','MB','GB','TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Cleanup on unload
  window.addEventListener('beforeunload', () => {
    try{ client.destroy(); }catch(e){}
  });

  log('group4 client ready. Paste a magnet link or upload a .torrent file.');
})();
