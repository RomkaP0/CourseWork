const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config(); //Доступ к Path

let initialPath = path.join(__dirname);
let server = express();

server.use(express.static(initialPath));
server.use(express.json());

server.get('/', (req, res) => {
    res.sendFile(path.join(initialPath, "index.html"));
})

server.post('/mail', (req, res) => {
    const {firstname, lastname, email, msg} = req.body;
    let mailOptions = {
        from: `${process.env.EMAIL}@yandex.ru`,
        to: email,
        subject: 'Contact with PC_webSite',
        text: `Hello ${firstname} ${lastname},\n\nWe wrote you because you put email: ${email}\nin our contact form with message: ${msg}\n\nUnfortunately, you could catch some bugs in our WebSite or have a problem with your order.\n\nPlease, describe your problem in reply letter`
    }
    configurateTransporter(mailOptions, res)

})

server.post('/buying', (req, res) => {
    const {firstname, lastname, email, telefonNumber, order} = req.body;

    let printOrder = ""
    order.forEach(item => {
        printOrder += JSON.stringify(item) + "\n"
    })

    printOrder = printOrder.replaceAll(/[{}"]/g, "").replaceAll(",", ", ").replaceAll(":", " : ")
    let mailOptions = {
        from: `${process.env.EMAIL}@yandex.ru`,
        to: email,
        subject: 'Order in High_Play',
        text: `Hello ${firstname} ${lastname},\n\nWe wrote you because you order in our shop and put \nemail: ${email} and number of telefon: ${telefonNumber}\n\nManager call you very soon for deciding about delivery\n\nList of you order: \n${printOrder}`
    }
    configurateTransporter(mailOptions, res)
})

function configurateTransporter(mailOption, res) {
    const transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    })
    transporter.sendMail(mailOption, (err, result) => {
        if (err) {
            console.log(err);
            res.json('Something wrong. Please, try again.')
        } else {
            if (mailOption.subject==='Order in High_Play')
                res.json('Thanks you! All good')
            else
                res.json('Thanks for your message. I will reply to you within 2 working days')
        }
    })
}

server.listen(3000, () => {
    console.log('http://localhost:3000/')
    console.log('listening.....');
})

