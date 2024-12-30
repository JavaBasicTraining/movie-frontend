import { faGlobe, faHouse } from '@fortawesome/free-solid-svg-icons';

export const navbar = [
  {
    name: 'Trang Chủ',
    path: '',
    icon: faHouse,
  },
  {
    name: 'Thể Loại',
    basePath: '/the-loai',
  },
  {
    name: 'Phổ Biến',
    path: 'the-loai/pho-bien',
  },
  {
    name: 'Phim Mới',
    path: 'the-loai/phim-moi',
  },
  {
    name: 'Phim Chiếu Rạp',
    path: 'the-loai/phim-chieu-rap',
  },
  {
    name: 'Phim Lẻ',
    path: 'the-loai/phim-le',
  },
  {
    name: 'Quốc Gia',
    basePath: '/quoc-gia',
    icon: faGlobe,
    subItems: [
      { name: 'Việt Nam', path: 'Việt Nam' },
      { name: 'Mỹ', path: 'Mỹ' },
      { name: 'Thái Lan', path: 'Thái Lan' },
      { name: 'Nhật Bản', path: 'Nhật Bản' },
      { name: 'Hồng Kông', path: 'Hồng Kông' },
      { name: 'Ấn Độ', path: 'Ấn Độ' },
      { name: 'Úc', path: 'Úc' },
    ],
  },
];
