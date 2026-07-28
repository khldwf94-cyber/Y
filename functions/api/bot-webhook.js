export async function onRequestPost(context) {
  try {
    const update = await context.request.json();
    const message = update.message;

    if (!message) {
      return new Response("ok", { status: 200 });
    }

    const chatId = message.chat.id;
    const firstName = message.from.first_name || "";
    const lastName = message.from.last_name || "";
    const fullName = (firstName + " " + lastName).trim();
    const username = message.from.username ? "@" + message.from.username : "لا يوجد";
    const userId = message.from.id;

    const botToken = context.env.BOT_TOKEN;

    const welcomeText = `نورت متجر N7L\n\nالاسم : ${fullName}\nاليوزر : ${username}\nالايدي : ${userId}`;

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage
