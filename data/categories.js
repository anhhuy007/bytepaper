const categories = [
  {
    id: 1,
    name: 'Thời sự',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 11,
    name: 'Tin nóng',
    parent_name: 'Thời sự',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 12,
    name: 'Chính trị',
    parent_name: 'Thời sự',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 13,
    name: 'Kinh tế',
    parent_name: 'Thời sự',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 14,
    name: 'Xã hội',
    parent_name: 'Thời sự',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Giải trí',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 21,
    name: 'Sao',
    parent_name: 'Giải trí',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 22,
    name: 'Phim ảnh',
    parent_name: 'Giải trí',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 23,
    name: 'Âm nhạc',
    parent_name: 'Giải trí',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 24,
    name: 'Sự kiện',
    parent_name: 'Giải trí',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 25,
    name: 'Lifestyle',
    parent_name: 'Giải trí',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Thể thao',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 31,
    name: 'Bóng đá',
    parent_name: 'Thể thao',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 32,
    name: 'Cầu lông',
    parent_name: 'Thể thao',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 33,
    name: 'Quần vợt',
    parent_name: 'Thể thao',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 34,
    name: 'Bơi lội',
    parent_name: 'Thể thao',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 4,
    name: 'Sức khỏe',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 41,
    name: 'Chế độ ăn uống',
    parent_name: 'Sức khỏe',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 42,
    name: 'Bệnh học',
    parent_name: 'Sức khỏe',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 43,
    name: 'Tập luyện',
    parent_name: 'Sức khỏe',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 5,
    name: 'Công nghệ',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 51,
    name: 'Điện thoại',
    parent_name: 'Công nghệ',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 52,
    name: 'Máy tính',
    parent_name: 'Công nghệ',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 53,
    name: 'AI',
    parent_name: 'Công nghệ',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 54,
    name: 'Internet',
    parent_name: 'Công nghệ',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 55,
    name: 'Gadget',
    parent_name: 'Công nghệ',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 6,
    name: 'Du lịch',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 61,
    name: 'Kinh nghiệm',
    parent_name: 'Du lịch',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 62,
    name: 'Ẩm thực',
    parent_name: 'Du lịch',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 63,
    name: 'Khám phá',
    parent_name: 'Du lịch',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 64,
    name: 'Điểm đến',
    parent_name: 'Du lịch',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 7,
    name: 'Khoa học',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 71,
    name: 'Vũ trụ',
    parent_name: 'Khoa học',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 72,
    name: 'Công nghệ sinh học',
    parent_name: 'Khoa học',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 73,
    name: 'Môi trường',
    parent_name: 'Khoa học',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 74,
    name: 'Khám phá',
    parent_name: 'Khoa học',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 8,
    name: 'Văn hóa',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 81,
    name: 'Lịch sử',
    parent_name: 'Văn hóa',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 82,
    name: 'Truyền thống',
    parent_name: 'Văn hóa',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 83,
    name: 'Nghệ thuật',
    parent_name: 'Văn hóa',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 84,
    name: 'Sách',
    parent_name: 'Văn hóa',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 9,
    name: 'Môi trường',
    parent_name: null,
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 91,
    name: 'Biến đổi khí hậu',
    parent_name: 'Môi trường',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 92,
    name: 'Ô nhiễm',
    parent_name: 'Môi trường',
    created_at: '2024-11-27T00:00:00.000Z',
  },
  {
    id: 93,
    name: 'Động vật hoang dã',
    parent_name: 'Môi trường',
    created_at: '2024-11-27T00:00:00.000Z',
  },
]

export default categories

const articles = [
  {
    id: 1,
    title: 'Hội nghị bàn về chính sách kinh tế năm 2025',
    thumbnailUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI16SK7TmaLN33LAbKE7uDwLOBKxUaO9qUZA&s',
    abstract:
      'Hội nghị diễn ra với sự tham gia của nhiều lãnh đạo cấp cao nhằm thảo luận các chính sách thúc đẩy kinh tế năm 2025.',
    category: 'Chính trị',
    categoryId: 12,
    publishedDate: '2024-11-28',
  },
  {
    id: 2,
    title: 'Nam diễn viên nổi tiếng gây chú ý với bộ phim mới',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.HQrZwwmntKFabaIOx1VvtQHaEo?w=311&h=194&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Nam diễn viên hàng đầu Hollywood vừa ra mắt bộ phim mới, thu hút sự chú ý của công chúng.',
    category: 'Phim ảnh',
    categoryId: 22,
    publishedDate: '2024-11-28',
  },
  {
    id: 3,
    title: 'Cristiano Ronaldo lập kỷ lục mới trong bóng đá',
    thumbnailUrl: 'https://th.bing.com/th/id/OIP.tEIT5MwgtZCpHSysP6vJCgHaE8?rs=1&pid=ImgDetMain',
    abstract: 'Ngôi sao bóng đá Bồ Đào Nha đã thiết lập kỷ lục ghi bàn mới trong lịch sử bóng đá.',
    category: 'Bóng đá',
    categoryId: 31,
    publishedDate: '2024-11-28',
  },
  {
    id: 4,
    title: '7 thực phẩm giúp cải thiện sức khỏe tim mạch',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.-aCns-0LwLEfJbg9i4qnEQHaE8?w=292&h=195&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Danh sách 7 thực phẩm tốt nhất giúp cải thiện sức khỏe tim mạch được các chuyên gia dinh dưỡng khuyên dùng.',
    category: 'Chế độ ăn uống',
    categoryId: 41,
    publishedDate: '2024-11-28',
  },
  {
    id: 5,
    title: 'AI thay đổi cách con người làm việc',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.7aoG13I74khx0cS8_W0C7gHaE8?w=247&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Công nghệ AI đang tác động mạnh mẽ đến thị trường lao động, thay đổi cách con người làm việc và giao tiếp.',
    category: 'AI',
    categoryId: 53,
    publishedDate: '2024-11-28',
  },
  {
    id: 6,
    title: 'Những điểm đến tuyệt đẹp tại Việt Nam bạn không thể bỏ lỡ',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.N4Pry_ww04GSKtKInaUGqwHaEK?w=291&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Khám phá những điểm đến du lịch đẹp nhất Việt Nam, từ núi rừng Tây Bắc đến biển đảo miền Trung.',
    category: 'Điểm đến',
    categoryId: 64,
    publishedDate: '2024-11-28',
  },
  {
    id: 7,
    title: 'NASA phát hiện hành tinh mới có khả năng tồn tại sự sống',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.nCmSZDcFsbaiPhZ3bk7O9gHaEK?w=280&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Các nhà khoa học NASA vừa phát hiện một hành tinh mới có điều kiện gần giống Trái Đất, khả năng tồn tại sự sống rất cao.',
    category: 'Vũ trụ',
    categoryId: 71,
    publishedDate: '2024-11-28',
  },
  {
    id: 8,
    title: 'Sách lịch sử Việt Nam: Nguồn cảm hứng không giới hạn',
    thumbnailUrl: 'https://th.bing.com/th/id/OIP.MTyqyphqre94b_LSEAvyaQHaD4?rs=1&pid=ImgDetMain',
    abstract:
      'Những cuốn sách lịch sử Việt Nam không chỉ cung cấp thông tin, mà còn khơi dậy niềm tự hào dân tộc.',
    category: 'Sách',
    categoryId: 84,
    publishedDate: '2024-11-28',
  },
  {
    id: 9,
    title: 'Ô nhiễm không khí tại thành phố lớn đạt mức báo động',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.erukSQF7vourPLj5Cwfx_gHaEK?w=289&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Các thành phố lớn đang đối mặt với tình trạng ô nhiễm không khí nghiêm trọng, ảnh hưởng xấu đến sức khỏe cộng đồng.',
    category: 'Ô nhiễm',
    categoryId: 92,
    publishedDate: '2024-11-28',
  },
  {
    id: 10,
    title: 'Những điểm đến tuyệt đẹp tại Việt Nam bạn không thể bỏ lỡ',
    thumbnailUrl:
      'https://th.bing.com/th/id/OIP.N4Pry_ww04GSKtKInaUGqwHaEK?w=291&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
    abstract:
      'Khám phá những điểm đến du lịch đẹp nhất Việt Nam, từ núi rừng Tây Bắc đến biển đảo miền Trung.',
    category: 'Điểm đến',
    categoryId: 64,
    publishedDate: '2024-11-28',
  },
]

const articlesWithTags = [
  {
    id: 1,
    tags: [
      { id: 1, tagId: 101, name: 'Kinh tế' },
      { id: 1, tagId: 102, name: 'Chính trị' },
      { id: 1, tagId: 103, name: 'Chính sách' },
      { id: 1, tagId: 104, name: 'Kinh doanh' },
    ],
  },
  {
    id: 2,
    tags: [
      { id: 2, tagId: 201, name: 'Diễn viên' },
      { id: 2, tagId: 202, name: 'Phim ảnh' },
      { id: 2, tagId: 203, name: 'Hollywood' },
      { id: 2, tagId: 204, name: 'Bộ phim' },
    ],
  },
  {
    id: 3,
    tags: [
      { id: 3, tagId: 301, name: 'Bóng đá' },
      { id: 3, tagId: 302, name: 'Kỷ lục' },
      { id: 3, tagId: 303, name: 'Cristiano Ronaldo' },
      { id: 3, tagId: 304, name: 'Thể thao' },
    ],
  },
  {
    id: 4,
    tags: [
      { id: 4, tagId: 401, name: 'Sức khỏe' },
      { id: 4, tagId: 402, name: 'Dinh dưỡng' },
      { id: 4, tagId: 403, name: 'Ăn uống' },
      { id: 4, tagId: 404, name: 'Tim mạch' },
    ],
  },
  {
    id: 5,
    tags: [
      { id: 5, tagId: 501, name: 'AI' },
      { id: 5, tagId: 502, name: 'Công nghệ' },
      { id: 5, tagId: 503, name: 'Tương lai' },
      { id: 5, tagId: 504, name: 'Lao động' },
    ],
  },
  {
    id: 6,
    tags: [
      { id: 6, tagId: 601, name: 'Du lịch' },
      { id: 6, tagId: 602, name: 'Việt Nam' },
      { id: 6, tagId: 603, name: 'Địa điểm' },
      { id: 6, tagId: 604, name: 'Khám phá' },
    ],
  },
  {
    id: 7,
    tags: [
      { id: 7, tagId: 701, name: 'Vũ trụ' },
      { id: 7, tagId: 702, name: 'Khám phá' },
      { id: 7, tagId: 703, name: 'Hành tinh' },
      { id: 7, tagId: 704, name: 'NASA' },
    ],
  },
  {
    id: 8,
    tags: [
      { id: 8, tagId: 801, name: 'Lịch sử' },
      { id: 8, tagId: 802, name: 'Sách' },
      { id: 8, tagId: 803, name: 'Việt Nam' },
      { id: 8, tagId: 804, name: 'Cảm hứng' },
    ],
  },
  {
    id: 9,
    tags: [
      { id: 9, tagId: 901, name: 'Môi trường' },
      { id: 9, tagId: 902, name: 'Ô nhiễm' },
      { id: 9, tagId: 903, name: 'Khí thải' },
      { id: 9, tagId: 904, name: 'Sức khỏe' },
    ],
  },
  {
    id: 10,
    tags: [
      { id: 10, tagId: 1001, name: 'Du lịch' },
      { id: 10, tagId: 1002, name: 'Việt Nam' },
      { id: 10, tagId: 1003, name: 'Khám phá' },
      { id: 10, tagId: 1004, name: 'Địa điểm' },
    ],
  },
]

export { articles, articlesWithTags }
