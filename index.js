//const {spawn} = require('child_process');
const express = require('express');
const pug = require('pug');
const bodyParser = require('body-parser');
const csv = require('csvtojson');
var Chart = require('chart.js');

var app = express();
app.set('port', 8080);

//pug
app.set('view engine', 'pug');
app.set('views', './views');

//body parser limits
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/chartjs', express.static('node_modules/chart.js/dist'));
app.use('/static', express.static('static'));

app.route('/')
    .get((req, res) => {
        res.render("./index.pug")
    })
    .post((req,res) => {
        let text = ''+`${req.body.gottenString.replace(/\"\"/g,'"\n"')}`;
        //console.log(text);
        csv()
            .fromString(text)
            .then((jsonObj)=>{
                //console.log(jsonObj);
                let element = createPie(jsonObj);
                res.render("./response.pug", element);
            });
    });

app.listen(app.get('port'), () => console.log("App Started"));

function createPie(jsonObj){
    let types = [];
    let count = [];
    //console.log(jsonObj.length);
    for(i=0; i<jsonObj.length; i++){
        if((typeof jsonObj[i].Protocol)=='undefined')
            continue;
        let protocol = jsonObj[i].Protocol;
        if(types.indexOf(protocol)!=-1){
            let curr_index = types.indexOf(protocol);
            count[curr_index]++;
        } else {
            types.push(String(protocol));
            count[types.length-1] = 1;
        }
    }
    const countSum = count => count.reduce((a,b) => a+b, 0);
    
    //console.log(types);
    //console.log(count);
    //console.log(countSum(count));

    return({typeArray:types, countArray:count});
}
