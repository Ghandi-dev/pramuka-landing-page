import nodemailer from "nodemailer";

export const sendMail = async (to: string, subject: string, html: string) => {
  const config = useRuntimeConfig();

  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: Number(config.emailPort),
    secure: String(config.emailSecure) === "true",
    auth: {
      user: config.emailUser,
      pass: config.emailPassword,
    },
  } as any);

  const mailOptions = {
    from: `"Pramuka SMAN 1 Pasawahan" <${config.emailUser}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Mailer error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Gagal mengirim email.",
    });
  }
};
