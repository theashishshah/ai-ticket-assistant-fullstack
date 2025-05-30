import nodemailer from "nodemailer";

//TODO: give support of html in mail
const sendMail = async (to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRAP_SMTP_HOST,
            port: process.env.MAILTRAP_SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.MAILTRAP_SMTP_USER,
                pass: process.env.MAILTRAP_SMTP_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: "ashish@info.com",
            to,
            subject,
            text,
        });

        console.log(`✅ Mail sent and details are here: ${info}`);
        return info;
    } catch (error) {
        console.log(`❌ Error in sending email, check mailer utils for debugging`);
        throw new Error("error while sending mail", error);
    }
};

export default sendMail;
