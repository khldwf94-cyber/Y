export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const userId = (body.userId || "").toString().trim();

    // ==========================================================
    // ✅ قائمة آيديات المشترين المسموح لهم بالدخول
    // سجّل هنا آيدي تليجرام كل عميل اشترى منك (بين علامتي تنصيص، مفصولة بفاصلة)
    // ==========================================================
    const ALLOWED_IDS = [
      "5432340735",
      // "123456789",
      // "987654321",
    ];

    if (!userId || !ALLOWED_IDS.includes(userId)) {
      return new Response(JSON.stringify({ ok: false, error: "هذا الآيدي غير مسجل في النظام." }), {
        status: 403,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    return new Response(JSON.stringify({ ok: true, html: PROTECTED_HTML }), {
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

const PROTECTED_HTML = `
<p class="warning">‼️ ماراح مسامح اي شخص يسرب التجميعه او ياخذ المودات منها او ياخذ التجميعه بدون مايشتريها ‼️</p>
<p>حقوق متجر : N7L</p>
`;
