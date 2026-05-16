"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { DrinkSize, formatVnd, menuItems } from "@/lib/menu";
import { getSiteUrl, siteConfig } from "@/lib/site";

type Language = "vi" | "en";
type ReceiveMethod = "pickup" | "delivery";
type PickupTime = "now" | "10m" | "15m" | "30m" | "custom";

type CartItem = {
  id: string;
  menuId: string;
  size: DrinkSize;
  price: number;
  quantity: number;
  note: string;
};

type CustomerLocation = {
  latitude: number;
  longitude: number;
};

const receiveMethods: ReceiveMethod[] = ["pickup", "delivery"];
const pickupTimes: PickupTime[] = ["now", "10m", "15m", "30m", "custom"];
const siteUrl = getSiteUrl();
const shopMapUrl = siteConfig.mapUrl;
const shopPhone = siteConfig.phone;
const socialLinks = [
  {
    label: "Facebook",
    href: siteConfig.facebookUrl,
  },
  {
    label: "Instagram",
    href: siteConfig.instagramUrl,
  },
  {
    label: "Zalo",
    href: `https://zalo.me/${shopPhone}`,
  },
];
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: siteConfig.name,
  url: siteUrl,
  telephone: shopPhone,
  image: `${siteUrl}${siteConfig.ogImagePath}`,
  servesCuisine: ["Trà", "Sữa", "Nước trái cây"],
  sameAs: [
    siteConfig.facebookUrl,
    siteConfig.instagramUrl,
    `https://zalo.me/${shopPhone}`,
  ],
  hasMap: shopMapUrl,
  // TODO: Thêm address dạng PostalAddress khi có địa chỉ text đầy đủ của quán.
};

const copy = {
  vi: {
    orderQuick: "Order nhanh",
    brand: "6365 Trà & Nước",
    cartButton: "Giỏ hàng",
    heroBadge: "Mở bán 09:00 - 21:30",
    heroTitle: "Chọn ly mát, gửi đơn nhanh cho 6365.",
    heroText:
      "Giao gần khu vực quanh quán. Ghi chú ít đá, ít ngọt hoặc thêm topping, quán sẽ liên hệ xác nhận trước khi làm.",
    pickup: "Nhận tại quán",
    delivery: "Giao gần khu vực",
    menuEyebrow: "Menu hôm nay",
    chooseDrink: "Chọn món",
    menuHint: "Bấm size muốn uống, món sẽ vào giỏ ngay.",
    addSize: "Thêm size",
    added: "Đã thêm",
    addedSuffix: "vào đơn",
    reviewOrder: "Kiểm tra đơn",
    cartTitle: "Giỏ hàng",
    emptyCart:
      "Giỏ hàng đang rỗng. Chọn món ở menu phía trên, quán sẽ giữ lại ghi chú của bạn khi có lỗi gửi đơn.",
    cup: "ly",
    remove: "Xóa",
    itemNote: "Ghi chú món",
    itemNotePlaceholder: "Ít đá, ít ngọt...",
    decrease: "Giảm số lượng",
    increase: "Tăng số lượng",
    customerName: "Tên khách",
    customerNamePlaceholder: "Ví dụ: Tristan",
    phone: "Số điện thoại",
    phonePlaceholder: "Số quán có thể gọi xác nhận",
    receiveMethod: "Hình thức nhận hàng",
    receiveMethodPlaceholder: "Chọn hình thức nhận hàng",
    pickupTime: "Thời gian muốn lấy",
    pickupTimePlaceholder: "Chọn thời gian muốn lấy",
    now: "Ngay bây giờ",
    "10m": "Sau 10 phút",
    "15m": "Sau 15 phút",
    "30m": "Sau 30 phút",
    custom: "Khác",
    customPickupTime: "Giờ bạn muốn đến lấy",
    customPickupTimePlaceholder: "Ví dụ: 14:30, 3 giờ chiều, sau giờ học...",
    customPickupTimeRequired: "Bạn vui lòng nhập giờ muốn đến lấy.",
    deliveryNote: "Địa chỉ hoặc ghi chú giao hàng",
    deliveryNotePlaceholder: "Ký túc xá, cổng trường, phòng học...",
    useCurrentLocation: "Dùng vị trí hiện tại",
    gettingLocation: "Đang lấy vị trí...",
    locationSuccess: "Đã lấy vị trí hiện tại",
    locationUnsupported:
      "Trình duyệt không hỗ trợ lấy vị trí. Bạn vẫn có thể nhập địa chỉ thủ công.",
    locationDenied:
      "Chưa lấy được vị trí. Bạn có thể cấp quyền hoặc nhập địa chỉ thủ công.",
    customerNote: "Ghi chú thêm",
    customerNotePlaceholder: "Ghi chú: ít đá, ít ngọt, thêm topping...",
    submitting: "Đang gửi đơn...",
    submit: "Gửi đơn hàng",
    mobileCartItems: "món trong giỏ",
    viewOrder: "Xem đơn",
    nameRequired: "Vui lòng nhập tên khách.",
    phoneRequired: "Vui lòng nhập số điện thoại.",
    cartRequired: "Vui lòng chọn ít nhất 1 món trước khi gửi đơn.",
    receiveMethodRequired: "Vui lòng chọn hình thức nhận hàng.",
    pickupTimeRequired:
      "Bạn chọn nhận tại quán, vui lòng chọn thời gian muốn lấy.",
    deliveryInfoRequired:
      "Bạn chọn giao gần khu vực, vui lòng nhập địa chỉ hoặc gửi vị trí hiện tại.",
    pickupAddressTitle: "Địa chỉ nhận nước",
    pickupAddressName: "6365 Trà & Nước",
    pickupAddressHint: "Bấm mở Google Maps để xem đường đi tới quán.",
    openShopMap: "Mở đường đi tới quán",
    openShopMapSuccess: "Mở Google Maps tới quán",
    footerBrand: "6365 Trà & Nước",
    footerText: "Tiệm nước nhỏ, nhận đơn online, nhận tại quán hoặc giao gần khu vực.",
    footerContact: "Liên hệ",
    footerSocial: "Theo dõi quán",
    footerPhoneLabel: "Zalo/SĐT",
    footerCall: "Gọi quán",
    footerCopyright: "© 2026 6365 Trà & Nước. Made with care for daily drinks.",
    openGoogleMaps: "Mở Google Maps",
    sendFallback: "Chưa gửi được đơn. Vui lòng thử lại.",
    success:
      "Đơn của bạn đã gửi tới quán. Quán sẽ liên hệ xác nhận trong ít phút.",
    errorFallback: "Có lỗi khi gửi đơn. Vui lòng thử lại.",
    themeLabel: "Đổi giao diện sáng tối",
    themeToLight: "Chuyển sang giao diện sáng",
    themeToDark: "Chuyển sang giao diện tối",
    languageLabel: "Đổi ngôn ngữ",
  },
  en: {
    orderQuick: "Quick order",
    brand: "6365 Tea & Drinks",
    cartButton: "Cart",
    heroBadge: "Open 09:00 - 21:30",
    heroTitle: "Pick a fresh drink, send your order fast.",
    heroText:
      "Nearby delivery is available around the shop. Add notes for less ice, less sugar, or toppings. We will contact you to confirm before preparing.",
    pickup: "Pick up at shop",
    delivery: "Nearby delivery",
    menuEyebrow: "Today menu",
    chooseDrink: "Choose drinks",
    menuHint: "Tap the size you want and it goes straight to your cart.",
    addSize: "Add size",
    added: "Added",
    addedSuffix: "to your order",
    reviewOrder: "Review order",
    cartTitle: "Cart",
    emptyCart:
      "Your cart is empty. Choose a drink from the menu above. Your notes stay here if sending fails.",
    cup: "cup",
    remove: "Remove",
    itemNote: "Item note",
    itemNotePlaceholder: "Less ice, less sugar...",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    customerName: "Customer name",
    customerNamePlaceholder: "Example: Minh Anh",
    phone: "Phone number",
    phonePlaceholder: "Number we can call to confirm",
    receiveMethod: "Receiving method",
    receiveMethodPlaceholder: "Choose receiving method",
    pickupTime: "Pickup time",
    pickupTimePlaceholder: "Choose pickup time",
    now: "Right now",
    "10m": "After 10 minutes",
    "15m": "After 15 minutes",
    "30m": "After 30 minutes",
    custom: "Other",
    customPickupTime: "When would you like to pick it up?",
    customPickupTimePlaceholder: "Example: 14:30, 3 PM, after class...",
    customPickupTimeRequired: "Please enter when you would like to pick it up.",
    deliveryNote: "Address or delivery note",
    deliveryNotePlaceholder: "Dorm, school gate, classroom...",
    useCurrentLocation: "Use current location",
    gettingLocation: "Getting location...",
    locationSuccess: "Current location saved",
    locationUnsupported:
      "Your browser does not support location. You can still enter the address manually.",
    locationDenied:
      "Could not get your location. You can allow location access or enter the address manually.",
    customerNote: "Order note",
    customerNotePlaceholder: "Less ice, less sugar, extra topping...",
    submitting: "Sending order...",
    submit: "Send order",
    mobileCartItems: "items in cart",
    viewOrder: "View order",
    nameRequired: "Please enter your name.",
    phoneRequired: "Please enter your phone number.",
    cartRequired: "Please choose at least 1 drink before sending.",
    receiveMethodRequired: "Please choose a receiving method.",
    pickupTimeRequired: "Please choose when you want to pick up your order.",
    deliveryInfoRequired:
      "You selected nearby delivery. Please enter an address or send your current location.",
    pickupAddressTitle: "Pickup address",
    pickupAddressName: "6365 Tea & Drinks",
    pickupAddressHint: "Open Google Maps to get directions to the shop.",
    openShopMap: "Get directions to the shop",
    openShopMapSuccess: "Open Google Maps to the shop",
    footerBrand: "6365 Trà & Nước",
    footerText: "A small drink shop taking online orders for pickup at the shop or nearby delivery.",
    footerContact: "Contact",
    footerSocial: "Follow us",
    footerPhoneLabel: "Zalo/Phone",
    footerCall: "Call the shop",
    footerCopyright: "© 2026 6365 Trà & Nước. Made with care for daily drinks.",
    openGoogleMaps: "Open Google Maps",
    sendFallback: "Could not send the order. Please try again.",
    success:
      "Your order has been sent to the shop. We will contact you to confirm in a few minutes.",
    errorFallback: "Something went wrong while sending. Please try again.",
    themeLabel: "Toggle light and dark mode",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
    languageLabel: "Change language",
  },
} satisfies Record<Language, Record<string, string>>;

const menuCopy = {
  vi: {
    "sua-viet-quat-kem-pho-mai": {
      name: "Sữa Việt Quất Kem Phô Mai",
      description: "Sữa chua sấy, vị việt quất béo nhẹ và thơm mát.",
      tag: "Béo nhẹ",
    },
    "sua-dau-kem-pho-mai": {
      name: "Sữa Dâu Kem Phô Mai",
      description: "Dâu sấy, nền sữa béo thơm, hợp uống lạnh.",
      tag: "Bán chạy",
    },
    "tra-tu-quy": {
      name: "Trà Tứ Quý",
      description: "Trà trái cây thanh mát, dễ uống.",
      tag: "Dễ uống",
    },
    "tra-cam-quyt-nha-dam": {
      name: "Trà Cam Quýt Nha Đam",
      description: "Vị citrus tươi mát, có nha đam giòn nhẹ.",
      tag: "Mát nhất",
    },
  },
  en: {
    "sua-viet-quat-kem-pho-mai": {
      name: "Blueberry Cheese Cream Milk",
      description: "Dried yogurt, light cheese cream and fresh blueberry notes.",
      tag: "Creamy",
    },
    "sua-dau-kem-pho-mai": {
      name: "Strawberry Cheese Cream Milk",
      description: "Dried strawberry with a cold, milky, lightly creamy base.",
      tag: "Best seller",
    },
    "tra-tu-quy": {
      name: "Four Seasons Fruit Tea",
      description: "Refreshing fruit tea, light and easy to drink.",
      tag: "Easy drink",
    },
    "tra-cam-quyt-nha-dam": {
      name: "Orange Kumquat Aloe Tea",
      description: "Fresh citrus flavor with lightly crunchy aloe vera.",
      tag: "Freshest",
    },
  },
} satisfies Record<
  Language,
  Record<string, { name: string; description: string; tag: string }>
>;

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod | "">("");
  const [pickupTime, setPickupTime] = useState<PickupTime | "">("");
  const [customPickupTime, setCustomPickupTime] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [customerLocation, setCustomerLocation] =
    useState<CustomerLocation | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [locationMessage, setLocationMessage] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");
  const [lastSubmittedMethod, setLastSubmittedMethod] =
    useState<ReceiveMethod | null>(null);
  const [addMessage, setAddMessage] = useState("");
  const [isDark, setIsDark] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("6365-theme") === "dark",
  );
  const [language, setLanguage] = useState<Language>(() =>
    typeof window !== "undefined" &&
    localStorage.getItem("6365-language") === "en"
      ? "en"
      : "vi",
  );

  const t = copy[language];
  const activeMenuCopy = menuCopy[language];

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );
  const labelClass = `text-sm font-semibold ${
    isDark ? "text-[#eadcc4]" : "text-[#655747]"
  }`;
  const fieldClass = `mt-1 w-full border px-4 text-base outline-none ${
    isDark
      ? "border-[#504334] bg-[#17140f] text-[#f7efe1] placeholder:text-[#877865] focus:border-[#c5dc82]"
      : "border-[#d7c8b2] bg-white text-[#2f251c] placeholder:text-[#a39280] focus:border-[#7c8f3d]"
  }`;

  function getMenuText(menuId: string) {
    const records = activeMenuCopy as Record<
      string,
      { name: string; description: string; tag: string }
    >;

    return records[menuId] ?? {
      name: menuId,
      description: "",
      tag: "",
    };
  }

  function addToCart(itemId: string, size: DrinkSize) {
    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    const priceOption = menuItem.prices.find((option) => option.size === size);
    if (!priceOption) return;

    const cartId = `${menuItem.id}-${size}`;

    setCart((current) => {
      const existing = current.find((item) => item.id === cartId);

      if (existing) {
        return current.map((item) =>
          item.id === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          id: cartId,
          menuId: menuItem.id,
          size,
          price: priceOption.price,
          quantity: 1,
          note: "",
        },
      ];
    });

    setAddMessage(
      `${t.added} ${getMenuText(menuItem.id).name} size ${size} ${t.addedSuffix}`,
    );
    window.setTimeout(() => setAddMessage(""), 2200);
  }

  function updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      removeItem(itemId);
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
  }

  function updateNote(itemId: string, note: string) {
    setCart((current) =>
      current.map((item) => (item.id === itemId ? { ...item, note } : item)),
    );
  }

  function removeItem(itemId: string) {
    setCart((current) => current.filter((item) => item.id !== itemId));
  }

  function toggleTheme() {
    setIsDark((current) => {
      const next = !current;
      localStorage.setItem("6365-theme", next ? "dark" : "light");
      return next;
    });
  }

  function toggleLanguage() {
    setLanguage((current) => {
      const next = current === "vi" ? "en" : "vi";
      localStorage.setItem("6365-language", next);
      return next;
    });
  }

  function handleReceiveMethodChange(method: ReceiveMethod | "") {
    setReceiveMethod(method);

    if (method === "pickup") {
      setDeliveryNote("");
      setCustomerLocation(null);
      setLocationStatus("idle");
      setLocationMessage("");
    }

    if (method === "delivery") {
      setPickupTime("");
      setCustomPickupTime("");
    }

    if (!method) {
      setPickupTime("");
      setCustomPickupTime("");
      setDeliveryNote("");
      setCustomerLocation(null);
      setLocationStatus("idle");
      setLocationMessage("");
    }
  }

  function handlePickupTimeChange(value: PickupTime | "") {
    setPickupTime(value);

    if (value !== "custom") {
      setCustomPickupTime("");
    }
  }

  function requestCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage(t.locationUnsupported);
      return;
    }

    setLocationStatus("loading");
    setLocationMessage(t.gettingLocation);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus("success");
        setLocationMessage(t.locationSuccess);
      },
      () => {
        setLocationStatus("error");
        setLocationMessage(t.locationDenied);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!customerName.trim()) {
      setStatus("error");
      setMessage(t.nameRequired);
      return;
    }

    if (!phone.trim()) {
      setStatus("error");
      setMessage(t.phoneRequired);
      return;
    }

    if (cart.length === 0) {
      setStatus("error");
      setMessage(t.cartRequired);
      return;
    }

    if (!receiveMethod) {
      setStatus("error");
      setMessage(t.receiveMethodRequired);
      return;
    }

    if (receiveMethod === "pickup" && !pickupTime) {
      setStatus("error");
      setMessage(t.pickupTimeRequired);
      return;
    }

    if (receiveMethod === "pickup" && pickupTime === "custom" && !customPickupTime.trim()) {
      setStatus("error");
      setMessage(t.customPickupTimeRequired);
      return;
    }

    if (
      receiveMethod === "delivery" &&
      !deliveryNote.trim() &&
      !customerLocation
    ) {
      setStatus("error");
      setMessage(t.deliveryInfoRequired);
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          receiveMethod: t[receiveMethod],
          pickupTime:
            receiveMethod === "pickup" && pickupTime
              ? pickupTime === "custom"
                ? customPickupTime.trim()
                : t[pickupTime]
              : "",
          shopMapUrl: receiveMethod === "pickup" ? shopMapUrl : "",
          deliveryNote: receiveMethod === "delivery" ? deliveryNote : "",
          location: receiveMethod === "delivery" ? customerLocation : null,
          customerNote,
          items: cart.map(({ menuId, size, quantity, price, note }) => ({
            name: getMenuText(menuId).name,
            size,
            quantity,
            price,
            note,
          })),
          total,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || t.sendFallback);
      }

      setStatus("success");
      setLastSubmittedMethod(receiveMethod);
      setMessage(t.success);
      setCart([]);
      setCustomerNote("");
      setDeliveryNote("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : t.errorFallback);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main
        className={`min-h-screen pb-24 md:pb-0 ${
          isDark
            ? "bg-[#17140f] text-[#f7efe1]"
            : "bg-[#fbf6ec] text-[#2f251c]"
        }`}
      >
      {addMessage ? (
        <div
          className={`fixed left-1/2 top-4 z-50 w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-bold shadow-lg ${
            isDark
              ? "border border-[#4d6237] bg-[#233018] text-[#ecffd7]"
              : "border border-[#d8e5c7] bg-[#f6fff0] text-[#31521f]"
          }`}
        >
          {addMessage}
        </div>
      ) : null}

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-4 sm:px-6 lg:px-8">
        <header
          className={`flex items-center justify-between gap-3 rounded-[22px] border px-4 py-3 shadow-sm backdrop-blur ${
            isDark
              ? "border-[#3a3228] bg-[#211c16]/90"
              : "border-[#eadfcd] bg-[#fffaf1]/90"
          }`}
        >
          <div className="min-w-0">
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.16em] sm:text-[11px] ${
                isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
              }`}
            >
              {t.orderQuick}
            </p>
            <h1
              className={`max-w-[132px] text-lg font-black leading-6 sm:max-w-none sm:text-xl ${
                isDark ? "text-[#fff4df]" : "text-[#3a291d]"
              }`}
            >
              {t.brand}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`relative h-10 w-[70px] rounded-full border p-1 shadow-sm transition sm:h-11 sm:w-20 ${
                isDark
                  ? "border-[#534635] bg-[#17140f]"
                  : "border-[#d7c8b2] bg-[#efe5d4]"
              }`}
              aria-label={t.languageLabel}
              title={t.languageLabel}
              aria-pressed={language === "en"}
            >
              <span
                className={`absolute inset-y-1 grid h-8 w-8 place-items-center rounded-full text-[11px] font-black shadow-sm transition-transform sm:h-9 sm:w-9 sm:text-xs ${
                  language === "en"
                    ? "translate-x-7 bg-[#2f3a1c] text-white sm:translate-x-9"
                    : "translate-x-0 bg-white text-[#2f251c]"
                }`}
              >
                {language.toUpperCase()}
              </span>
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-black transition-opacity sm:left-3 ${
                  language === "en"
                    ? "opacity-100 text-[#dcebb1]"
                    : "opacity-0"
                }`}
              >
                VI
              </span>
              <span
                className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-black transition-opacity sm:right-3 ${
                  language === "vi"
                    ? isDark
                      ? "opacity-100 text-[#dcebb1]"
                      : "opacity-100 text-[#7a6a58]"
                    : "opacity-0"
                }`}
              >
                EN
              </span>
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className={`relative h-10 w-[70px] rounded-full border p-1 shadow-sm transition sm:h-11 sm:w-20 ${
                isDark
                  ? "border-[#534635] bg-[#17140f]"
                  : "border-[#d7c8b2] bg-[#efe5d4]"
              }`}
              aria-label={t.themeLabel}
              aria-pressed={isDark}
              title={isDark ? t.themeToLight : t.themeToDark}
            >
              <span
                className={`absolute inset-y-1 grid h-8 w-8 place-items-center rounded-full text-base shadow-sm transition-transform sm:h-9 sm:w-9 sm:text-lg ${
                  isDark
                    ? "translate-x-7 bg-[#fff4df] text-[#2f251c] sm:translate-x-9"
                    : "translate-x-0 bg-white text-[#d97706]"
                }`}
              >
                {isDark ? "☾" : "☀"}
              </span>
              <span
                className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black transition-opacity ${
                  isDark ? "opacity-100 text-[#dcebb1]" : "opacity-0"
                }`}
              >
                ON
              </span>
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black transition-opacity ${
                  isDark ? "opacity-0" : "opacity-100 text-[#7a6a58]"
                }`}
              >
                OFF
              </span>
            </button>
            <a
              href="#order"
              className="grid h-12 min-w-12 place-items-center rounded-full bg-[#f27f3d] px-3 text-sm font-bold leading-4 text-white shadow-sm transition hover:bg-[#dd6e2f] sm:h-auto sm:min-w-0 sm:px-4 sm:py-3"
            >
              <span className="sm:hidden">🛒</span>
              <span className="hidden sm:inline">{t.cartButton}</span>
            </a>
          </div>
        </header>

        <section
          className={`rounded-[26px] border px-4 py-5 shadow-sm sm:px-6 ${
            isDark
              ? "border-[#3b4b2b] bg-[#202917]"
              : "border-[#dfe7cf] bg-[#eaf2df]"
          }`}
        >
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p
                className={`mb-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  isDark
                    ? "bg-[#303d23] text-[#dcebb1]"
                    : "bg-white/75 text-[#66772f]"
                }`}
              >
                {t.heroBadge}
              </p>
              <h2
                className={`max-w-2xl text-3xl font-black leading-tight sm:text-4xl ${
                  isDark ? "text-[#f7efe1]" : "text-[#2f3a1c]"
                }`}
              >
                {t.heroTitle}
              </h2>
              <p
                className={`mt-3 max-w-2xl text-sm leading-6 sm:text-base ${
                  isDark ? "text-[#d1c5ad]" : "text-[#596144]"
                }`}
              >
                {t.heroText}
              </p>
            </div>
            <div
              className={`flex flex-wrap gap-2 text-sm font-semibold md:justify-end ${
                isDark ? "text-[#eadcc4]" : "text-[#5f4f3d]"
              }`}
            >
              {receiveMethods.map((method) => (
                <span
                  key={method}
                  className={`rounded-full px-3 py-2 ${
                    isDark ? "bg-[#2d261e]" : "bg-white/70"
                  }`}
                >
                  {t[method]}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
          <section className="lg:order-1">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-bold uppercase tracking-[0.18em] ${
                    isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
                  }`}
                >
                  {t.menuEyebrow}
                </p>
                <h2 className="text-3xl font-black">{t.chooseDrink}</h2>
              </div>
              <p
                className={`hidden max-w-xs text-right text-sm leading-6 sm:block ${
                  isDark ? "text-[#cbbda5]" : "text-[#796b5c]"
                }`}
              >
                {t.menuHint}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {menuItems.map((item) => {
                const text = getMenuText(item.id);

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[26px] border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      isDark
                        ? "border-[#3a3228] bg-[#211c16]"
                        : "border-[#eadfcd] bg-[#fffaf1]"
                    }`}
                  >
                    <div className="grid grid-cols-[124px_1fr] sm:block">
                      <div
                        className={`relative min-h-full sm:aspect-[4/3] sm:min-h-0 ${
                          isDark ? "bg-[#2a231b]" : "bg-[#f7f0e3]"
                        }`}
                      >
                        <Image
                          src={item.image}
                          alt={text.name}
                          fill
                          sizes="(max-width: 640px) 124px, (max-width: 1024px) 50vw, 33vw"
                          className="p-2 object-contain sm:p-4"
                        />
                      </div>

                      <div className="flex min-w-0 flex-col gap-3 p-4">
                        <div>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                              isDark
                                ? "bg-[#2f3b22] text-[#dcebb1]"
                                : "bg-[#e7efe0] text-[#66772f]"
                            }`}
                          >
                            {text.tag}
                          </span>
                          <h3 className="mt-2 text-[17px] font-black leading-6 sm:text-xl">
                            {text.name}
                          </h3>
                          <p
                            className={`mt-1 text-sm leading-6 ${
                              isDark ? "text-[#cbbda5]" : "text-[#766957]"
                            }`}
                          >
                            {text.description}
                          </p>
                        </div>

                        <div className="grid gap-2">
                          {item.prices.map((option) => (
                            <button
                              key={option.size}
                              type="button"
                              onClick={() => addToCart(item.id, option.size)}
                              className="flex min-h-12 items-center justify-between rounded-2xl bg-[#2f3a1c] px-4 text-left text-sm font-bold text-white transition hover:bg-[#465527]"
                            >
                              <span>
                                {t.addSize} {option.size}
                              </span>
                              <span>{formatVnd(option.price)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <form
            id="order"
            onSubmit={submitOrder}
            className={`rounded-[26px] border p-4 shadow-sm sm:p-5 lg:sticky lg:top-4 lg:order-2 ${
              isDark
                ? "border-[#3a3228] bg-[#211c16]"
                : "border-[#eadfcd] bg-[#fffaf1]"
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
                  }`}
                >
                  {t.reviewOrder}
                </p>
                <h2 className="text-2xl font-black">{t.cartTitle}</h2>
              </div>
              <div className="rounded-full bg-[#2f3a1c] px-3 py-2 text-sm font-bold text-white">
                {formatVnd(total)}
              </div>
            </div>

            {cart.length === 0 ? (
              <div
                className={`rounded-2xl border border-dashed p-5 text-sm leading-6 ${
                  isDark
                    ? "border-[#504334] bg-[#2a231b] text-[#cbbda5]"
                    : "border-[#d7c8b2] bg-white/60 text-[#796b5c]"
                }`}
              >
                {t.emptyCart}
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => {
                  const text = getMenuText(item.menuId);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 ${
                        isDark
                          ? "border-[#3a3228] bg-[#2a231b]"
                          : "border-[#eadfcd] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-bold leading-5">{text.name}</h3>
                          <p
                            className={`mt-1 text-sm ${
                              isDark ? "text-[#cbbda5]" : "text-[#776755]"
                            }`}
                          >
                            Size {item.size} - {formatVnd(item.price)} /{" "}
                            {t.cup}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 rounded-full bg-[#fbf0e9] px-3 py-1.5 text-sm font-bold text-[#9b4a2b] hover:bg-[#f7dfd1]"
                        >
                          {t.remove}
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div
                          className={`inline-flex items-center rounded-full border p-1 ${
                            isDark
                              ? "border-[#504334] bg-[#17140f]"
                              : "border-[#d7c8b2] bg-[#fffaf1]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className={`grid h-9 w-9 place-items-center rounded-full text-xl font-black ${
                              isDark
                                ? "text-[#eadcc4] hover:bg-[#2a231b]"
                                : "text-[#5b4a38] hover:bg-white"
                            }`}
                            aria-label={`${t.decrease} ${text.name}`}
                          >
                            -
                          </button>
                          <span className="min-w-9 text-center text-base font-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className={`grid h-9 w-9 place-items-center rounded-full text-xl font-black ${
                              isDark
                                ? "text-[#eadcc4] hover:bg-[#2a231b]"
                                : "text-[#5b4a38] hover:bg-white"
                            }`}
                            aria-label={`${t.increase} ${text.name}`}
                          >
                            +
                          </button>
                        </div>
                        <p
                          className={`text-sm font-black ${
                            isDark ? "text-[#dcebb1]" : "text-[#2f3a1c]"
                          }`}
                        >
                          {formatVnd(item.price * item.quantity)}
                        </p>
                      </div>

                      <label className={`mt-3 block ${labelClass}`}>
                        {t.itemNote}
                        <input
                          value={item.note}
                          onChange={(event) =>
                            updateNote(item.id, event.target.value)
                          }
                          placeholder={t.itemNotePlaceholder}
                          className={`${fieldClass} h-11 rounded-xl px-3`}
                        />
                      </label>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-5 grid gap-3">
              <label className={labelClass}>
                {t.customerName}
                <input
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder={t.customerNamePlaceholder}
                  className={`${fieldClass} h-12 rounded-2xl`}
                />
              </label>
              <label className={labelClass}>
                {t.phone}
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  inputMode="tel"
                  placeholder={t.phonePlaceholder}
                  className={`${fieldClass} h-12 rounded-2xl`}
                />
              </label>

              <div>
                <label className={labelClass}>
                  {t.receiveMethod}
                  <select
                    value={receiveMethod}
                    onChange={(event) =>
                      handleReceiveMethodChange(
                        event.target.value as ReceiveMethod | "",
                      )
                    }
                    className={`${fieldClass} h-12 rounded-2xl`}
                  >
                    <option value="">{t.receiveMethodPlaceholder}</option>
                    {receiveMethods.map((method) => (
                      <option key={method} value={method}>
                        {t[method]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {receiveMethod === "pickup" ? (
                <>
                  <div
                    className={`rounded-2xl border p-4 ${
                      isDark
                        ? "border-[#504334] bg-[#2a231b]"
                        : "border-[#eadfcd] bg-white"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
                      }`}
                    >
                      {t.pickupAddressTitle}
                    </p>
                    <h3 className="mt-1 text-lg font-black">
                      {t.pickupAddressName}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-6 ${
                        isDark ? "text-[#cbbda5]" : "text-[#776755]"
                      }`}
                    >
                      {t.pickupAddressHint}
                    </p>
                    <a
                      href={shopMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#2f3a1c] px-4 text-sm font-black text-white transition hover:bg-[#465527]"
                    >
                      {t.openShopMap}
                    </a>
                  </div>

                  <label className={labelClass}>
                    {t.pickupTime}
                    <select
                      value={pickupTime}
                      onChange={(event) =>
                        handlePickupTimeChange(
                          event.target.value as PickupTime | "",
                        )
                      }
                      className={`${fieldClass} h-12 rounded-2xl`}
                    >
                      <option value="">{t.pickupTimePlaceholder}</option>
                      {pickupTimes.map((time) => (
                        <option key={time} value={time}>
                          {t[time]}
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : null}

              {receiveMethod === "pickup" && pickupTime === "custom" ? (
                <label className={labelClass}>
                  {t.customPickupTime}
                  <input
                    value={customPickupTime}
                    onChange={(event) =>
                      setCustomPickupTime(event.target.value)
                    }
                    placeholder={t.customPickupTimePlaceholder}
                    className={`${fieldClass} h-12 rounded-2xl`}
                  />
                </label>
              ) : null}

              {receiveMethod === "delivery" ? (
                <label className={labelClass}>
                  {t.deliveryNote}
                  <input
                    value={deliveryNote}
                    onChange={(event) => setDeliveryNote(event.target.value)}
                    placeholder={t.deliveryNotePlaceholder}
                    className={`${fieldClass} h-12 rounded-2xl`}
                  />
                </label>
              ) : null}

              {receiveMethod === "delivery" ? (
                <div>
                  <button
                    type="button"
                    onClick={requestCurrentLocation}
                    disabled={locationStatus === "loading"}
                    className={`min-h-12 w-full rounded-2xl border px-4 text-sm font-black transition ${
                      isDark
                        ? "border-[#504334] bg-[#17140f] text-[#f7efe1] hover:bg-[#2a231b]"
                        : "border-[#d7c8b2] bg-white text-[#2f3a1c] hover:bg-[#fff8ec]"
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    {locationStatus === "loading"
                      ? t.gettingLocation
                      : t.useCurrentLocation}
                  </button>

                  {locationMessage ? (
                    <p
                      className={`mt-2 rounded-2xl px-3 py-2 text-sm font-semibold leading-5 ${
                        locationStatus === "success"
                          ? isDark
                            ? "bg-[#233018] text-[#ecffd7]"
                            : "bg-[#f0f8e8] text-[#31521f]"
                          : isDark
                            ? "bg-[#3a241b] text-[#ffd8c8]"
                            : "bg-[#fde9df] text-[#8b3c1d]"
                      }`}
                    >
                      {locationMessage}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <label className={labelClass}>
                {t.customerNote}
                <textarea
                  value={customerNote}
                  onChange={(event) => setCustomerNote(event.target.value)}
                  placeholder={t.customerNotePlaceholder}
                  rows={3}
                  className={`${fieldClass} resize-none rounded-2xl py-3`}
                />
              </label>
            </div>

            {message ? (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold leading-6 ${
                  status === "success"
                    ? "border border-[#c8e5b4] bg-[#eaf8df] text-[#31521f]"
                    : "border border-[#f2c7b3] bg-[#fde9df] text-[#8b3c1d]"
                }`}
              >
                <p>{message}</p>
                {status === "success" && lastSubmittedMethod === "pickup" ? (
                  <a
                    href={shopMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-10 items-center justify-center rounded-xl bg-[#2f3a1c] px-3 text-sm font-black text-white"
                  >
                    {t.openShopMapSuccess}
                  </a>
                ) : null}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-5 h-14 w-full rounded-2xl bg-[#f27f3d] px-5 text-base font-black text-white shadow-sm transition hover:bg-[#dd6e2f] disabled:cursor-not-allowed disabled:bg-[#d8aa8d]"
            >
              {status === "sending" ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-4 pb-24 sm:px-6 md:pb-8 lg:px-8">
        <div
          className={`rounded-[22px] border p-5 text-sm shadow-sm sm:p-6 ${
            isDark
              ? "border-[#3a3228] bg-[#211c16] text-[#cbbda5]"
              : "border-[#eadfcd] bg-[#fffaf1] text-[#776755]"
          }`}
        >
          <div className="grid gap-6 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <p
                className={`text-xl font-black ${
                  isDark ? "text-[#f7efe1]" : "text-[#2f251c]"
                }`}
              >
                {t.footerBrand}
              </p>
              <p className="mt-2 max-w-md leading-6">{t.footerText}</p>
              <a
                href={shopMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#f27f3d] px-4 text-sm font-black text-white transition hover:bg-[#dd6e2f]"
              >
                {t.openGoogleMaps}
              </a>
            </div>

            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] ${
                  isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
                }`}
              >
                {t.footerContact}
              </p>
              <div className="mt-3 grid gap-2">
                <a
                  href={`https://zalo.me/${shopPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-11 items-center rounded-2xl border px-4 font-bold transition ${
                    isDark
                      ? "border-[#504334] bg-[#17140f] text-[#f7efe1] hover:bg-[#2a231b]"
                      : "border-[#d7c8b2] bg-white text-[#2f3a1c] hover:bg-[#fff8ec]"
                  }`}
                >
                  {t.footerPhoneLabel}: {shopPhone}
                </a>
                <a
                  href={`tel:${shopPhone}`}
                  className={`inline-flex min-h-11 items-center rounded-2xl border px-4 font-bold transition ${
                    isDark
                      ? "border-[#504334] text-[#eadcc4] hover:bg-[#2a231b]"
                      : "border-[#d7c8b2] text-[#5b4a38] hover:bg-white"
                  }`}
                >
                  {t.footerCall}
                </a>
              </div>
            </div>

            <div>
              <p
                className={`text-xs font-bold uppercase tracking-[0.18em] ${
                  isDark ? "text-[#c5dc82]" : "text-[#7c8f3d]"
                }`}
              >
                {t.footerSocial}
              </p>
              <div className="mt-3 grid gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex min-h-11 items-center justify-between rounded-2xl border px-4 font-bold transition ${
                      isDark
                        ? "border-[#504334] text-[#eadcc4] hover:bg-[#2a231b]"
                        : "border-[#d7c8b2] text-[#5b4a38] hover:bg-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <p
            className={`mt-6 border-t pt-4 text-xs leading-5 ${
              isDark ? "border-[#3a3228]" : "border-[#eadfcd]"
            }`}
          >
            {t.footerCopyright}
          </p>
        </div>
      </footer>

      {cart.length > 0 ? (
        <a
          href="#order"
          className="fixed inset-x-4 bottom-4 z-40 flex min-h-16 items-center justify-between rounded-2xl bg-[#2f3a1c] px-4 text-white shadow-2xl md:hidden"
        >
          <span>
            <span className="block text-xs font-semibold text-[#d8e5c7]">
              {itemCount} {t.mobileCartItems}
            </span>
            <span className="text-lg font-black">{formatVnd(total)}</span>
          </span>
          <span className="rounded-full bg-[#f27f3d] px-4 py-2 text-sm font-black">
            {t.viewOrder}
          </span>
        </a>
      ) : null}
      </main>
    </>
  );
}
