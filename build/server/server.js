var express = require("express");
var fallback = require("express-history-api-fallback");
var helmet = require("helmet");
var fs = require("fs");
var path = require("path");

// Create application
var app = express();

// Configure application security with Helmet
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());

// Manage CSP Policy for Creator Application only
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            fontSrc: [
                "'self' static2.sharepointonline.com use.typekit.net static.fast.design c.s-microsoft.com",
            ],
            frameAncestors: [`'self' ${process.env.FRAME_ANCESTOR_PARTNER}`],
            imgSrc: ["'self' blob: data: *.fast.design via.placeholder.com"],
            scriptSrc: ["'self' 'unsafe-eval'"],
            styleSrc: ["'self' https: 'unsafe-inline'"],
        },
    })
);

// Set public directory
var publicDir = path.resolve(__dirname);

// Set static application options
app.use("/", express.static(publicDir));

// Set fallback application options
app.use(fallback("index.html", { root: publicDir }));

// Manage search engine crawlers, never crawl while private
fs.writeFile("robots.txt", "User-agent: *\r\nDisallow: /", function (err) {
    if (err) throw err;
});

// Serve up application on specified port
var port = process.env.PORT || 7001;
app.listen(port);
