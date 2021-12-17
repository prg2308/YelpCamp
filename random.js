
require('dotenv').config()
const mailjet = require('node-mailjet')
    .connect(process.env.MAILJET_API_KEY, process.env.MAILJET_API_SECRET)
const request = mailjet
    .post("send", { 'version': 'v3.1' })
    .request({
        Messages: [
            {
                From: {
                    Email: "yelpcamp@hotmail.com",
                    Name: "YelpCamp"
                },
                To: [
                    {
                        Email: "krisheg15@gmail.com",
                        Name: "Krishaan"
                    }
                ],
                Subject: "YelpCamp Password Reset",
                TextPart: "Click the link to change your password. If this was not you, ignore this email",
                HTMLPart: ` <strong>${user.username},</strong>
                <p>Someone (Hopefully you) has requested a password reset</p>
                <p><a href="http://${req.headers.host}/reset/${token}">Click Here</a> to reset your YelpCamp password</p>
                <br>
                <p>If this was not you, please ignore this email</p>
                <hr>
                <i>This link will expire in one hour</i> `,
                CustomID: "AppGettingStartedTest"
            }
        ]
    })
request
    .then(() => {
        req.flash('success', 'Email sent. Check your inbox for further instructions.');
        res.redirect('/reset')
    })
    .catch((err) => {
        next(err)
    })
