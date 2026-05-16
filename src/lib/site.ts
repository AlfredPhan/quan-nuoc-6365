const fallbackSiteUrl = "https://6365-tea-water.vercel.app";

export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl;

  return siteUrl.replace(/\/+$/, "");
}

export const siteConfig = {
  name: "6365 Trà & Nước",
  title: "6365 Trà & Nước | Đặt nước online",
  description:
    "Đặt trà, sữa, nước trái cây tại 6365 Trà & Nước. Nhận tại quán hoặc giao gần khu vực.",
  keywords: [
    "6365 Trà & Nước",
    "tiệm nước nhỏ",
    "đặt nước online",
    "trà cam quýt nha đam",
    "sữa kem phô mai",
    "trà trái cây",
  ],
  phone: "0372899505",
  mapUrl: "https://maps.app.goo.gl/SZUeCcsw93atpNrf8",
  facebookUrl: "https://www.facebook.com/profile.php?id=61573331165041",
  instagramUrl: "https://www.instagram.com/tiemnuocnho6365/",
  ogImagePath: "/products/menu-4-mon.jpg",
};
