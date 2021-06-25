const titles = require('../models/titles');
const Title = require('../models/titles');
const fetch = require('node-fetch');

// https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=1

// https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1

// https://api.themoviedb.org/3/movie/upcoming?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1

// Tv
// https://api.themoviedb.org/3/tv/latest?api_key=f4278fc5b9413965242b5e22893f273&language=en-US
// https://api.themoviedb.org/3/tv/popular?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1
// https://api.themoviedb.org/3/tv/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&page=1

// https://api.themoviedb.org/3/watch/providers/regions?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        // https://api.themoviedb.org/3/movie/{movie_id}/images?api_key=<<api_key>>&language=en-US
        .then(response => response.json())
        .then(titles => {
            res.render('pages/home', {
                popularMovieList: titles.results,
                currentPage: page,
                hasPrevious: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                path: '/',
                pageTitle: 'Home'
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getNewest = (req, res, next) => {
    const page = req.params.page || 1;
    const offset = 10 * (page - 1);
    // fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f273&language=en-US&${page}`)


};

exports.getPopular = (req, res, next) => {

};

exports.getTopRated = (req, res, next) => {

};

exports.getMylist = (req, res, next) => {

};

exports.postDeleteList = (req, res, next) => {

};

exports.postTitle = (req, res, next) => {

};

exports.getTitleDetails = (req, res, next) => {
    // get movie id from the URL. Im not sure how to do
    // this without the URL saying ?id=####### but once
    // the id is found check the database for a match
    // to see if the movie is already in the database
    // if not then add it. Idk when we would use the 
    // id provided to us by mongodb (_id). Maybe we
    // could use that somehow. Then use that id to
    // fetch the rest of the data about the movie
    // that we want to display such as title and 
    // description and then have a button that 
    //adds that movie to the user's movie list.
    const titleId = req.params.titleId; 
    fetch(`https://api.themoviedb.org/3/movie/${titleId}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US`)
        .then(response => response.json())
        .then(title => {
            console.log(title);
            res.render('pages/mediaDetails', {
                titleId: titleId,
                path: '/title/:titleId',
                pageTitle: 'Movie Details',
                movieDetails: title
        
            });
        })
        .catch(err => {
            console.log(err);
        })
    // res.render('pages/mediaDetails', {
    //     titleId: titleId,
    //     path: '/title/:titleId',
    //     pageTitle: 'Movie Details'

    // });

};

exports.postDeleteTitle = (req, res, next) => {

};
