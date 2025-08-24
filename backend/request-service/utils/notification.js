
const { Resend } = require("resend");
const { sendRPCMessage } = require("../../shared/rabbitMQ/rabbit-connection");

// Initialize Resend client (use your API key from dashboard)
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendBloodRequestNotificationService({ requestId, bloodGroup, coordinates }) {
  const donarResponse = await sendRPCMessage(
    "get-donors-in-radius",
    JSON.stringify({
      bloodGroup,
      requestId,
      coordinates,
    })
  );

  const response = JSON.parse(donarResponse);
  
  console.log("donorsfornotification", response);

  if (!response.success || !response?.data || response.data.length === 0) {
    console.warn("No donors found for notification");
    return { success: false, message: "No donors found" };
  }

  // Send emails to each donor
  console.log("donors",response.data)
  for (const donor of response.data) {
    try {
      await resend.emails.send({
       from: "Acme <onboarding@resend.dev>", // domain should be verified in Resend
        to: "kashif.dev.007@gmail.com", // assuming each donor object has `email`
        subject: "Urgent Blood Request",
        html: `
          <h2>Blood Request Notification</h2>
          <p>A patient is urgently in need of <strong>${bloodGroup}</strong> blood.</p>
          <p>Request ID: ${requestId}</p>
          <p>Location Coordinates: ${coordinates.join(", ")}</p>
          <p>If you can donate, please respond immediately.</p>
          <h3>Following are the Receiver Details...</h3>
          <p><strong>Fullname</strong>:${donor.user?.fullname}</p>
          <p><strong>Username</strong>:${donor.user?.fullname}</p>
          <p><strong>Email</strong>:${donor.user?.fullname}</p>
          <p><strong>PhoneNo</strong>:${donor.user?.phone}</p>


        `,
      });

      console.log(`Email sent to donor: ${donor.user?.email}`);
    } catch (error) {
      console.error(`Failed to send email to ${donor.user?.email}:`, error);
    }
  }

  return { success: true, message: "Emails sent to all donors" };
}

module.exports = { sendBloodRequestNotificationService };
