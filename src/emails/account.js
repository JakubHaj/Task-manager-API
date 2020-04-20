const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'TaskApp@TA.ta',
        subject: 'Welcome on our platform!',
        text: `Welcome ${name}`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'TaskApp@TA.ta',
        subject: 'Farewell',
        text: `Take care ${name}`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
};