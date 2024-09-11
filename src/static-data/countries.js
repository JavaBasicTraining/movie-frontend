// export const countries = () => {
//   const countryData = {
//     name: "Quốc Gia",
//     subItems: [
//       { name: "Việt Nam" },
//       { name: "Mỹ" },
//       { name: "Thái Lan" },
//       { name: "Hàn Quốc" },
//       { name: "Nhật Bản" },
//       { name: "Hồng Kông" },
//       { name: "Ấn Độ" },
//       { name: "Úc" },
//     ],
//     basePath: "http://localhost:3000/quoc-gia",
//   };

//   return countryData;
// };

export const countries = [
  'Việt Nam',
  'Mỹ',
  'Thái Lan',
  'Hàn Quốc',
  'Nhật Bản',
  'Hồng Kông',
  'Ấn Độ',
  'Úc',
];

export const countryOptions = countries.map((country) => ({  value: country, label: country }));
