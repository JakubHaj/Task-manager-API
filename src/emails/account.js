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
/*
echo "export SENDGRID_API_KEY='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'" > sendgrid.env
echo "sendgrid.env" >> .gitignore
source ./sendgrid.env
*/