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
            //res.json(JSON.parse(response.body))

            var resData = {
                "QueryResponse": {
                    "Employee": [
                        {
                            "EmployeeNumber": "1802",
                            "BillableTime": false,
                            "Gender": "Female",
                            "domain": "QBO",
                            "sparse": false,
                            "Id": "17",
                            "SyncToken": "0",
                            "MetaData": {
                                "CreateTime": "2018-08-21T03:47:06-07:00",
                                "LastU pdatedTime": "2018-08-21T03:47:06-07:00"
                            },
                            "Title": "Mrs",
                            "GivenName": "Poonam",
                            "DisplayName": "Poonam",
                            "PrintOnCheckName": "Poonam",
                            "Active": true
                        },
                        {
                            "EmployeeNumber": "1801",
                            "BillableTime": false,
                            "BillRate": 0,
                            "Gender": "Male",
                            "domain": "QBO",
                            "sparse": false,
                            "Id": "15",
                            "SyncToken": "1",
                            "MetaData": {
                                "CreateTime": "2018-08-21T03:37:30-07:00",
                                "LastUpdatedTime": "2018-08-21T03:40:51-07:00"
                            },
                            "Title": "Mr",
                            "GivenName": "Tejas",
                            "FamilyName": "Srivastava",
                            "DisplayName": "Tejas Srivastava",
                            "PrintOnCheckName": "Tejas Srivastava",
                            "Active": true,
                            "Mobile": {
                                "FreeFormNumber": "9454114073"
                            },
                            "PrimaryEmailAddr": {
                                "Address": "tejas.srivastava@fosteringlinux.com"
                            }
                        },
                        {
                            "SSN": "XXX-XX-XXXX",
                            "BillableTime": false,
                            "BillRate": 0,
                            "Gender": "Male",
                            "HiredDate": "2020-04-01",
                            "domain": "QBO",
                            "sparse": false,
                            "Id": "18",
                            "SyncToken": "0",
                            "MetaData": {
                                "CreateTime": "2018-08-28T01:11:30-07:00",
                                "La stUpdatedTime": "2018-08-28T01:11:30-07:00"
                            },
                            "GivenName": "dummy",
                            "FamilyName": "twenty",
                            "DisplayName": "dummy twenty",
                            "PrintOnCheckName": "dummy twenty",
                            "Active": true
                        }
                    ],
                    "startPosition": 1,
                    "maxResults": 3
                },
                "time": "20 18-08-29T10:39:46.655-07:00"
            }


            var d = resData.QueryResponse.Employee;
            res.render('empdata',{result:d})
        }, function (err) {
            console.log(err)
            return res.json(err)
        })
    })
})

module.exports = router
