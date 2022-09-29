import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
  const { email, nombre, token } = datos;

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8c33e5f53f394e",
      pass: "8295866a55df82",
    },
  });

  // informacion del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: "UpTask - Confirma tu cuenta",
    text: "Comprueba tu cuenta en UpTask",
    html: `<p>Hola: ${nombre} Comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya está casi lista, solo debes comprobarla en el próximo enlace:</p>
    <a href="http://127.0.0.1:5173/confirmar/${token}">Comprobar Cuenta</a>
    <p>Si no creaste esta cuenta puedes ignorar el mensaje</p>
    
    
    `,
  });
};
