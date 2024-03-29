const nodemailer = require("nodemailer");
import db from "./db.server";

const { fetchMerchantData } = require("./utils/utils");

exports.sendInstallationEmail = async (session) => {
  if (session) {
    const sessionResult = await db.shop.findFirst({
      where: { shop: session.shop },
    });

    if (sessionResult) return;

    await db.shop.create({
      data: { id: Date.now().toString(), shop: session.shop },
    });
  }

  const merchantData = await fetchMerchantData(session);
  const {
    data: {
      shop: {
        email,
        myshopifyDomain,
        contactEmail,
        billingAddress: { company, phone, formattedArea },
      },
    },
  } = merchantData;

  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.AWS_SMTP_USERNAME,
      pass: process.env.AWS_SMTP_PASSWORD,
    },
  });

  transporter
    .sendMail({
      from: "kamal2507s@gmail.com",
      to: "kamal2507s@gmail.com",
      subject: `New Installation Alert: WhatsApp Integration Lite Installed`,
      text: `A new user has just installed our app from shopify app store. \n
      User Details :- \n
      Shop Owner's Email Address: ${email} \n 
      Customer Facing Email Address: ${contactEmail} \n 
      Company: ${company || "Not Found"} \n 
      Phone Number: ${phone || "Not Found"} \n 
      Store Url: ${myshopifyDomain} \n 
      City and Country: ${formattedArea || "Not Found"}`,
    })
    .catch((err) => console.log("Couldn't sent the email", err));
};
