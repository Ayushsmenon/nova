import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Gauge } from "lucide-react";
import WebTorrent from "webtorrent";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function NovaPlayer() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [quality, setQuality] = useState("auto");
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ download: 0, upload: 0, peers: 0 });
  const [torrentUrl, setTorrentUrl] = useState("");
  const [useFFmpeg, setUseFFmpeg] = useState(false);

  const clientRef = useRef(null);
  const ffmpegRef = useRef(null);

  useEffect(() => {
    clientRef.current = new WebTorrent();
    return () => clientRef.current?.destroy();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const changeSpeed = (e) => {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    if (videoRef.current) videoRef.current.playbackRate = val;
  };

  const changeQuality = (e) => {
    setQuality(e.target.value);
  };

  const handleAddTorrent = async () => {
    if (!torrentUrl || !clientRef.current) return;

    clientRef.current.add(torrentUrl, async (torrent) => {
      const file = torrent.files.find((f) => f.name.endsWith(".mp4"));
      if (!file) return;

      if (useFFmpeg) {
        if (!ffmpegRef.current) {
          ffmpegRef.current = createFFmpeg({ log: true });
          await ffmpegRef.current.load();
        }

        const buf = await file.arrayBuffer();
        ffmpegRef.current.FS("writeFile", "input.mp4", new Uint8Array(buf));

        let output = "output.mp4";
        let res = quality === "720p" ? "1280x720" : quality === "480p" ? "854x480" : "1920x1080";

        await ffmpegRef.current.run("-i", "input.mp4", "-vf", `scale=${res}`, output);
        const data = ffmpegRef.current.FS("readFile", output);

        const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
        videoRef.current.src = url;
      } else {
        file.renderTo(videoRef.current);
      }

      torrent.on("download", () => {
        setStats({
          download: (torrent.downloadSpeed / 1024 / 1024).toFixed(2),
          upload: (torrent.uploadSpeed / 1024 / 1024).toFixed(2),
          peers: torrent.numPeers,
        });
        setProgress(((torrent.downloaded / torrent.length) * 100).toFixed(2));
      });
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Nova Player</h1>

      {/* Torrent Input */}
      <div className="flex gap-2 mb-4 w-full max-w-3xl">
        <input
          type="text"
          value={torrentUrl}
          onChange={(e) => setTorrentUrl(e.target.value)}
          placeholder="Paste magnet link or torrent file URL..."
          className="flex-1 p-2 rounded bg-gray-800"
        />
        <button
          onClick={handleAddTorrent}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* FFmpeg toggle */}
      <label className="mb-4 flex items-center gap-2">
        <input type="checkbox" checked={useFFmpeg} onChange={(e) => setUseFFmpeg(e.target.checked)} />
        Enable FFmpeg Transcoding (Heavy)
      </label>

      {/* Video Player */}
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="w-full h-96 bg-black"
          controls={false}
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-0 w-full bg-black/60 p-3 flex items-center justify-between text-sm">
          <button onClick={togglePlay} className="mr-2">
            {playing ? <Pause /> : <Play />}
          </button>

          <div className="flex items-center gap-3">
            <label>
              Quality:
              <select
                value={quality}
                onChange={changeQuality}
                className="ml-1 bg-gray-800 rounded p-1"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </label>

            <label>
              Speed:
              <select
                value={speed}
                onChange={changeSpeed}
                className="ml-1 bg-gray-800 rounded p-1"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </label>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-700">
          <div
            className="h-2 bg-green-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats log */}
      <div className="mt-4 text-sm bg-gray-800 p-3 rounded-xl w-full max-w-3xl">
        <h2 className="font-semibold flex items-center gap-2">
          <Gauge className="w-4 h-4" /> Network Stats
        </h2>
        <p>Download: {stats.download} MB/s</p>
        <p>Upload: {stats.upload} MB/s</p>
        <p>Peers: {stats.peers}</p>
      </div>

      <footer className="mt-6 text-gray-500">© 2025 Nova</footer>
    </div>
  );
}
