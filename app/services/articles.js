'use strict';

var mongoose = require('mongoose'),
  Article = mongoose.model('Article');


module.exports = {

  get: function (id, query, callback) {
    Article.load(id, function(err, article) {
      // TODO handle error
      callback(err, article);
    });
  },

  find: function (params, callback) {
    Article.find().sort('-created').populate('user', 'name username').exec(function (err, articles) {
      // TODO handle error
      callback(err, articles);
    });
  },

  create: function(data, params, callback) {
    var article = new Article(data);

    // TODO assign current user
    //article.user = data.user;

    article.save(function(err) {
      // TODO handle error
      callback(err, article);
    });
  }
};