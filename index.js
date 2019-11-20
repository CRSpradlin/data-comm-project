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

app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('node_modules/chart.js/dist'));
app.route('/')
    .get((req, res) => {
        res.render("./index.pug")
    })
    .post((req,res) => {
        let file = req.body.file;
        csv()
            .fromFile(file)
            .then((jsonObj)=>{
                let element = createPie(jsonObj);
                res.render("./response.pug", element);
            });
    });

app.listen(app.get('port'), () => console.log("App Started"));

function createPie(jsonObj){
    let types = [];
    let count = [];
    console.log(jsonObj.length);
    for(i=0; i<jsonObj.length; i++){
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
    
    console.log(types);
    console.log(count);
    console.log(countSum(count));

    return({typeArray:types, countArray:count});
}