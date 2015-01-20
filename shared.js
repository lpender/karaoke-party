Songs = new Mongo.Collection("songs");

Meteor.methods({
  selectSong: function(song) {
    if (Meteor.isClient) {
      try {
        window.player.loadVideoById(song.id);
      } catch (e) {
        alert("player not ready yet... chill");
      }
    }
    Songs.update(song._id, {$set: {checked: true}});
    Meteor.call("setCurrent", song);
  },
  setCurrent: function(song) {
    Songs.update({current: true}, {$set: {current: false}}, function () {
      Songs.update(song._id, {$set: {current: true}});
      Meteor.call("updateNext");
    });
  },
  updateNext: function(song) {
    if (Meteor.isServer) {
      var updateNext = false;
      Songs.update({next: true}, {$set: {next: false}}, function() {
        Songs.find({}, {sort: { createdAt: 1 }}).forEach(function(doc, index, cursor) {
          if (updateNext) {
            Songs.update(doc._id, {$set: {next: true}});
            updateNext = false;
          }
          if (doc.current) {
            updateNext = true;
          }
        });
      });
    }
  },
  getCurrentSong: function() {
    var song = Songs.findOne({current: true});
    return song._id;
  }
});
