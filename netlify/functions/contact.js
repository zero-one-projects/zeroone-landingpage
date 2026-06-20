const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";

class ContactFunctionError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ContactFunctionError";
    this.statusCode = statusCode;
  }
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
    throw new ContactFunctionError(
      "Server configuration is incomplete. Add the Microsoft Graph environment variables in Netlify.",
      500,
    );
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

    if (response.status === 401 || response.status === 400) {
      throw new ContactFunctionError(
        "Microsoft Graph authentication failed. Check the tenant ID, client ID, and client secret in Netlify.",
        500,
      );
    }

    throw new ContactFunctionError(
      `Unable to get Microsoft Graph token: ${errorText}`,
      500,
    );
  }

  const data = await response.json();
  return data.access_token;
}

async function sendMail({ accessToken, senderEmail, name, email, message }) {
  const recipientEmail = process.env.MS_RECIPIENT_EMAIL || "contact@zeroone-apps.com";

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
              <p><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(email)}</p>
              <p><strong>Message:</strong></p>
              <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
            `,
          },
          toRecipients: [
            {
              emailAddress: {
                address: recipientEmail,
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
    let graphErrorCode = "";

    try {
      const parsed = JSON.parse(errorText);
      graphErrorCode = parsed?.error?.code || "";
    } catch {
      graphErrorCode = "";
    }

    if (response.status === 403) {
      throw new ContactFunctionError(
        "Microsoft Graph permission denied. Confirm Mail.Send application permission is added and admin consent is granted.",
        500,
      );
    }

    if (response.status === 404) {
      throw new ContactFunctionError(
        `The mailbox ${senderEmail} could not be found. Confirm MS_SENDER_EMAIL matches a real Exchange mailbox.`,
        500,
      );
    }

    if (response.status === 400 && graphErrorCode === "ErrorInvalidUser") {
      throw new ContactFunctionError(
        `The mailbox ${senderEmail} is not available for sendMail. Confirm it exists in Exchange Online.`,
        500,
      );
    }

    throw new ContactFunctionError(
      `Unable to send email through Microsoft Graph: ${errorText}`,
      500,
    );
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
    const senderEmail = process.env.MS_SENDER_EMAIL;
    const payload = JSON.parse(event.body || "{}");
    const validated = validatePayload(payload);

    if (!senderEmail) {
      return jsonResponse(500, {
        message:
          "MS_SENDER_EMAIL is missing. Set it in Netlify to a real Exchange mailbox that can send mail through Microsoft Graph.",
      });
    }

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
        error instanceof ContactFunctionError
          ? error.message
          : "We couldn't send your message right now. Please email us directly at contact@zeroone-apps.com.",
    });
  }
}
