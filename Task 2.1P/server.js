const express = require('express');
const bodyParser = require('body-parser');
const Mailjet = require('node-mailjet');

const app = express();
const PORT = process.env.PORT || 3000;

const mailjet = new Mailjet({
    apiKey: process.env.API_KEY,
    apiSecret: process.env.SECRET
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    mailjet.post("send", { 'version': 'v3.1' })
        .request({
            "Messages": [
                {
                    "From": {
                        "Email": process.env.EMAIL,
                        "Name": "Anudha"
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": "Subscriber"
                        }
                    ],
                    "Subject": "Welcome to DEV@Deakin!",
                    "TextPart": "Thank you for subscribing to our daily insider.",
                    "HTMLPart": "<strong>Thank you for subscribing to our daily insider.</strong>",
                    "CustomID": "AppGettingStartedTest"
                }
            ]
        })
        .then((result) => {
            res.status(200).send('Welcome email sent successfully!');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error sending welcome email');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
