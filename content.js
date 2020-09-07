let executingMessage = false;
let socket = null;
let video = null;

const showToast = (message) => {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
    stopOnFocus: true // Prevents dismissing of toast on hover
  }).showToast();
}

const onPlay = () => {
  showToast("Play");
  if (executingMessage) {
    executingMessage = false;
    return;
  }
  socket.emit('video event', {type: "play", currentVideoTime: video.currentTime});
  console.log('[Video Party] play ' + video.currentTime);
};

const onPause = () => {
  showToast("Pause");
  if (executingMessage) {
    executingMessage = false;
    return;
  }
  socket.emit('video event', {type: "pause", currentVideoTime: video.currentTime});
  console.log('[Video Party] pause ' + video.currentTime);
};

const onVideoEvent = (videoEvent) => {
  if (videoEvent.type === "pause") {
    if (!video.paused) {
      video.currentTime = videoEvent.currentVideoTime;
      executingMessage = true;
      video.pause();
    }
  } else {
    if (video.paused) {
      video.currentTime = videoEvent.currentVideoTime;
      executingMessage = true;
      video.play();
    }
  }

  console.log(`[Video Party][video event][type=${videoEvent.type}][currentVideoTime=${videoEvent.currentVideoTime}]`);
};

const start = () => {
  console.log('[Video Party] Running!');

  showToast("Video Party started!");

  const videos = document.getElementsByTagName('video');

  if (videos.length !== 0) {
    console.log(`[Video Party] ${videos.length} video(s) found`);

    // TODO: add support for selecting video
    video = videos[0];
    socket = io.connect('https://video-party-api.herokuapp.com/');

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    socket.on('video event', onVideoEvent);
  } else {
    console.log('[Video Party] No video found');
  }
};

const stop = () => {
  console.log('[Video Party] Stopping');
  showToast("Video Party stopping");
  socket.close();
  socket = null;
  video.removeEventListener("play", onPlay);
  video.removeEventListener("pause", onPause);
  video = null;
  executingMessage = false;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start") {
    start();
  } else {
    // message.action === "stop"
    stop();
  }
});

start();
