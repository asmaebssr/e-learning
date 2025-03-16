import {nodemailerClient, sender } from "./nodemailer.js"
import {
    CONTACT_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE
} from "./emailTemplates.js";


const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient[0].email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
                '{resetURL}', resetURL
            ),
            category: 'Password Reset'
        });

        console.log('Reset password sent successfully', response)
        
    } catch (error) {
        console.error('Error sending password reset email', error);
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

const sendResetSuccessEmail = async (email) => {
    const recipient = [{email}]

    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: recipient[0].email,
            subject: 'Password reset successful',
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: 'Password reset'
        })
        console.log('Password reset email sent successfully', response)
    } catch (error) {
        console.log('Error sending password reset success email', error);
        throw new Error(`Error sending password reset success email: ${error}`)
    }
}

const sendContactEmail = async (username, email, message) => {
    try {
        const response = await nodemailerClient.sendMail({
            from: `${sender.name} <${sender.email}>`,
            to: sender.email, // Sending to your support/admin email
            subject: `Contact Form Submission from ${username}`,
            html: CONTACT_EMAIL_TEMPLATE.replace('{name}', username)
                .replace('{email}', email)
                .replace('{message}', message),
            replyTo: email,
            category: 'Contact Form'
        });
        
        console.log('Contact email sent successfully', response);
        return response;
    } catch (error) {
        console.error('Error sending contact email', error);
        throw new Error(`Error sending contact email: ${error}`);
    }
}

export {
    sendResetPasswordEmail,
    sendResetSuccessEmail,
    sendContactEmail
}