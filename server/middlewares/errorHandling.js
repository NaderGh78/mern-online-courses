const notFound = ((req, res, next) => {

    const error = new Error(`Not found - ${req.originalUrl}`);

    res.status(404);

    next(error);

});

const errorHandling = ((err, req, res, next) => {

    const statusCode = req.statusCode === 200 ? 500 : req.statusCode;

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });

});

/*===========================================*/

module.exports = { notFound, errorHandling }