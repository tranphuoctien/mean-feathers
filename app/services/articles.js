'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash');


module.exports = {

    getById: function (id, callback) {
        Article.load(id, function (err, article) {
            if (err) return next(err);
            if (!article) return next(new Error('Failed to load article ' + id));
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
        var article = new Article(data);

        // TODO assign current user
        //article.user = data.user;

        article.save(function (err) {
            callback(err, article);
        });
    },

    update: function (id, data, params, callback) {
        this.getById(id, function (err, article) {
            if (article === null) {
                return callback(new Error('Can not update article'));
            }

            article = _.extend(article, data);
            article.save(function (err) {
                callback(err, article);
            });
        });
    },

    remove: function (id, params, callback) {
        this.getById(id, function (err, article) {
            if (article === null) {
                return callback(new Error('Can not delete article'));
            }

            article.remove(function (err) {
                callback(err, article);
            });
        });

    }
};