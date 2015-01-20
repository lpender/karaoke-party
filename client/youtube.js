var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getCurrentId() {
  return $("li.current").data("ytid");
}
window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
  var check = setInterval( function () {
    if (window.songsReady) {
      window.player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: (function () {
          return getCurrentId();
        }()),
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });

      clearInterval(check);
    }
  }, 300);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    debugger;
    Meteor.call("selectSong", Songs.findOne({next: true}));
  }
}

function stopVideo() {
  player.stopVideo();
}
