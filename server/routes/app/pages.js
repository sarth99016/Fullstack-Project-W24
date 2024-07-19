// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the page rendering logic for the protected pages

const {logger} = require("../../logging");
const {Car} = require("../../db/schemaDef");


exports.renderHomePage = function (req, res) {
    const accessLevel = req.session.accessLevel

    res.render('home', {accessLevel: accessLevel});
    logger.info('[Home] Rendered page');
};

exports.renderManagePage = function (req, res) {
    Car.find()
        .then((cars) => {
            const accessLevel = req.session.accessLevel
            res.render("manage", {cars: cars,accessLevel: accessLevel});
            logger.info('[Manage cars] Rendered page');
        })
        .catch((err) => {
            logger.error(`Error displaying cars: ${err.message}`);
            res.status(500).send("Internal Server Error");
        });
};

exports.renderDisplayPage = function (req, res) {
    Car.find()
        .then((cars) => {
            const accessLevel = req.session.accessLevel
            res.render("display", {cars: cars, params: {},accessLevel: accessLevel});
            logger.info('[Display cars] Rendered page');

        })
        .catch((err) => {
            logger.error(`Error displaying cars: ${err.message}`);
            res.status(500).send("Internal Server Error");
        });
};

exports.renderSearchPage = function (req, res) {

    const dbQueryParams = {}
    const searchInRegex = (pattern) => new RegExp(`.*${pattern}.*`);

    const keywordParameters = ["make", "model", "color", "fuelType", "transmission", "engineType"]

    for (const param of keywordParameters) {
        if (param in req.query && req.query[param]) {
            dbQueryParams[param] = {$regex: searchInRegex(req.query[param]), $options: "i"}
        }
    }

    dbQueryParams['price'] = {
        $lte: parseInt(req.query['toPrice']) || 1000000000,
        $gte: parseInt(req.query['fromPrice']) || 0
    }
    dbQueryParams['year'] = {
        $lte: parseInt(req.query['toYear']) || 1000000000,
        $gte: parseInt(req.query['fromYear']) || 0
    }
    dbQueryParams['mileage'] = {
        $lte: parseInt(req.query['toMileage']) || 1000000000,
        $gte: parseInt(req.query['fromMileage']) || 0
    }

    Car.find(dbQueryParams)
        .then((cars) => {
            const accessLevel = req.session.accessLevel
            res.render("display", {cars: cars, params: req.query,accessLevel: accessLevel});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Internal Server Error");
        });
};

exports.renderAddCarPage = function (req, res) {
    res.render('addcar');
    logger.info('[Add car] Rendered page');
};