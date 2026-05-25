const nodemailer = require('nodemailer');


class CorreoControlador {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // importante para TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // 🔥 solución al error del certificado
      }
    });
  }
   async enviarBienvenida(name, email) {
    const asunto = '¡Bienvenido a la plataforma de Valencia Cakes!';
    const texto = `Hola ${name}, gracias por registrarte.\n\nTu usuario para acceder al sistema es: ${email}`;
    const html = `
      <h2>¡Hola ${name}!</h2>
      <p>Gracias por registrarte en Valencia Cakes.</p>
      <p><strong>Tu usuario para acceder:</strong> ${email}</p>
      <p>¡Te esperamos pronto!</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: asunto,
      text: texto,
      html: html
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error al enviar correo de bienvenida:', error.message);
      throw new Error('No se pudo enviar el correo de bienvenida');
    }
  }
}


module.exports = new CorreoControlador();