/**
 * Contains the Openapi json file.
 */
class SwaggerController {
    
    /**
     * This renders the Swagger documentation page.
     * @param req request
     * @param res response
     */
    index(req, res) {
        const path = require('path');
        const viewsDir = path.join(__dirname, '../views/docs/');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.sendFile(viewsDir + 'index.html');
    }

    /**
     * Returns the Swagger json file.
     *
     * @param req request body
     * @param res Response.
     */
    fetch(req, res) {
        const swaggerJSDoc = require('swagger-jsdoc');

        const options = {
            definition: {
                openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
                info: {
                    title: 'Shmoogle world api',
                    version: '1.0.0',
                },  
            },
            apis: ['./**/CustomSearchController.js','./**/SearchController.js','./**/ImagesController.js'],
        };
        res.json(swaggerJSDoc(options));
    }
}

module.exports = SwaggerController;