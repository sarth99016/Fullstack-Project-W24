// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the middlewares used in the application

const { logger } = require("./logging");

// Routes that are accessible only to admins
const adminOnlyRoutes = ["/app/manage", "/app/addcar", "/app/deletecar"];

// Middleware for logging endpoint requests
exports.endpointLoggingMiddleware = function (req, res, next) {
    // Log the HTTP method and URL of the incoming request
    logger.info(`${req.method} ${req.url}`);
    next(); // Proceed to the next middleware in the chain
};

// Middleware for logging errors
exports.errorLoggingMiddleware = function (err, req, res, next) {
    // Log error details including status code, message, URL, method, and IP address
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500); // Set HTTP status code based on error or default to 500
    res.render('error', { error: err }); // Render an error page with the error object
};

// Middleware for protecting routes that require authentication
exports.protectedRoutesMiddleware = function (req, res, next) {
    // Check if the requested URL starts with '/app'
    if (req.originalUrl.startsWith('/app')) {
        const user = req.session.user || null; // Get user from session or set to null
        // If user is not authenticated, redirect to login page
        if (user === null) {
            logger.warn(`Access control - Deny - Unauthenticated - [${req.method}] ${req.url}`);
            return res.redirect("/");
        } else {
            const accessLevel = req.session.accessLevel || null; // Get user access level from session
            // If requested URL is in admin-only routes and user is not an admin, deny access
            if (adminOnlyRoutes.includes(req.originalUrl) && accessLevel !== 'admin') {
                logger.warn(`Access control - Deny - Insufficient access - [${req.method}] ${req.url}`);
                return res.status(401).send('Sorry, you are not an admin!');
            }
        }
        logger.info(`Access control - Allow - [${req.method}] ${req.url}`);
    }
    next(); // Proceed to the next middleware in the chain
};
