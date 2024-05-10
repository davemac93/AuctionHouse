const nodemailer = require('nodemailer');

async function sendEmail(name, lastName, email, phoneNumber, description, carDetails) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'macauctionhouse@gmail.com', // Your email address
                pass: 'admin2024', // Your email password
            },
        });

        const mailOptions = {
            from: 'your-email@example.com', // Sender address
            to: 'dave.mac@hotmail.com', // List of recipients
            subject: 'New Car Selling Inquiry',
            html: `
                <p><strong>Name:</strong> ${name} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                <p><strong>Description of the car:</strong> ${description}</p>
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