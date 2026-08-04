export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const userId = (body.userId || "").toString().trim();

    const ALLOWED_IDS = [
      "5432340735",
      "5886085839",
    ];

    if (!userId || !ALLOWED_IDS.includes(userId)) {
      return new Response(JSON.stringify({ ok: false, error: "هذا الآيدي غير مسجل في النظام." }), {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // توليد كود مكون من 6 أرقام
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // تخزين الكود مؤقتًا (صالح 5 دقائق)
    await context.env.OTP_STORE.put(userId, code, { expirationTtl: 300 });

    // إرسال الكود عبر بوت التليجرام لنفس الآيدي
    const botToken = context.env.BOT_TOKEN;
    const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: userId,
        text: `رمز التحقق الخاص بك في N7L STORE هو:\n\n${code}\n\nصالح لمدة 5 دقائق.`
      })
    });

    const tgData = await tgRes.json();
    if (!tgData.ok) {
      return new Response(JSON.stringify({ ok: false, error: "تعذر إرسال الكود. تأكد أنك بدأت محادثة مع البوت أولاً." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    return new Response(JSON.stringify({ ok: true, needOtp: true }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "خطأ في الطلب." }), {
      status: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" }
    });
  }
}
