// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the rendering logic for the authentication page

const {logger} = require("../logging");
const bcrypt = require("bcrypt");
const {User} = require("../db/schemaDef");
const {v4: uuidv4} = require("uuid");
const sanitizeHtml = require("sanitize-html");

exports.renderAuthPage = function (req, res) {
    res.render('index', {message: ''});
    logger.info('[Auth] Rendered page');
};

exports.performRegistration = function (req, res) {
    const {username, password, role} = req.body;

    const _username = sanitizeHtml(username);
    const _password = sanitizeHtml(password);

    logger.info(`[Auth] Attempting to register ${_username}`)

    // First check if user exists in DB
    User.findOne({username: _username})
        .then(existingUser => {
            if (existingUser) {
                return Promise.reject('Username already exists');
            } else {
                return bcrypt.hash(_password, 10);
            }
        })
        .then(hashedPassword => {
            const newUser = new User({
                userId: uuidv4(),
                username: _username,
                password: hashedPassword,
                role: role || 'admin' // Default role is 'admin' if not provided
            });
            return newUser.save();
        })
        .then(savedUser => {
            logger.info(`[Auth] User registered successfully`);
            res.render('index', {message: 'Registration successful. Please log in.'});
        })
        .catch(error => {
            if (typeof error === "string") {
                logger.warn(`[Auth] Error during register: ${error}`);
                res.render('index', {message: error});
            } else {
                logger.error(`[Auth] Error during register: ${error.message}`);
                res.render('index', {message: 'Error during register. Please try again'});
            }
        });
};


exports.performSignIn = function (req, res) {
    const {username, password} = req.body;

    const _username = sanitizeHtml(username);
    const _password = sanitizeHtml(password);

    logger.info(`[Auth] Attempting to sign in ${_username}`)


    User.findOne({username: _username}).then(user => {
        if (user) {
            return bcrypt.compare(_password, user.password).then(isPwdMatch => {
                if (!isPwdMatch) {
                    return Promise.reject('Invalid username or password');
                } else {
                    return user
                }
            });
        } else {
            return Promise.reject('Username not found');
        }
    }).then(user => {
        req.session.user = _username;
        req.session.accessLevel = user.role;

        logger.info(`[Auth] User signed in successfully`);

        if (user.role === 'admin') {
            res.redirect("app/manage")
        } else {
            res.redirect("app/display")
        }
    }).catch(error => {
        if (typeof error === "string") {
            logger.warn(`[Auth] Error during sign in: ${error}`);
            res.render('index', {message: error});
        } else {
            logger.error(`[Auth] Error during sign in: ${error.message}`);
            res.render('index', {message: 'Error during sign in. Please try again'});
        }
    });
};

exports.signOut = function (req, res) {
    req.session.destroy();
    logger.info('[Auth] Logged out');
    res.redirect("/")

};


