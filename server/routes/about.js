// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the rendering logic for tje about us page

const {logger} = require("../logging");

exports.renderAboutPage = function (req, res) {
    res.render('about', {message: ''});
    logger.info('[About] Rendered page');
};