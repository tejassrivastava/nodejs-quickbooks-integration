var tools = require('../tools/tools.js')
var config = require('../config.json')
var request = require('request')
var express = require('express')
var router = express.Router()

/** /emp_call **/
router.get('/', function (req, res) {
    var token = tools.getToken(req.session)
    if(!token) return res.json({error: 'Not authorized'})
    if(!req.session.realmId) return res.json({
        error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
    })

    // Set up API call (with OAuth2 accessToken)
    var url = config.api_uri + req.session.realmId + '/query/' + '?query=select%20%2a%20from%20Employee&minorversion=4'
    console.log('Making API call to: ' + url)
    var requestObj = {
        url: url,
        headers: {
            'Authorization': 'Bearer ' + token.accessToken,
            'Accept': 'application/json'
        }
    }

    // Make API call
    request(requestObj, function (err, response) {
        // Check if 401 response was returned - refresh tokens if so!
        tools.checkForUnauthorized(req, requestObj, err, response).then(function ({err, response}) {
            if(err || response.statusCode != 200) {
                return res.json({error: err, statusCode: response.statusCode})
            }

            // API Call was a success!
            res.json(JSON.parse(response.body))
        }, function (err) {
            console.log(err)
            return res.json(err)
        })
    })
})

module.exports = router
