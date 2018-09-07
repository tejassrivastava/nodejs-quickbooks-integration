var path = require('path')
var config = require('./config.json')
var express = require('express')
var session = require('express-session')
var app = express()
var https = require('https');
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'secret', resave: 'false', saveUninitialized: 'false'}))

app.use("/ed",function(req,res) {

    console.log("In function getCompanyAccountDetails");

    var compDet = {

        "QueryResponse": {

            "Department": [

                {

                    "Name": "DEV",

                    "SubDepartment": false,

                    "FullyQualifiedName": "DEV",

                    "Active": true,

                    "domain": "QBO",

                    "sparse": false,

                    "Id": "2",

                    "SyncToken": "0",

                    "MetaData": {

                        "CreateTime": "2018-09-04T04:39:46-07:00",

                        "LastUpdatedTime": "2018-09-04T04:39:46-07:00"

                    }

                },

                {

                    "Name": "GOV",

                    "SubDepartment": false,

                    "FullyQualifiedName": "GOV",

                    "Active": true,

                    "domain": "QBO",

                    "sparse": false,

                    "Id": "1",

                    "SyncToken": "0",

                    "MetaData": {

                        "CreateTime": "2018-09-04T04:33:05-07:00",

                        "LastUpdatedTime": "2018-09-04T04:33:05-07:00"

                    }

                },

                {

                    "Name": "SMB",

                    "SubDepartment": false,

                    "FullyQualifiedName": "SMB",

                    "Active": true,

                    "domain": "QBO",

                    "sparse": false,

                    "Id": "3",

                    "SyncToken": "0",

                    "MetaData": {

                        "CreateTime": "2018-09-04T04:39:53-07:00",

                        "LastUpdatedTime": "2018-09-04T04:39:53-07:00"

                    }

                }

            ],

            "startPosition": 1,

            "maxResults": 3

        },

        "time": "2018-09-05T04:44:27.554-07:00"

    }



    var accounts = compDet.QueryResponse.Department;

    for(var i=0;i<accounts.length;i++)
    {
        console.log(accounts[i]["Name"],",",accounts[i]["Id"]);




    }
res.end();
})

// Initial view - loads Connect To QuickBooks Button
app.get('/', function (req, res) {


  var d = [{name: 'Sakshi', age : '24'},{name: 'Tejas', age : '25'}]
    /*res.render('empdata',{result:d})*/
  res.render('home', {result:d})
})

app.get('/qk', function (req, res) {
    res.render('qk', config)
})

// Sign In With Intuit, Connect To QuickBooks, or Get App Now
// These calls will redirect to Intuit's authorization flow
app.use('/sign_in_with_intuit', require('./routes/sign_in_with_intuit.js'))
app.use('/connect_to_quickbooks', require('./routes/connect_to_quickbooks.js'))
app.use('/connect_handler', require('./routes/connect_handler.js'))

// Callback - called via redirect_uri after authorization
app.use('/callback', require('./routes/callback.js'))

// Connected - call OpenID and render connected view
app.use('/connected', require('./routes/connected.js'))

// Call an example API over OAuth2
app.use('/api_call', require('./routes/api_call.js'))
app.use('/emp_call', require('./routes/emp_call.js'))
app.use('/journal_entry', require('./routes/journal_entry.js'))
// Start server on HTTP (will use ngrok for HTTPS forwarding)

app.use('/a',function (req,res) {

    console.log("In A");

    var data = [
        [ 'New employment',
        'Emp Id',
        'HiredDate',
        'Entity Ref: Value',
        'Entity Ref: Name',
        'JournalEntryId',
        'EMPLOYEE CTC:Basic Salary',
        'EMPLOYEE CTC:PF Exp',
        'EMPLOYEE CTC:Travelling Allowances',
        'EMPLOYEE CTC:House Rent Allowances',
        'EMPLOYEE CTC:Uniform Allowances',
        'EMPLOYEE CTC:Mobile Allowances',
        'EMPLOYEE CTC:Medical Allowances',
        'EMPLOYEE CTC:Helper Allowances',
        'EMPLOYEE CTC:Daily Allowances',
        'EMPLOYEE CTC:Bonus & Incentive',
        'EMPLOYEE CTC:Special Allowances',
        'EMPLOYEE CTC:ESI Exp.',
        'ESI Payable Employee',
        'PF Payable Employer',
        'Loan to Employee',
        'PF Payable Employee',
        'ESI Payable Employer',
        'Advance for Exam Recoverable',
        'Employee Medical Insurance Receoverable',
        'Advance to Employee',
        'TDS Payable:TDS on Salary',
        'Arrear of salary',
        'Salary Payable' ],
        [ 'Accval',
            '',
            '',
            'NA',
            'NA',
            'NA',
            '125',
            '126',
            '128',
            '137',
            '131',
            '130',
            '127',
            '133',
            '132',
            '134',
            '138',
            '129',
            '147',
            '144',
            '153',
            '145',
            '146',
            '151',
            '149',
            '150',
            '152',
            '154',
            '148' ],
        [ 'Type',
            '',
            '',
            'NA',
            'NA',
            'NA',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Debit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Credit',
            'Debit',
            'Credit' ],
        [ 'Description ',
            '',
            '',
            'NA',
            'NA',
            'NA',
            'Basic Salary For July,18',
            'PF Employer For July,18',
            'Conveyance For July,18',
            'HRA For July,18',
            'Uniform Alowance For July,18',
            'Mobile Allowance For July,18',
            'Medical Allowance For July,18',
            'Helper Allowance For July,18',
            'Daily Allowance For July,18',
            'Bonus and Incentive For July,18',
            'Special Allowance For July,18',
            'Company ESI  July,18',
            'ESI Payable Employee July,18',
            'PF Payable Employer For July,18',
            'LOAN',
            'PF Payable ESI For July,18',
            'ESI Payable Employer For July,18',
            '',
            'Employee Medical Insurance Recoverable For July,18',
            'Advance Adjusted with salary',
            'TDS',
            'Arrears',
            'Salary Payable For July,18' ],
        [ '',
            '2015110101',
            '01 November 2015',
            '4',
            'Arvind',
            '4',
            '9500',
            '1249',
            '1600',
            '3618',
            '1140',
            '1000',
            '1250',
            '0',
            '296.555',
            '791',
            '0',
            '804.935',
            '296.555',
            '1249',
            '',
            '1140',
            '804.935',
            '0',
            '0',
            '0',
            '0',
            '0',
            '15509' ],
        [ '',
            '2015070102',
            '01 July 2015',
            '5',
            'Dinesh kumar',
            '5',
            '23775',
            '1973',
            '1600',
            '11888',
            '1800',
            '1000',
            '1250',
            '225',
            '0',
            '0',
            '4039',
            '0',
            '0',
            '1973',
            '',
            '1800',
            '0',
            '0',
            '225',
            '0',
            '0',
            '0',
            '61102' ]

        ]
    ;

    var jAcc = data[0];
   // console.log("jAcc:",jAcc);

    var jAccNum = data[1];
    //console.log("jAccNum:",jAccNum);

    var jAccType = data[2];
    //console.log("jAccType:",jAccType);

    var jAccDesc = data[3];
    //console.log("jAccDesc:",jAccDesc);

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
//fdata.push(arr);
    }
   // console.log("Final Data::",fdata);
var odata = [];
    for(var i = 0; i<fdata.length;i++)
    {
        var q = [];
        for(var j =0;j<fdata[i]["Ac"].length;j++)
        {
//            console.log("Id:",fdata[i]["empData"][j]);
        //console.log(fdata[i]["empData"][j],"-->",fdata[i]["Ac"][j]);
           // console.log(fdata[i]["empData"][j],"-->",fdata[i]["Ac"][j]);

            var x = {"Amount" : fdata[i]["empData"][j],
                     "jAcc" : fdata[i]["Ac"][j]["jAcc"],
                      "jAccNum" : fdata[i]["Ac"][j]["jAccNum"],
                    "Description" : jAccDesc[j],
                    "Type" : jAccType[j]
            }
            q.push(x);
          //  console.log("X::",q);
        }
        odata.push(q);
        console.log("__________________________________________");
        }
    res.end();
/*
    { Amount: '0',
        jAcc: 'Arrear of salary',
        jAccNum: '154',
        Description: 'Arrears',
        Type: 'Debit' },
*/

    console.log("Odata::",odata);
    var pushData = {
        "Line": []
    };
        for(var i = 0;i<odata.length;i++)
        {var pd;
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
                var id  ;

                if(odata[i][j]["jAcc"] == "JournalEntryId")
                {
                    id = odata[i][j]["Amount"];
                }

            var    pd=
                        {
                            "Id": id,
                            "Description": odata[i][j]["Description"],
                            "Amount": odata[i][j]["Amount"],
                            "DetailType": "JournalEntryLineDetail",
                            "JournalEntryLineDetail": {
                                "PostingType": odata[i][j]["Type"] ,
                                "AccountRef": {
                                    "value": odata[i][j]["jAccNum"],
                                    "name": odata[i][j]["jAcc"]
                                }
                            }
                        }

                     //   console.log("PushData::",JSON.stringify(pd));
                if(j >= 6)
                pushData.Line.push(pd);
            }

        }
console.log("QKD::",JSON.stringify(pushData) )
})


app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})
// https.createServer(function (req, res) {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.write('Hello World!');
//     res.end();
// }).listen(4000);
