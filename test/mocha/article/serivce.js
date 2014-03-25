'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Article = mongoose.model('Article'),
    Service = require('../../../app/services/articles');

//Globals
var user;
var unauthorizedUser;

//The tests
describe('Unit Test', function() {
    describe('Service Article:', function() {

        var cleanup = function() {
            Article.remove().exec();
            User.remove().exec();
        };

        beforeEach(function(done) {
            cleanup();
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            unauthorizedUser = new User({
                name: 'Norman Noaccess',
                email: 'noaccess@test.com',
                username: 'noaccess',
                password: 'password'
            });

            user.save(function() {
                done();
            });
        });

        describe('Method Create', function() {

            it('should be able to save without problems', function (done) {
                var data = {
                    title: 'Article Title',
                    content: 'Article Content'
                };
                Service.create(data, {user: user}, function (err, article) {
                    should.not.exist(err);
                    article.title.should.equal('Article Title');
                    article.content.should.equal('Article Content');
                    done();
                });
            });

            it('should show an error when try to save without a user', function (done) {
                var data = {
                    title: 'Article Title',
                    content: 'Article Content'
                };
                Service.create(data, {}, function (err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('You need to be authenticated');
                    done();
                });
            });
        });

        describe('Method Delete', function() {
            var tmpArticleId = null;

            beforeEach(function(done) {
                var data = {
                    title: 'Article Title',
                    content: 'Article Content'
                };
                Service.create(data, {user: user}, function (err, article) {
                    should.not.exist(err);
                    tmpArticleId = article.id;
                    done();
                });
            });

            it('should be able to remove without problems', function (done) {
                Service.remove(tmpArticleId, {user:user}, function(err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when try to remove without a user', function (done) {
                Service.remove(tmpArticleId, {}, function(err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('You need to be authenticated');
                    done();
                });
            });

            it('should show an error when try to remove with an unauthorized user', function (done) {
                Service.remove(tmpArticleId, {user:unauthorizedUser}, function(err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('Can not delete article, not authorized');
                    done();
                });
            });

            it('should show an error when try to remove with an invalid article id', function (done) {
                Service.remove('blub', {user: user}, function(err) {
                    err.should.be.Error;
                    err.message.should.equal('Can not delete article');
                    done();
                });
            });
        });

        describe('Method Update', function() {
            var tmpArticleId = null;

            beforeEach(function(done) {
                var data = {
                    title: 'Article Title',
                    content: 'Article Content'
                };
                Service.create(data, {user: user}, function (err, article) {
                    should.not.exist(err);
                    tmpArticleId = article.id;
                    done();
                });
            });

            it('should be able to update without problems', function (done) {
                var data = {
                    title: 'New Title'
                };
                Service.update(tmpArticleId, data, {user:user}, function(err, article) {
                    should.not.exist(err);
                    article.title.should.equal('New Title');
                    article.content.should.equal('Article Content');

                    done();
                });
            });

            it('should show an error when try to update without a user', function (done) {
                var data = {
                    title: 'New Title'
                };
                Service.update(tmpArticleId, data, {}, function(err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('You need to be authenticated');
                    done();
                });
            });

            it('should show an error when try to update with an invalid article id', function (done) {
                var data = {
                    title: 'New Title'
                };
                Service.update('blub', data, {user:user}, function(err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('Can not update article');
                    done();
                });
            });

            it('should show an error when try to update with an invalid article id', function (done) {
                var data = {
                    title: 'New Title'
                };
                Service.update(tmpArticleId, data, {user: unauthorizedUser}, function(err) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('Can not update article, not authorized');
                    done();
                });
            });
        });

        describe('Method Get', function() {

            var tmpArticleId = null;

            beforeEach(function(done) {
                var data = {
                    title: 'Article Title',
                    content: 'Article Content'
                };
                Service.create(data, {user: user}, function (err, article) {
                    should.not.exist(err);
                    tmpArticleId = article.id;
                    done();
                });
            });

            it('should be able to get without problems', function (done) {

                Service.get(tmpArticleId, {user:user}, function(err, article) {
                    should.not.exist(err);
                    article.title.should.equal('Article Title');
                    article.content.should.equal('Article Content');
                    done();
                });
            });

            it('should be able to get without problems', function (done) {

                Service.getById(tmpArticleId, function(err, article) {
                    should.not.exist(err);
                    article.id.should.equal(tmpArticleId);
                    article.title.should.equal('Article Title');
                    article.content.should.equal('Article Content');
                    done();
                });
            });

            it.only('should show an error when try to get with an invalid article id', function (done) {

                Service.getById('123456789123456789123456', function(err) {
                    should.exist(err);
                    err.message.should.equal('Failed to load article 123456789123456789123456');
                    done();
                });
            });
        });

        describe('Method Find', function() {

            beforeEach(function(done) {
                var data = {
                    title: 'First Article Title',
                    content: 'FirstArticle Content'
                };
                Service.create(data, {user: user}, function (err) {
                    should.not.exist(err);
                    var data = {
                        title: 'Second Article Title',
                        content: 'Second Article Content'
                    };
                    Service.create(data, {user: user}, function (err) {
                        should.not.exist(err);
                        done();
                    });
                });

            });

            it('should be able to find without problems', function (done) {

                Service.find({user:user}, function(err, articles) {
                    should.not.exist(err);
                    articles.should.be.length(2);
                    done();
                });
            });

            it('should be able to find only one without problems', function (done) {

                Service.find({title: 'Second Article Title'}, function(err, articles) {
                    should.not.exist(err);
                    articles.should.be.length(1);
                    articles[0].title.should.equal('Second Article Title');
                    done();
                });
            });

            it('should find nothing', function (done) {

                Service.find({abc: 'xyz'}, function(err, articles) {
                    should.exist(err);
                    err.should.be.Error;
                    err.message.should.equal('Articles not found');
                    done();
                });
            });

        });

        afterEach(function(done) {
            cleanup();
            done();
        });
    });
});