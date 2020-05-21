const https = require('https');

/**
* Function returns a promise contains the response of the get response.
* @namespace get
* @param {string} url The url that we want to call
* @return {string} returns the string that response of the https.get function
**/
module.exports.get = async function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
        const { statusCode } = res;
        const contentType = res.headers['content-type'];
        
        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                            `Status Code: ${statusCode}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            res.resume();
            reject(error);
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
            } catch (e) {
                reject(e);
            }
        });
        }).on('error', (e) => {
            reject(e);
        });
    });
}