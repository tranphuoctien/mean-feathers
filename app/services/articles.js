'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');

// Article authorization helpers
var hasAuthorization = function(article, userId) {
    if (article.user.id !== userId) {
        return false;
    }
    return true;
};

module.exports = {

    getById: function (id, callback) {
        Article.load(id, function (err, article) {
            if (err) return callback(err);
            if (!article) return callback(new Error('Failed to load article ' + id));
            callback(null, article);
        });
    },

    find: function (params, callback) {
        Article.find().sort('-created').populate('user', 'name username').exec(function (err, articles) {
            if (articles === null) {
                return callback(new Error('Articles not found'));
            }
            callback(err, articles);
        });
    },

    get: function (id, params, callback) {
        this.getById(id, function (err, article) {
            if (article === null) {
                return callback(new Error('Article not found'));
            }
            callback(null, article);
        });
    },

    create: function (data, params, callback) {
        if(!params.user) {
            return callback(new Error('You need to be authenticated'));
        }
        var article = new Article(data);
        article.user = params.user;

        article.save(function (err) {
            callback(err, article);
        });
    },

    update: function (id, data, params, callback) {
        if(!params.user) {
            return callback(new Error('You need to be authenticated'));
        }
        this.getById(id, function (err, article) {
            if (!article) {
                return callback(new Error('Can not update article'));
            }

            if (!hasAuthorization(article, params.user.id)) {
                return callback(new Error('Can not update article, not authorized'));
            }

            article = _.extend(article, data);
            article.save(function (err) {
                callback(err, article);
            });
        });
    },

    remove: function (id, params, callback) {
        if(!params.user) {
            return callback(new Error('You need to be authenticated'));
        }
        this.getById(id, function (err, article) {
            if (!article) {
                return callback(new Error('Can not delete article'));
            }

            if (!hasAuthorization(article, params.user.id)) {
                return callback(new Error('Can not delete article, not authorized'));
            }

            article.remove(function (err) {
                callback(err, article);
            });
        });

    }
};
