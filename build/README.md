This folder represents deployable resources.

All files in the `/server` subfolder are copied as part of the build process and compiled along with the application code to be deployed on Azure App Services.

The `server.js` file is used used as the Node startup file for website execution. This files contains secrets that require additional explanation and are included via the Node process.

*Application Setting Variables*
* `${process.env.FRAME_ANCESTOR_PARTNER}`: This variable includes values as domain names for use in embedded application scenarios. For example, the value may be `https://subdomain.domain.com` used as a Content Security Policy attribute for [`frameAncestors`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors).

* `process.env.PORT`: This variable includes the port used by the application service, if it exists and differs from the default.

*Server Setting Variables*
* `process.env.WEBSITE_HOSTNAME`: This variable is automatically provided to retrieve the complete hostname of the running application service.  For example, the value maybe `https://stage.subdomain.domain.com`. 

