const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function validatePayload(payload) {
  const name = typeof payload?.name === "string" ? payload.name.trim() : "";
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";
  const message = typeof payload?.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return {
      error: "Please complete your name, email, and message.",
    };
  }

  return {
    name,
    email,
    message,
  };
}

async function getAccessToken() {
  const tenantId = process.env.MS_TENANT_ID;
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error("Microsoft Graph environment variables are missing.");
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to get Microsoft Graph token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function sendMail({ accessToken, senderEmail, name, email, message }) {
  const response = await fetch(
    `${GRAPH_BASE_URL}/users/${encodeURIComponent(senderEmail)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `New ZeroOne website inquiry from ${name}`,
          body: {
            contentType: "HTML",
            content: `
              <p>You received a new message from the ZeroOne website.</p>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br />")}</p>
            `,
          },
          toRecipients: [
            {
              emailAddress: {
                address: senderEmail,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: email,
              },
            },
          ],
        },
        saveToSentItems: true,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Unable to send email through Microsoft Graph: ${errorText}`);
  }
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        Allow: "OPTIONS, POST",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, {
      message: "Method not allowed.",
    });
  }

  try {
    const senderEmail = process.env.MS_SENDER_EMAIL || "contact@zeroone-apps.com";
    const payload = JSON.parse(event.body || "{}");
    const validated = validatePayload(payload);

    if ("error" in validated) {
      return jsonResponse(400, {
        message: validated.error,
      });
    }

    const accessToken = await getAccessToken();
    await sendMail({
      accessToken,
      senderEmail,
      ...validated,
    });

    return jsonResponse(200, {
      message: "Thanks. Your message has been sent.",
    });
  } catch (error) {
    console.error("Contact form error", error);

    return jsonResponse(500, {
      message:
        "We couldn't send your message right now. Please email us directly at contact@zeroone-apps.com.",
    });
  }
}
