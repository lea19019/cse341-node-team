const titleList = require('../models/titles');
// const Title = require('../models/titles');
const fetch = require('node-fetch');
const User = require('../models/user');

exports.getIndex = (req, res, next) => { 
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(titles => {
            // console.log(titles)
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

exports.getUpcoming = (req, res, next) => {
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(titles => {
            // console.log(titles)
            res.render('pages/upcoming', {
                upcomingList: titles.results,
                currentPage: page,
                hasPrevious: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                path: '/',
                pageTitle: 'Upcoming Movies'
            });
        })
        .catch(err => {
            console.log(err);
        })

};


exports.getNowPlaying = (req, res, next) => {
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(titles => {
            // console.log(titles)
            res.render('pages/now-playing', {
                nowPlayingList: titles.results,
                currentPage: page,
                hasPrevious: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                path: '/',
                pageTitle: 'Now Playing'
            });
        })
        .catch(err => {
            console.log(err);
        })

};


exports.getTopRated = (req, res, next) => {
    const page = +req.query.page || 1;
    const offset = 10 * (page - 1);
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&page=${page}`)
        .then(response => response.json())
        .then(titles => {
            // console.log(titles)
            res.render('pages/top-rated', {
                topRatedList: titles.results,
                currentPage: page,
                hasPrevious: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                path: '/',
                pageTitle: 'Top Rated'
            });
        })
        .catch(err => {
            console.log(err);
        })

};

exports.getMylist = (req, res, next) => {
    const userId = req.user._id
    const firstName = req.user.firstName;
    const lastName = req.user.lastName;

    //maybe should be like getProducts in the shop


    titleList.findOne({ userId: req.user._id })
        .then(data => {
            const titles = data.titles;
            console.log(titles);
            res.render('pages/userList', {
                path: '/my-list/:userId',
                pageTitle: "My List",
                titles: titles,
                firstName
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });


};

exports.postDeleteList = (req, res, next) => {

};

exports.postList = async (req, res, next) => {
    const title = req.body.movieTitle;
    const release = req.body.release;
    const movieId = req.body.titleId;
    const image = req.body.image;
    const userId = req.user._id;

    try {
        // Let's check if the user has already created a list
        const result = await titleList.findOne({ userId: userId });

        // If he hasn't let's create one for him and add his title.
        if (!result) {
            const newList = new titleList({
                titles: [{
                    title,
                    movieId: movieId,
                    poster_path: image,
                    release: release,
                    isViewed: false
                }],
                userId
            });

            const createList = await newList.save();
            return res.redirect('/my-list/:userId'); // Redirect the user to his list
        };

        const titleResult = await titleList.find({ userId: userId, "titles.movieId": movieId });

        if (titleResult.length !== 0) {
            // Tell the user he has that title in his list
            // Maybe redirect?
            res.redirect('/my-list/:userId'); // Redirect the user to his list
            return;
        }

        const newTitle = {
            title,
            movieId: movieId,
            poster_path: image,
            release: release,
            isViewed: false
        };

        const addTitle = await titleList.update({ userId: userId }, { $push: { titles: newTitle } });
        if (addTitle.ok) {
            res.redirect('/my-list/:userId'); // Redirect the user to his list
            return;
        }

    } catch (err) {
        error.httpStatusCode = 500;
        return next(error);
    };
};



exports.getTitleDetails = (req, res, next) => {
    const titleId = req.params.id;
    //const imdb_id = req.body.imdb_id;
    fetch(`https://api.themoviedb.org/3/movie/${titleId}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US`)

        .then(response => {
            // console.log(response);
            return response.json();
        })
        .then(title => {
            // console.log(title);
            const id = title.imdb_id;
            fetch(`https://api.themoviedb.org/3/find/${id}?api_key=f4278fc5b9413965242b5e22893f2738&language=en-US&&external_source=imdb_id`)
                .then(response => {
                    // console.log(response);
                    return response.json();
                })
                .then(data => {
                    // console.log(data);
                    res.render('pages/media-details', {
                        movieTitle: data.movie_results[0].title,
                        //tvShowResults: titles.tv_shows_results,
                        path: '/title/:id',
                        pageTitle: 'Movie Details',
                        movieDetails: data.movie_results[0].overview,
                        ratings: data.movie_results[0].vote_average,
                        release: data.movie_results[0].release_date,
                        image: data.movie_results[0].poster_path,
                        gallery: data.movie_results[0].backdrop_path,
                        titleId: titleId

                    });


                })
                .catch(err => {
                    console.log(err)
                })


        })
        .catch(err => {
            console.log(err);
        })


};

exports.postDeleteTitle = (req, res, next) => {
    const titleId = req.body.titleId;
    titleList.findById(titleId)
        .then(title => {
            if (!title) {
                return next(new Error('No Title Found!'));
            }
            return titleList.deleteOne({ _id: titleId, userId: req.user._id });
        }).then(() => {
            console.log('TITLE DELETED!');
            res.redirect('/my-list/:userId')
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });

};


exports.postSearch = async (req, res, next) => {
    const page = +req.query.page || 1;
    const query = req.body.title;
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
        const data = await response.json();
        res.render('pages/search', {
            popularMovieList: data.results,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: page < data.total_pages,
            previousPage: page - 1,
            nextPage: page + 1,
            lastPage: data.total_pages,
            path: '/',
            pageTitle: 'Home',
            query
        });

    } catch (err) {
        throw err;
    }
};

exports.getSearch = async (req, res, next) => {
    const page = +req.query.page || 1;
    const query = req.query.title;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=f4278fc5b9413965242b5e22893f2738&query=${query}&language=en-US&page=${page}`);
        const data = await response.json();
        console.log(data);
        res.render('pages/search', {
            popularMovieList: data.results,
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: page < data.total_pages,
            previousPage: page - 1,
            nextPage: page + 1,
            lastPage: data.total_pages,
            path: '/',
            pageTitle: 'Home',
            query,

        });

    } catch (err) {
        throw err;
    }
};