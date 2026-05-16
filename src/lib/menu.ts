export type DrinkSize = "M" | "L";

export type MenuPriceOption = {
  size: DrinkSize;
  price: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  prices: MenuPriceOption[];
};

export const menuItems: MenuItem[] = [
  {
    id: "sua-viet-quat-kem-pho-mai",
    name: "Sữa Việt Quất Kem Phô Mai",
    description: "Sữa chua sấy, vị việt quất béo nhẹ và thơm mát.",
    tag: "Béo nhẹ",
    image: "/products/viet-quat.jpg",
    prices: [
      { size: "M", price: 27000 },
      { size: "L", price: 32000 },
    ],
  },
  {
    id: "sua-dau-kem-pho-mai",
    name: "Sữa Dâu Kem Phô Mai",
    description: "Dâu sấy, nền sữa béo thơm, hợp uống lạnh.",
    tag: "Bán chạy",
    image: "/products/dau-kem.jpg",
    prices: [
      { size: "M", price: 27000 },
      { size: "L", price: 32000 },
    ],
  },
  {
    id: "tra-tu-quy",
    name: "Trà Tứ Quý",
    description: "Trà trái cây thanh mát, dễ uống.",
    tag: "Dễ uống",
    image: "/products/tra-tu-quy.jpg",
    prices: [
      { size: "M", price: 25000 },
      { size: "L", price: 28000 },
    ],
  },
  {
    id: "tra-cam-quyt-nha-dam",
    name: "Trà Cam Quýt Nha Đam",
    description: "Vị citrus tươi mát, có nha đam giòn nhẹ.",
    tag: "Mát nhất",
    image: "/products/tra-cam-quyt-nha-dam.jpg",
    prices: [
      { size: "M", price: 27000 },
      { size: "L", price: 30000 },
    ],
  },
];

export function formatVnd(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
