import FormData from "form-data";
import Mailgun from "mailgun.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    name?: string;
    email?: string;
    project?: string;
  }>(event);

  const name = body?.name?.trim() || "";
  const email = body?.email?.trim() || "";
  const project = body?.project?.trim() || "";

  if (!name || !email || !project) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields"
    });
  }

  if (!emailRegex.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email"
    });
  }

  const config = useRuntimeConfig();

  if (
    !config.mailgunApiKey ||
    !config.mailgunDomain ||
    !config.mailgunFrom ||
    !config.mailgunTo
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Mailgun is not configured"
    });
  }

  const mailgun = new Mailgun(FormData);
  const client = mailgun.client({
    username: "api",
    key: config.mailgunApiKey
  });

  try {
    await client.messages.create(config.mailgunDomain, {
      from: config.mailgunFrom,
      to: [config.mailgunTo],
      subject: `Nuevo contacto desde la web: ${name}`,
      text: [
        `Nombre: ${name}`,
        `Email: ${email}`,
        "",
        "Proyecto:",
        project
      ].join("\n"),
      html: `
        <h2>Nuevo contacto desde la web</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Proyecto:</strong><br/>${project.replace(/\n/g, "<br/>")}</p>
      `
    });

    return { ok: true };
  } catch (error) {
    console.error("Mailgun error", error);

    throw createError({
      statusCode: 502,
      statusMessage: "Email delivery failed"
    });
  }
});
