const express = require("express");
const serverless = require("serverless-http");
const fs = require('fs');

const app = express();

app.all('/*', function (req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use(express.json())

const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        hello: "hi!"
    });
});

router.get("/getnftinfo", (req, res) => {
    try {

        const filename = req.query.title;

        const data = fs.readFileSync(`/tmp/${filename}.json`, 'utf8');

        res.json({
            status: 'success',
            message: data
        })
        console.log(data);
    } catch (err) {
        console.error(err);
        res.json({
            status: 'Error on writing file',
            message: err
        })
    }

    res.json({
        hello: "hi!"
    });
});

router.post("/nft", (req, res) => {
    const body = req.body;

    const content = JSON.stringify(body.content);

    fs.writeFile(`/tmp/${body.fileName}.json`, content, err => {
        if (err) {
            res.json({
                message: 'Error on writing file'
            })
            console.error(err);
        }
        res.json({
            message: 'Success'
        })
        // file written successfully
    });


});



app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);