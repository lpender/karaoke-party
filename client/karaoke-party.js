Template.body.helpers({
  songs: function() {
    return Songs.find({}, {sort: {createdAt: 1 }});
  }
});

Template.body.events({
  "submit .new-song": function(event) {
    var name = event.target.name.value;
    var song = event.target.song.value;

    Meteor.http.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          key: "AIzaSyAnSsdD1WeO6okP1a5qnnQatENhWUUWMcw",
          part: "snippet",
          type: "video",
          q: song + " karaoke"
        }
      },

      function (error, result) {
        var songId = result.data.items[0].id.videoId;

        Songs.insert({
          name: name,
          song: song,
          id: songId,
          createdAt: new Date()
        });
      }
    );


    event.target.name.value = "";
    event.target.song.value = "";

    return false;
  }
});

Template.song.events({
  "click .toggle-checked": function() {
    Songs.update(this._id, {$set: {checked: ! this.checked}});
  },
  "click .delete": function() {
    Songs.remove(this._id);
  },
  "click a": function() {
    window.player.loadVideoById(this.id)
    Songs.update(this._id, {$set: {checked: true}});
    return false;
  }
});

Template.song.helpers({
  youtube_link: function() {
    var link = "http://www.youtube.com/watch?v=";
    link += this.id;
    return link;
  }
});
