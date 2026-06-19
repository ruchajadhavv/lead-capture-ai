

const axios = require("axios");

const sendWhatsAppMessage = async (lead) => {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: process.env.ADMIN_PHONE,
      type: "text",
      text: {
        body: `
New Hot Lead

Name: ${lead.fullName}
Business: ${lead.businessName}
Email: ${lead.email}
Score: ${lead.score}
        `
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
};

module.exports = sendWhatsAppMessage;