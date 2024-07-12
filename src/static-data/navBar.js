export const navbar = [
  {
    name: "Trang Chủ",
    path: "",
  },
  {
    name: "Thể Loại",
    basePath: "/the-loai",
  },
  {
    name: "Phổ Biến",
    path: "the-loai/pho-bien",
  },
  {
    name: "Phim Mới",
    path: "the-loai/phim-moi",
  },
  {
    name: "Phim Chiếu Rạp",
    path: "the-loai/phim-chieu-rap",
  },
  {
    name: "Quốc Gia",
    basePath: "/quoc-gia",
    subItems: [
      { name: "Việt Nam", path: "viet-nam" },
      { name: "Mỹ", path: "my" },
      { name: "Thái Lan", path: "thai-lan" },
      { name: "Nhật Bản", path: "nhat-ban" },
      { name: "Hồng Kông", path: "hong-kong" },
      { name: "Ấn Độ", path: "an-do" },
      { name: "Úc", path: "an-do" },
    ],
  },
];
