const twilio = require('twilio');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toNumber, callerName } = req.body;

  if (!toNumber || !callerName) {
    return res.status(400).json({ error: 'toNumber and callerName required' });
  }

  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

    const call = await client.calls.create({
      twiml: `<Response><Say>Incoming call from ${callerName}</Say></Response>`,
      to: toNumber,
      from: process.env.TWILIO_NUMBER
    });

    res.status(200).json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
