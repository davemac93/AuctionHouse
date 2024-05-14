const nodemailer = require('nodemailer');

async function sendEmail(nameSell, namelastSell, email, phoneNumber, sellDescription, carDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'h30.seohost.pl',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'macauctionhouse@adamski.dk', // Your email address
                pass: 'admin2024', // Your email password
            },
        });

        const mailOptions = {
            to: 'macauctionhouse@adamski.dk', // List of recipients
            subject: 'I want to sell car',
            html: `
                <p><strong>Name:</strong> ${nameSell} ${namelastSell}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Description of the car:</strong> ${sellDescription}</p>
                <p><strong>Car model:</strong> ${carDetails}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return { success: true }; // Indicate that email was sent successfully
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message }; // Indicate that an error occurred
    }
}

module.exports = sendEmail;