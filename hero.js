Players = new Mongo.Collection("players");

Voters = new Mongo.Collection("voters");

if (Meteor.isClient) {
  Template.hero.helpers({
    players: function () {
      return Players.find({}, { sort: {name: 1}});
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    },
  });

  Template.hero.events({
    'click .up': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: 1}});
    },
    'click .del': function () {
      Players.remove(Session.get("selectedPlayer"));
    },
    'click .down': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: -1}});
    },
    'click .name': function () {
      //Players.update(Session.get("selectedPlayer"), {$inc: {score: -5}});
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });

  Template.player.helpers({
    voters: function () {
      //console.log(this);
      return Voters.find({plan: this._id});
    },
    newscore: function () {
      //console.log("newscore: ", this._id);
      return Voters.find({plan: this._id}).count();
    },
  });

  Template.body.events({
    'submit .add-a-player': function (event) {
      var name = event.target.name.value;
/*
      Players.insert({
        name: name,
        score: Math.floor(Random.fraction() * 10) * 5
      });
*/

      Players.update(Session.get("selectedPlayer"), {$inc: {score: 1}});
      Voters.insert({
        plan: Session.get("selectedPlayer"),
        name: name,
      });

      event.target.name.value = "";

      return false;
    }
  });
}



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Players.find().count() === 0) {
      var names = ["方案A. 十天教你学会Meteor","方案B. 三周Meteor项目全栈开发"];

      Players.remove({});
      _.each(names, function (name) {
        Players.insert({
          name: name,
          score: 0
        });
      });
    }
  });
}
