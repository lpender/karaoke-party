Songs = new Mongo.Collection("songs");

if (Meteor.isClient) {
  Template.body.helpers({
    songs: function() {
      return Songs.find({}, {sort: {createdAt: -1 }});
    }
  });

  Template.body.events({
    "submit .new-song": function(event) {
      var name = event.target.name.value;
      var song = event.target.song.value;

      Songs.insert({
        name: name,
        song: song,
        createdAt: new Date()
      });

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
    }
  });

  Template.song.helpers({
    youtube_link: function() {
      var link = "https://www.youtube.com/results?search_query=";
      link += this.song.replace(" ", "+");
      link += "+karaoke";
      return link;
    }
  });
}
