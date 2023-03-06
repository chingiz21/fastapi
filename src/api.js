const express = require("express");
const serverless = require("serverless-http");
const fs = require('fs');

const app = express();

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

        const data = fs.readFileSync(`./${filename}.txt`, 'utf8');

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

    console.log(body);

    const content = body.content.toString();

    fs.writeFile(`./${body.fileName}.txt`, content, err => {
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