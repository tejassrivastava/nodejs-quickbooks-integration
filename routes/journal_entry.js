var tools = require('../tools/tools.js')
var config = require('../config.json')
var request = require('request')
var express = require('express')
var router = express.Router()


var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');

// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_PATH = 'token.json';

// Route to get journalEntry from UI.

router.get('/', function (req, res) {

    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listMajors);
    });

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {
        var {client_secret, client_id, redirect_uris} = credentials.installed;
        var oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback for the authorized client.
     */
    function getNewToken(oAuth2Client, callback) {
        var authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) console.error(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    /**
     * Prints the names and majors of students in a sample spreadsheet:
     * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
     * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
     */
    function listMajors(auth) {
        var sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
            spreadsheetId: config.sheetId, // Google Sheet ID configurable through config.json
            range: config.sheetName,  // Google Sheet Worksheet Name configurable through config.json
        }, (errg, resp) => {
            if (errg) return console.log('The API returned an error: ' + errg);

            //console.log("ResData::",resp.data.values);

            // Fetching all records from google sheets and storing in data field.
            var data = resp.data.values;
            if (data) {



                // Reading data Row wise

                // Parsing All Non data column

                // Parsing Account Names : Row 1 in sheet
                var jAcc = data[0];
                 //console.log("jAcc:",jAcc);

                // Parsing Account Numbers as in quickbooks : Row 2 in sheet
                var jAccNum = data[1];
                //console.log("jAccNum:",jAccNum);

                // Parsing Account Type i.e. Debit/Credit : Row 3 in sheet
                var jAccType = data[2];
                //console.log("jAccType:",jAccType);

                // Parsing Account Description : Row 4 in sheet
                var jAccDesc = data[3];
                //console.log("jAccDesc:",jAccDesc);

                // Parsing all employee data i.e. all rows after first four rows.
                var empData = data.slice(4,data.length);

                // console.log("empData: ",empData);

                //    console.log("Data::",data);

                var fdata = [];
                for(var i = 0 ; i<empData.length;i++)
                { var arr = [];
                    var myMap = {};

                    var a = [];

                    for (var j = 0; j<empData[i].length;j++)
                    {
                        // console.log(jAcc[j],"-->",jAccNum[j], "-->", empData[i][j]);
                        var myMap1 = new Map();

                        myMap1.set("jAcc",jAcc[j]);
                        myMap1.set("jAccNum",jAccNum[j]);

                        var j1 = {"jAcc":jAcc[j],"jAccNum":jAccNum[j]};

                        a.push(j1);



                        //console.log(jAcc[j],"-->",empData[i][j]);



                    }
                    myMap = {"Ac":a,"empData":empData[i]};

                    //myMap.set("Ac",a);


                    //myMap.set("empData",empData[i]);
                    fdata.push(myMap);


                    // console.log("Arr::",arr);
                    // fdata.push(arr);
                }
               //  console.log("Final Data::",fdata);


                // Forming json data from row wise data
                var odata = [];
                for(var i = 0; i<fdata.length;i++)
                {
                    var q = [];
                    for(var j =0;j<fdata[i]["Ac"].length;j++)
                    {
//            console.log("Id:",fdata[i]["empData"][j]);
                        //console.log(fdata[i]["empData"][j],"-->",fdata[i]["Ac"][j]);
                        // console.log(fdata[i]["empData"][j],"-->",fdata[i]["Ac"][j]);
                     /*   console.log("Class::",fdata[i][j]["Class"])*/
                        var x = {"Amount" : fdata[i]["empData"][j],
                            "jAcc" : fdata[i]["Ac"][j]["jAcc"],
                            "jAccNum" : fdata[i]["Ac"][j]["jAccNum"],
                            "Description" : jAccDesc[j],
                            "Type" : jAccType[j]

                        }
                        q.push(x);
                         /* console.log("X::",q[j].Type);
                          console.log("**************");*/

                    }
                    odata.push(q);
                    console.log("__________________________________________");
                }
              //  console.log("Odata::",odata);
                /*
                    { Amount: '0',
                        jAcc: 'Arrear of salary',
                        jAccNum: '154',
                        Description: 'Arrears',
                        Type: 'Debit' },
                */

                /*console.log("Odata::",odata);*/

                // Forming Journal Entry Lines

                var myd = [];
                var jEner = [];
                for(var i = 0;i<odata.length;i++)
                {var pushData = {

                    "TxnDate":"",
                    "Line": []

                };
                    var pd;
                    for (var j =0;j<odata[i].length;j++)
                    {
                        //console.log("Odata::",odata[i][j]["jAcc"]);

                        /* var id  ;

                         if(odata[i][j]["jAcc"] == "JournalEntryId")
                         {
                             id = odata[i][j]["Amount"];
                         }
                         console.log("Id::",id);


                            var Description = odata[i][j]["Description"];

                         console.log("Description::",Description);*/
                        var id  ; // Journal Entry ID
                        var clv;  // Class Value
                        var cln;  // Class Name
                        var dpv;  // Department Value
                        var dpn;  // Department Name
                        var eid;  // Entity Ref ID
                        var ename; // Entity Ref Name
                        var txnDate; // Transaction Date
                        var balancedStatus;

                        // Checking if the entry is balanced or not.

                        if(odata[i][j]["jAcc"] == "Balanced")
                        {
                            console.log("BALANCED::",odata[i][j]["Amount"])
                            if(odata[i][j]["Amount"] == 0)
                            {
                                console.log("Entry "+(i+1)+" Is Balanced");

                                jEner.push({"Message":"Entry "+(i+1)+" Is Balanced"});
                            }
                            else {
                                console.log("Entry "+(i+1)+" Is Not Balanced");
                                jEner.push({"Message":"Entry "+(i+1)+" Is Not Balanced"});
                            }
                        }
                       /* if(odata[i][j]["jAcc"] == "Balanced" && balancedStatus == 0)
                        {
                            console.log("Entry Is Balanced")
                        }
                        else {
                            console.log("Entry Is Noy Balanced")
                        }*/
                        if(odata[i][j]["jAcc"] == "TxnDate")
                        {
                            txnDate = odata[i][j]["Amount"];
                        }
                        if(odata[i][j]["jAcc"] == "Entity Ref: Value")
                        {
                            eid = odata[i][j]["Amount"];
                        }
                        if(odata[i][j]["jAcc"] == "Entity Ref: Name")
                        {
                            ename = odata[i][j]["Amount"];
                        }

                        if(odata[i][j]["jAcc"] == "JournalEntryId")
                        {
                            id = odata[i][j]["Amount"];
                        }
                        if(odata[i][j]["jAcc"] == "Class Value")
                        {
                            clv = odata[i][j]["Amount"];
                        }

                        if(odata[i][j]["jAcc"] == "Class Name")
                        {
                            cln = odata[i][j]["Amount"];
                        }

                        if(odata[i][j]["jAcc"] == "Dep Value")
                        {
                            dpv = odata[i][j]["Amount"];
                        }

                        if(odata[i][j]["jAcc"] == "Dep Name")
                        {
                            dpn = odata[i][j]["Amount"];
                        }


                       /* console.log('Class::',clv);*/

                            pd=
                                {
                                    "Id":id,
                                    "Description": odata[i][j]["Description"],
                                    "Amount": odata[i][j]["Amount"],
                                    "DetailType": "JournalEntryLineDetail",
                                    "JournalEntryLineDetail": {
                                        "PostingType": odata[i][j]["Type"] ,
                                        "Entity": {
                                            "Type": "Employee",
                                            "EntityRef": {
                                                "value": eid,
                                                "name": ename
                                            }
                                        },

                                        "ClassRef": {

                                            "value": clv,

                                            "name": cln

                                        },

                                        "DepartmentRef": {

                                            "value": dpv,

                                            "name": dpn

                                        },

                                        "AccountRef": {
                                            "value": odata[i][j]["jAccNum"],
                                            "name": odata[i][j]["jAcc"]
                                        }
                                    }
                                }




                        //   console.log("PushData::",JSON.stringify(pd));
                        if(j >= 12){
                            //console.log(eid,ename,id,clv,cln,dpv,dpn);
                            pushData.Line.push(pd);
                            pushData.TxnDate = txnDate;
                        }
                    }
console.log("_____________________________");
                    myd.push(pushData);

                }

                //console.log("Data::", JSON.stringify(myd) );
              /*  console.log("QKD1::",JSON.stringify(pushData.Line[0]) )*/


                /* **********************************
                  Pushing Data To QuickBooks
              ************************************* */

                  var token = tools.getToken(req.session)
                  if(!token) return res.json({error: 'Not authorized'})
                  if(!req.session.realmId) return res.json({
                      error: 'No realm ID.  QBO calls only work if the accounting scope was passed!'
                  })

                  // Set up API call (with OAuth2 accessToken)
                for(var i =0;i<myd.length;i++)
                {
                  var url = config.api_uri + req.session.realmId + '/journalentry?minorversion=4'
                  console.log('Making API call to: ' + url)
                  var requestObj = {
                      url: url,

                      headers: {
                          'Authorization': 'Bearer ' + token.accessToken,
                          'Accept': 'application/json'
                      },
                     json: myd[i]
                }


                  /*console.log("ReqObj::",requestObj);*/
                  // Make API call
                  request.post(requestObj, function (err, response) {
                      // Check if 401 response was returned - refresh tokens if so!
                      tools.checkForUnauthorized(req, requestObj, err, response).then(function ({err, response}) {
                          if(err || response.statusCode != 200) {
                              console.log("Error::",err);
                              console.log("Response::",JSON.stringify(response.body));
                              return res.json({error: err, statusCode: response.statusCode,"errorMessage":jEner})
                          }

                          // API Call was a success!
                          console.log("Quick Book : JournalEntry Successful :: ");
                         /* console.log("Quick Book : JournalEntry Success :: ",response.body);*/
                          //res.end()
                          return res.json({"Status":"Journal Entry Successful"})
                      }, function (err) {
                          console.log(err)
                          //res.end()
                          return res
                      })
                  })


            }
            }





            else {
                console.log('No data found.');
            }
        });


    }
 /*   res.json(JSON.parse(res.code))*/
})

module.exports = router