import { NextResponse } from "next/server";

type OrderItem = {
  name: string;
  size?: string;
  quantity: number;
  price: number;
  note?: string;
};

type OrderPayload = {
  customerName?: string;
  phone?: string;
  receiveMethod?: string;
  pickupTime?: string;
  shopMapUrl?: string;
  deliveryNote?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  } | null;
  customerNote?: string;
  items?: OrderItem[];
  total?: number;
};

function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function normalizeText(value?: string) {
  return value?.trim() || "Không có";
}

function validateOrder(payload: OrderPayload) {
  const customerName = payload.customerName?.trim();
  const phone = payload.phone?.trim();
  const items = payload.items ?? [];

  if (!customerName) {
    return "Vui lòng nhập tên khách.";
  }

  if (!phone) {
    return "Vui lòng nhập số điện thoại.";
  }

  if (!/^[0-9+\s.-]{8,15}$/.test(phone)) {
    return "Số điện thoại chưa đúng định dạng.";
  }

  if (items.length === 0) {
    return "Vui lòng chọn ít nhất 1 món.";
  }

  const hasInvalidItem = items.some(
    (item) =>
      !item.name?.trim() ||
      (item.size !== undefined && !["M", "L"].includes(item.size)) ||
      !Number.isFinite(item.price) ||
      item.price < 0 ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1,
  );

  if (hasInvalidItem) {
    return "Thông tin món trong đơn chưa hợp lệ.";
  }

  if (
    payload.location &&
    (!Number.isFinite(payload.location.latitude) ||
      !Number.isFinite(payload.location.longitude))
  ) {
    return "Vị trí khách gửi chưa hợp lệ.";
  }

  return null;
}

function buildTelegramMessage(payload: Required<Pick<OrderPayload, "items">> & OrderPayload) {
  const lines = payload.items.map((item) => {
    const itemTotal = item.price * item.quantity;
    const note = item.note?.trim()
      ? `\n  Ghi chú: ${escapeHtml(item.note.trim())}`
      : "";

    const size = item.size ? ` size ${escapeHtml(item.size)}` : "";

    return `- ${escapeHtml(item.name)}${size} x ${item.quantity} - ${formatVnd(itemTotal)}${note}`;
  });
  const locationLink =
    payload.location &&
    Number.isFinite(payload.location.latitude) &&
    Number.isFinite(payload.location.longitude)
      ? `https://www.google.com/maps?q=${payload.location.latitude},${payload.location.longitude}`
      : "Không có";
  const pickupTimeLine = payload.pickupTime?.trim()
    ? [`Thời gian lấy: ${escapeHtml(payload.pickupTime.trim())}`]
    : [];
  const shopMapLine = payload.shopMapUrl?.trim()
    ? [`Địa chỉ quán: ${escapeHtml(payload.shopMapUrl.trim())}`]
    : [];
  const deliveryLines = payload.pickupTime?.trim()
    ? []
    : [
        `Địa chỉ/Ghi chú giao: ${escapeHtml(normalizeText(payload.deliveryNote))}`,
        `Vị trí khách gửi: ${escapeHtml(locationLink)}`,
      ];

  return [
    "🧋 <b>ĐƠN HÀNG MỚI - 6365 TRÀ &amp; NƯỚC</b>",
    "",
    `Khách: ${escapeHtml(normalizeText(payload.customerName))}`,
    `SĐT: ${escapeHtml(normalizeText(payload.phone))}`,
    `Nhận hàng: ${escapeHtml(normalizeText(payload.receiveMethod))}`,
    ...pickupTimeLine,
    ...shopMapLine,
    ...deliveryLines,
    "",
    "Món:",
    ...lines,
    "",
    `Tổng tạm tính: ${formatVnd(payload.total ?? 0)}`,
    "",
    `Ghi chú thêm: ${escapeHtml(normalizeText(payload.customerNote))}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json(
      { message: "Quán chưa cấu hình Telegram. Vui lòng thử lại sau." },
      { status: 500 },
    );
  }

  let payload: OrderPayload;

  try {
    payload = (await request.json()) as OrderPayload;
  } catch {
    return NextResponse.json(
      { message: "Dữ liệu đơn hàng không hợp lệ." },
      { status: 400 },
    );
  }

  const validationError = validateOrder(payload);

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const totalFromItems = payload.items!.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const text = buildTelegramMessage({
    ...payload,
    items: payload.items!,
    total: totalFromItems,
  });

  const telegramResponse = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );

  if (!telegramResponse.ok) {
    return NextResponse.json(
      { message: "Chưa gửi được đơn tới Telegram. Vui lòng thử lại." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
