'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Service = require('../../../app/services/articles');

//Globals
var user;

//The tests
describe('Unit Test', function() {
    describe('Service Article:', function() {
        beforeEach(function(done) {
            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
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
                    done();
                })
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
                })
            });

            it('should show an error when try to remove without a user', function (done) {
                Service.remove(tmpArticleId, {}, function(err) {
                    should.exist(err);
                    done();
                })
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
                }
                Service.update(tmpArticleId, data, {user:user}, function(err, article) {
                    should.not.exist(err);
                    article.title.should.equal('New Title');
                    article.content.should.equal('Article Content');

                    done();
                })
            });

            it('should show an error when try to update without a user', function (done) {
                var data = {
                    title: 'New Title'
                }
                Service.update(tmpArticleId, data, {}, function(err, article) {
                    should.exist(err);
                    done();
                })
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
                })
            });

            it('should be able to get without problems', function (done) {

                Service.getById(tmpArticleId, function(err, article) {
                    should.not.exist(err);
                    article.id.should.equal(tmpArticleId);
                    article.title.should.equal('Article Title');
                    article.content.should.equal('Article Content');
                    done();
                })
            });
        });

        afterEach(function(done) {
            user.remove();
            done();
        });
    });
});