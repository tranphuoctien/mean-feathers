/*global io*/
'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Global', 'Articles', function ($scope, $stateParams, $location, Global, Articles) {
    $scope.global = Global;


    var socket = io.connect('http://localhost:3000/');
    socket.on('articles created', function () {
        $scope.find();
    });
    socket.on('articles updated', function () {
        $scope.find();
    });
    socket.on('articles removed', function () {
        $scope.find();
    });

    $scope.create = function () {

        socket.emit('articles::create', {
            title: this.title,
            content: this.content
        }, {}, function (error, article) {
            new Articles(article).$save(function (response) {
                $location.path('articles/' + response._id);
            });
        });

        this.title = '';
        this.content = '';
    };

    $scope.remove = function (article) {
        if (article) {
            article.$remove();

            for (var i in $scope.articles) {
                if ($scope.articles[i] === article) {
                    $scope.articles.splice(i, 1);
                }
            }
        }
        else {
            socket.emit('articles::remove', $scope.article._id, {}, function (err) {
                console.log('TODO handle error', err);
                //TODO handle error
            });
//            $scope.article.$remove();
            $location.path('articles');
        }
    };

    $scope.update = function () {
        var article = $scope.article;
        if (!article.updated) {
            article.updated = [];
        }
        article.updated.push(new Date().getTime());

        socket.emit('articles::update', article._id, {
            title: article.title,
            content: article.content
        }, {}, function (err) {
            console.log('TODO handle error', err);
            //TODO handle error
        });
        $location.path('articles/' + article._id);


//        article.$update(function() {
//            $location.path('articles/' + article._id);
//        });
    };

    $scope.find = function () {
        Articles.query(function (articles) {
            $scope.articles = articles;
        });
    };

    $scope.findOne = function () {
        Articles.get({
            articleId: $stateParams.articleId
        }, function (article) {
            $scope.article = article;
        });
    };
}]);
