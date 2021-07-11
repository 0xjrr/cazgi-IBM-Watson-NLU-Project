const express = require('express');
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    console.log(req.text)
    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    console.log(req)
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    console.log(Object.getOwnPropertyNames(req))

    console.log(req.query.text)
    const nluInstance = getNLUInstance()

    console.log(typeof nluInstance)
    console.log(Object.getOwnPropertyNames(nluInstance))

    const analyzeParams = {
        'features': {
            'emotion': {}

        },
        'text': req.query.text
    };

    nluInstance.analyze(analyzeParams)
        .then(analysisResults => {
            console.log(JSON.stringify(analysisResults, null, 2));
        })
        .catch(err => {
            console.log('error:', err);
        });
    return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    console.log(Object.getOwnPropertyNames(req))

    console.log(req.query.text)
    const nluInstance = getNLUInstance()

    console.log(typeof nluInstance)
    console.log(Object.getOwnPropertyNames(nluInstance))
    let responseResults;
    const analyzeParams = {
        'features': {
            'sentiment': {}

        },
        'text': req.query.text
    };
    
    nluInstance.analyze(analyzeParams)
        .then((analysisResults,responseResults) => {
            console.log(JSON.stringify(analysisResults, null, 2));
            responseResults= analysisResults.result.sentiment.document;
            console.log(responseResults)
            console.log(typeof responseResults)
            return res.send(`text sentiment for \"${req.query.text}\": 
            Score: ${responseResults.score}, 
            Sentiment: ${responseResults.label}`);
        })
        .catch(err => {
            console.log('error:', err);
            responseResults= JSON.parse(err.body).error;
            return res.send(`Text sentiment for \"${req.query.text}\": 
            Error: ${responseResults}`);
        });
    
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
    serviceUrl: api_url,
});
    return naturalLanguageUnderstanding;
}
