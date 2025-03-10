import { generateTemplate } from "#/mail/template";
import {
  MAILTRAP_PASS,
  MAILTRAP_USER,
  SIGN_IN_URL,
  VERIFICATION_EMAIL,
} from "#/utils/variables";
import nodemailer from "nodemailer";
import path from "path";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 25,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
}

export const sendVerificationMail = async (token: string, profile: Profile) => {
  const { firstName, lastName, email } = profile;

  const welcomeMessage = `Hi ${firstName} ${lastName}, Welcome to IstinyeGo! Please verify your account using the given OTP.`;

  await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "Welcome to IstinyeGo",
    html: generateTemplate({
      title: "Welcome to IstinyeGo",
      message: welcomeMessage,
      logo: "cid:logo",
      banner: "cid:welcome",
      link: "#",
      btnTitle: token,
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "welcome.png",
        path: path.join(__dirname, "../mail/welcome.png"),
        cid: "welcome",
      },
    ],
  });
};

interface Options {
  email: string;
  link: string;
}
export const sendForgetPasswordLink = async (options: Options) => {
  const { email, link } = options;

  const message = `Seems link you forgot your password, use the link below to create a new one \n.
  If you have not sent this request, please ignore this email
  `;

  await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "IstinyeGo - Forget Password",
    html: generateTemplate({
      title: "Forget Password",
      message,
      logo: "cid:logo",
      banner: "cid:forget_password",
      link,
      btnTitle: "Reset Password",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "forget_password.png",
        path: path.join(__dirname, "../mail/forget_password.png"),
        cid: "forget_password",
      },
    ],
  });
};

export const sendPassResetSuccessEmail = async (
  firstName: string,
  lastName: string,
  email: string
) => {
  const message = `Dear ${firstName} ${lastName}, we just updated your password. you can now use your new password to log in to your account`;

  await transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL,
    subject: "IstinyeGo - Password Updated",
    html: generateTemplate({
      title: "Password Updated",
      message,
      logo: "cid:logo",
      banner: "cid:password_updated",
      link: SIGN_IN_URL,
      btnTitle: "Log in",
    }),
    attachments: [
      {
        filename: "logo.png",
        path: path.join(__dirname, "../mail/logo.png"),
        cid: "logo",
      },
      {
        filename: "password_updated.png",
        path: path.join(__dirname, "../mail/password_updated.png"),
        cid: "password_updated",
      },
    ],
  });
};
