const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);

export default async (req, res) => {
  // if (req.method !== "POST") {
  //   return res.status(400).json({ message: "Method is POST Request" });
  // }

  // if (!req.body.phone || !req.body.address || !req.body.radius) {
  //   return res.status(400).json({
  //     status: "error",
  //     error: "req body cannot be empty",
  //   });
  // }

  try {
    console.log(req.body);
    const { phone, radius, address } = req.body;

    const message = await client.messages.create({
      body: `Hey, welcome to CyberEye! You requested an alert for ${address} and will be receiving alerts whenever a new crime gets submitted within your requested area in a ${radius} mile radius. Until then, take care and stay safe!`,
      from: "+13254651354",
      to: phone,
    });

    res.status(200).json({ sid: message.sid, message: "Success" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const config = {
  api: {
    bodyParser: true,
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};
