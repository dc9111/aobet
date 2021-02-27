const sendEmail = require('./send-email');
const loopSeconds = 120;
let providedNotification = false;

function sendNotification(message) {
    sendEmail('thisdavej@gmail.com', 'ISS notification', message);
    console.log('Email sent');
}

function loop() {

        if (minutesFromNow <= warningMinutes) { if (!providedNotification) { sendNotification(`The ISS will pass over in ${minutesFromNow} minutes.`); 
        providedNotification = true; } } else { providedNotification = false; } }
        );
    setTimeout(loop, loopSeconds * 1000);
}

loop();