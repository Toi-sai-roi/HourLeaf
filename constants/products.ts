// constants/products.ts
export type Product = {
  id: string;
  name: string;
  weight: string;
  price: number;
  icon: string;
  category: string;
  brand: string;
  detail?: string;
  nutrition?: { calories: string; fat: string; sugar: string; protein: string };
  tags?: ('exclusive' | 'bestselling' | 'new' | 'hot' | 'sale20' | 'sale30' | 'buy1get1')[];
};

export const ALL_PRODUCTS: Product[] = [
  // === GỢI Ý HÔM NAY ===
  { id: "fv6", name: "Dâu Tây", weight: "500g", price: 4.49, icon: "🍓", category: "fruits", brand: "Kazi Farmas", detail: "Dâu tây tươi, giàu chất chống oxy hóa.", nutrition: { calories: "32kcal", fat: "0.3g", sugar: "4.9g", protein: "0.7g" }, tags: ["bestselling", "new"] },
  { id: "m2", name: "Cá Hồi", weight: "500g", price: 12.99, icon: "🐟", category: "meat", brand: "Individual Collection", tags: ["exclusive", "hot"], detail: "Phi lê cá hồi Đại Tây Dương tươi.", nutrition: { calories: "208kcal", fat: "13g", sugar: "0g", protein: "20g" } },
  { id: "bv4", name: "Trà Sữa", weight: "330ml", price: 2.99, icon: "🧋", category: "beverages", brand: "Cocola", detail: "Trà sữa béo ngậy.", nutrition: { calories: "150kcal", fat: "3g", sugar: "20g", protein: "3g" }, tags: ["hot"] },
  { id: "new_s2", name: "Sushi", weight: "200g", price: 9.99, icon: "🍣", category: "meat", brand: "Individual Collection", tags: ["exclusive"], detail: "Sushi tươi, cá hồi và bơ.", nutrition: { calories: "150kcal", fat: "5g", sugar: "2g", protein: "8g" } },
  { id: "new_s1", name: "Pizza Thập Cẩm", weight: "500g", price: 8.99, icon: "🍕", category: "bakery", brand: "Ifad", tags: ["hot", "new"], detail: "Pizza đông lạnh, top phô mai và xúc xích.", nutrition: { calories: "280kcal", fat: "12g", sugar: "3g", protein: "12g" } },
  { id: "bk2", name: "Bánh Sừng Bò", weight: "200g", price: 3.99, icon: "🥐", category: "bakery", brand: "Ifad", tags: ["bestselling"], detail: "Croissant bơ xốp.", nutrition: { calories: "406kcal", fat: "21g", sugar: "11g", protein: "8g" } },


  // === TRÁI CÂY TƯƠI ===
  { id: "f1", name: "Táo Đỏ", weight: "1kg", price: 1.99, icon: "🍎", category: "fruits", brand: "Kazi Farmas", detail: "Táo đỏ tươi giòn.", nutrition: { calories: "52kcal", fat: "0.2g", sugar: "10g", protein: "0.3g" }, tags: ["bestselling"] },
  { id: "f3", name: "Chuối Hữu Cơ", weight: "5kg", price: 3.00, icon: "🍌", category: "fruits", brand: "Kazi Farmas", detail: "Chuối tươi hữu cơ.", nutrition: { calories: "89kcal", fat: "0.3g", sugar: "12g", protein: "1.1g" } },
  { id: "fv4", name: "Dưa Hấu", weight: "3kg", price: 5.49, icon: "🍉", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Dưa hấu ngọt mát.", nutrition: { calories: "30kcal", fat: "0.2g", sugar: "6g", protein: "0.6g" } },
  { id: "fv5", name: "Xoài", weight: "1kg", price: 3.99, icon: "🥭", category: "fruits", brand: "Kazi Farmas", detail: "Xoài nhiệt đới ngọt thơm.", nutrition: { calories: "60kcal", fat: "0.4g", sugar: "14g", protein: "0.8g" } },
  { id: "new_f1", name: "Anh Đào", weight: "500g", price: 8.99, icon: "🍒", category: "fruits", brand: "Kazi Farmas", tags: ["new", "exclusive"], detail: "Anh đào tươi, nhập khẩu, ngọt mát.", nutrition: { calories: "50kcal", fat: "0.3g", sugar: "12g", protein: "1g" } },
  { id: "new_f2", name: "Kiwi", weight: "500g", price: 3.99, icon: "🥝", category: "fruits", brand: "Kazi Farmas", tags: ["new", "bestselling"], detail: "Kiwi New Zealand, giàu vitamin C.", nutrition: { calories: "61kcal", fat: "0.5g", sugar: "9g", protein: "1.1g" } },
  { id: "new_f3", name: "Việt Quất", weight: "250g", price: 5.49, icon: "🫐", category: "fruits", brand: "Kazi Farmas", tags: ["new", "hot"], detail: "Việt quất tươi, giàu chất chống oxy hóa.", nutrition: { calories: "57kcal", fat: "0.3g", sugar: "10g", protein: "0.7g" } },
  { id: "new_f4", name: "Đào", weight: "1kg", price: 6.99, icon: "🍑", category: "fruits", brand: "Kazi Farmas", tags: ["new"], detail: "Đào tươi, thơm ngon, mọng nước.", nutrition: { calories: "39kcal", fat: "0.3g", sugar: "8g", protein: "0.9g" } },
  { id: "new_f5", name: "Dứa", weight: "1kg", price: 4.49, icon: "🍍", category: "fruits", brand: "Kazi Farmas", tags: ["hot"], detail: "Dứa tươi, ngọt thanh, giàu vitamin.", nutrition: { calories: "48kcal", fat: "0.1g", sugar: "10g", protein: "0.5g" } },
  { id: "new_lemon", name: "Chanh Vàng", weight: "500g", price: 2.49, icon: "🍋", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Chanh tươi, giàu vitamin C." },
  { id: "new_lime", name: "Chanh Xanh", weight: "500g", price: 2.29, icon: "🍋‍🟩", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Chanh xanh thơm." },
  { id: "new_melon", name: "Dưa Lưới", weight: "1kg", price: 3.99, icon: "🍈", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Dưa lưới ngọt mát." },
  { id: "new_pear", name: "Lê", weight: "1kg", price: 2.99, icon: "🍐", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Lê giòn ngọt." },
  { id: "new_green_apple", name: "Táo Xanh", weight: "1kg", price: 2.49, icon: "🍏", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Táo xanh giòn chua." },
  { id: "new_avocado", name: "Bơ", weight: "500g", price: 3.49, icon: "🥑", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Bơ sáp thơm béo." },
  { id: "new_olive", name: "Ô Liu", weight: "200g", price: 4.99, icon: "🫒", category: "fruits", brand: "Ifad", tags: [], detail: "Ô liu nhập khẩu." },
  { id: "new_grape", name: "Nho", weight: "500g", price: 4.49, icon: "🍇", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Nho ngọt, không hạt." },
  { id: "new_coconut", name: "Dừa Tươi", weight: "1 quả", price: 2.99, icon: "🥥", category: "fruits", brand: "Kazi Farmas", tags: [], detail: "Dừa tươi, nước ngọt." },

  // === RAU CỦ ===
  { id: "1", name: "Bông Cải Hữu Cơ", weight: "1kg", price: 4.99, icon: "🥦", category: "vegetables", brand: "Kazi Farmas", tags: ["exclusive"], detail: "Bông cải tươi hữu cơ, giàu vitamin và chất xơ.", nutrition: { calories: "34kcal", fat: "0.4g", sugar: "2g", protein: "2.8g" } },
  { id: "2", name: "Cà Chua Đỏ", weight: "1kg", price: 4.99, icon: "🍅", category: "vegetables", brand: "Kazi Farmas", tags: ["bestselling"], detail: "Cà chua đỏ tươi, ngon cho salad và nấu ăn.", nutrition: { calories: "18kcal", fat: "0.2g", sugar: "2.6g", protein: "0.9g" } },
  { id: "fv1", name: "Cà Rốt", weight: "1kg", price: 2.49, icon: "🥕", category: "vegetables", brand: "Kazi Farmas", tags: ["bestselling"], detail: "Cà rốt tươi, giàu beta-carotene.", nutrition: { calories: "41kcal", fat: "0.2g", sugar: "4.7g", protein: "0.9g" } },
  { id: "fv2", name: "Dưa Chuột", weight: "500g", price: 1.49, icon: "🥒", category: "vegetables", brand: "Kazi Farmas", detail: "Dưa chuột tươi, ngon cho salad.", nutrition: { calories: "16kcal", fat: "0.1g", sugar: "1.7g", protein: "0.7g" } },
  { id: "new_v1", name: "Rau Cải Xanh", weight: "500g", price: 2.29, icon: "🥬", category: "vegetables", brand: "Kazi Farmas", tags: ["new", "bestselling"], detail: "Rau cải xanh tươi, giàu chất xơ.", nutrition: { calories: "15kcal", fat: "0.2g", sugar: "1g", protein: "1.5g" } },
  { id: "new_v2", name: "Ớt Chuông", weight: "500g", price: 3.99, icon: "🫑", category: "vegetables", brand: "Kazi Farmas", tags: ["new"], detail: "Ớt chuông tươi, giàu vitamin A và C.", nutrition: { calories: "31kcal", fat: "0.3g", sugar: "4g", protein: "1g" } },
  { id: "new_v3", name: "Khoai Lang", weight: "1kg", price: 3.49, icon: "🍠", category: "vegetables", brand: "Kazi Farmas", tags: ["hot"], detail: "Khoai lang mật, vị ngọt tự nhiên.", nutrition: { calories: "86kcal", fat: "0.1g", sugar: "4g", protein: "1.6g" } },
  { id: "new_v4", name: "Hành Tây", weight: "1kg", price: 2.99, icon: "🧅", category: "vegetables", brand: "Kazi Farmas", tags: ["bestselling"], detail: "Hành tây tươi, thơm, dùng để nấu ăn.", nutrition: { calories: "40kcal", fat: "0.1g", sugar: "4g", protein: "1.1g" } },
  { id: "new_v5", name: "Nấm Đông Trùng", weight: "250g", price: 5.99, icon: "🍄", category: "vegetables", brand: "Kazi Farmas", tags: ["exclusive", "new"], detail: "Nấm tươi, giàu dinh dưỡng.", nutrition: { calories: "22kcal", fat: "0.3g", sugar: "2g", protein: "2.5g" } },
  { id: "new_chili", name: "Ớt Tươi", weight: "200g", price: 1.99, icon: "🌶️", category: "vegetables", brand: "Kazi Farmas", tags: ["hot"], detail: "Ớt cay, tươi ngon." },
  { id: "new_peas", name: "Đậu Hà Lan", weight: "500g", price: 2.19, icon: "🫛", category: "vegetables", brand: "Kazi Farmas", tags: [], detail: "Đậu Hà Lan tươi." },
  { id: "new_eggplant", name: "Cà Tím", weight: "1kg", price: 2.99, icon: "🍆", category: "vegetables", brand: "Kazi Farmas", tags: [], detail: "Cà tím tươi." },
  { id: "new_taro", name: "Khoai Môn", weight: "1kg", price: 3.29, icon: "🫜", category: "vegetables", brand: "Kazi Farmas", tags: [], detail: "Khoai môn thơm bở." },
  { id: "new_garlic", name: "Tỏi", weight: "500g", price: 2.49, icon: "🧄", category: "vegetables", brand: "Kazi Farmas", tags: [], detail: "Tỏi tươi, thơm cay." },
  { id: "new_salad", name: "Salad Trộn", weight: "300g", price: 4.99, icon: "🥗", category: "vegetables", brand: "Kazi Farmas", tags: [], detail: "Salad rau củ tươi." },

  // === THỊT CÁ ===
  { id: "4", name: "Gà Công Nghiệp", weight: "1kg", price: 6.99, icon: "🍗", category: "meat", brand: "Individual Collection", tags: ["exclusive"], detail: "Gà tươi, giàu đạm và ít mỡ.", nutrition: { calories: "165kcal", fat: "3.6g", sugar: "0g", protein: "31g" } },
  { id: "m1", name: "Bò Bít Tết", weight: "500g", price: 9.99, icon: "🥩", category: "meat", brand: "Individual Collection", detail: "Bò bít tết cao cấp, mềm và ngon.", nutrition: { calories: "271kcal", fat: "17g", sugar: "0g", protein: "26g" }, tags: ["bestselling"] },
  { id: "m4", name: "Sườn Heo", weight: "1kg", price: 8.99, icon: "🍖", category: "meat", brand: "Individual Collection", detail: "Sườn heo tươi để nướng hoặc kho.", nutrition: { calories: "297kcal", fat: "20g", sugar: "0g", protein: "26g" } },
  { id: "new_m1", name: "Thịt Xông Khói", weight: "200g", price: 4.99, icon: "🥓", category: "meat", brand: "Individual Collection", tags: ["new", "hot"], detail: "Thịt xông khói, hun khói thơm ngon.", nutrition: { calories: "540kcal", fat: "42g", sugar: "1g", protein: "37g" } },
  { id: "new_m2", name: "Cua Biển", weight: "1kg", price: 15.99, icon: "🦀", category: "meat", brand: "Individual Collection", tags: ["exclusive"], detail: "Cua biển tươi sống, thịt chắc ngọt.", nutrition: { calories: "87kcal", fat: "1g", sugar: "0g", protein: "18g" } },
  { id: "new_m3", name: "Tôm Hùm", weight: "500g", price: 25.99, icon: "🦞", category: "meat", brand: "Individual Collection", tags: ["exclusive", "new"], detail: "Tôm hùm Canada, thịt tươi ngọt.", nutrition: { calories: "130kcal", fat: "2g", sugar: "0g", protein: "26g" } },
  { id: "new_stew", name: "Thịt Hầm", weight: "500g", price: 7.99, icon: "🫕", category: "meat", brand: "Individual Collection", tags: [], detail: "Thịt hầm nhừ." },
  { id: "new_oyster", name: "Hàu", weight: "6 con", price: 9.99, icon: "🦪", category: "meat", brand: "Individual Collection", tags: [], detail: "Hàu tươi sống." },
  { id: "new_shrimp", name: "Tôm Thẻ", weight: "500g", price: 8.99, icon: "🦐", category: "meat", brand: "Individual Collection", tags: ["bestselling"], detail: "Tôm thẻ tươi." },
  { id: "new_fried_shrimp", name: "Tôm Chiên", weight: "200g", price: 6.99, icon: "🍤", category: "meat", brand: "Individual Collection", tags: [], detail: "Tôm chiên giòn." },
  { id: "new_skewer", name: "Xiên Que", weight: "5 xiên", price: 4.99, icon: "🍢", category: "meat", brand: "Individual Collection", tags: [], detail: "Xiên thịt nướng." },
  { id: "new_fish_cake", name: "Chả Cá", weight: "200g", price: 4.49, icon: "🍥", category: "meat", brand: "Individual Collection", tags: [], detail: "Chả cá thác lác." },

  // === SỮA & TRỨNG ===
  { id: "7", name: "Trứng Gà", weight: "4quả", price: 1.99, icon: "🥚", category: "dairy", brand: "Kazi Farmas", tags: ["bestselling"], detail: "Trứng tươi, giàu đạm và vitamin.", nutrition: { calories: "78kcal", fat: "5g", sugar: "0g", protein: "6g" } },
  { id: "d1", name: "Sữa Tươi", weight: "1L", price: 1.99, icon: "🥛", category: "dairy", brand: "Kazi Farmas", detail: "Sữa tươi nguyên kem.", nutrition: { calories: "61kcal", fat: "3.3g", sugar: "4.8g", protein: "3.2g" } },
  { id: "d5", name: "Phô Mai Cheddar", weight: "200g", price: 4.99, icon: "🧀", category: "dairy", brand: "Kazi Farmas", tags: ["bestselling"], detail: "Phô mai cheddar.", nutrition: { calories: "403kcal", fat: "33g", sugar: "0.1g", protein: "25g" } },
  { id: "new_butter", name: "Bơ Lạt", weight: "250g", price: 3.99, icon: "🧈", category: "dairy", brand: "Kazi Farmas", tags: [], detail: "Bơ lạt nguyên chất." },
  { id: "new_milk_bottle", name: "Bình Sữa", weight: "1L", price: 2.49, icon: "🍼", category: "dairy", brand: "Kazi Farmas", tags: [], detail: "Sữa tươi nguyên kem." },

  // === ĐỒ UỐNG ===
  { id: "b1", name: "Coca không đường", weight: "335ml", price: 1.99, icon: "🥤", category: "beverages", brand: "Cocola", detail: "Coca cola diet không đường.", nutrition: { calories: "1kcal", fat: "0g", sugar: "0g", protein: "0g" } },
  { id: "new_d1", name: "Bia Heineken", weight: "500ml", price: 2.49, icon: "🍺", category: "beverages", brand: "Cocola", tags: ["hot"], detail: "Bia Heineken, thơm ngon, lạnh.", nutrition: { calories: "150kcal", fat: "0g", sugar: "0g", protein: "0g" } },
  { id: "new_d2", name: "Trà Xanh", weight: "500ml", price: 1.49, icon: "🍵", category: "beverages", brand: "Ifad", tags: ["bestselling"], detail: "Trà xanh thanh mát.", nutrition: { calories: "2kcal", fat: "0g", sugar: "0g", protein: "0g" } },
  { id: "new_ice_cube", name: "Đá Viên", weight: "500g", price: 0.99, icon: "🧊", category: "beverages", brand: "Ifad", tags: [], detail: "Đá viên sạch." },
  { id: "new_juice_box", name: "Hộp Nước Ép", weight: "250ml", price: 1.49, icon: "🧃", category: "beverages", brand: "Ifad", tags: [], detail: "Nước ép trái cây." },
  { id: "new_mate", name: "Trà Mate", weight: "500ml", price: 2.49, icon: "🧉", category: "beverages", brand: "Ifad", tags: [], detail: "Trà mate thảo mộc." },
  { id: "new_champagne", name: "Sâm Banh", weight: "750ml", price: 24.99, icon: "🍾", category: "beverages", brand: "Cocola", tags: ["exclusive"], detail: "Sâm banh Pháp." },
  { id: "new_wine", name: "Rượu Vang", weight: "750ml", price: 18.99, icon: "🍷", category: "beverages", brand: "Cocola", tags: ["exclusive"], detail: "Rượu vang đỏ." },
  { id: "new_whiskey", name: "Whiskey", weight: "700ml", price: 29.99, icon: "🥃", category: "beverages", brand: "Cocola", tags: ["exclusive"], detail: "Whiskey cao cấp." },
  { id: "new_cocktail", name: "Cocktail", weight: "300ml", price: 8.99, icon: "🍸", category: "beverages", brand: "Cocola", tags: [], detail: "Cocktail pha sẵn." },
  { id: "new_tropical_drink", name: "Đồ Uống Nhiệt Đới", weight: "350ml", price: 4.99, icon: "🍹", category: "beverages", brand: "Cocola", tags: [], detail: "Đồ uống trái cây nhiệt đới." },
  { id: "new_sake", name: "Rượu Sake", weight: "720ml", price: 19.99, icon: "🍶", category: "beverages", brand: "Cocola", tags: [], detail: "Rượu sake Nhật Bản." },

  // === BÁNH KẸO & SNACK ===
  { id: "bk1", name: "Bánh Mì Trắng", weight: "400g", price: 2.50, icon: "🍞", category: "bakery", brand: "Ifad", detail: "Bánh mì trắng mềm.", nutrition: { calories: "265kcal", fat: "3.2g", sugar: "5g", protein: "9g" } },
  { id: "bk4", name: "Khoai Tây Chiên", weight: "150g", price: 2.29, icon: "🥔", category: "bakery", brand: "Cocola", detail: "Khoai tây chiên giòn.", nutrition: { calories: "536kcal", fat: "35g", sugar: "0.5g", protein: "7g" } },
  { id: "new_s3", name: "Mì Ramen", weight: "100g", price: 1.79, icon: "🍜", category: "bakery", brand: "Cocola", tags: ["hot"], detail: "Mì ramen cay, nấu nhanh.", nutrition: { calories: "380kcal", fat: "14g", sugar: "2g", protein: "8g" } },
  { id: "new_s4", name: "Bánh Socola", weight: "150g", price: 3.99, icon: "🍫", category: "bakery", brand: "Ifad", tags: ["new"], detail: "Socola đen, vị đắng nhẹ, thơm.", nutrition: { calories: "546kcal", fat: "31g", sugar: "48g", protein: "4.8g" } },
  { id: "new_s5", name: "Kem Vani", weight: "100ml", price: 1.99, icon: "🍦", category: "bakery", brand: "Kazi Farmas", tags: ["hot"], detail: "Kem vani mềm mịn.", nutrition: { calories: "207kcal", fat: "11g", sugar: "21g", protein: "3.5g" } },
  { id: "new_flatbread", name: "Bánh Mì Dẹt", weight: "300g", price: 3.49, icon: "🫓", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh mì dẹt, mềm." },
  { id: "new_baguette", name: "Bánh Mì Que", weight: "200g", price: 2.29, icon: "🥖", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh mì que giòn." },
  { id: "new_bagel", name: "Bánh Mì Vòng", weight: "250g", price: 3.99, icon: "🥯", category: "bakery", brand: "Ifad", tags: [], detail: "Bagel thơm dai." },
  { id: "new_waffle", name: "Bánh Quế", weight: "200g", price: 4.49, icon: "🧇", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh quế giòn, thơm mật ong." },
  { id: "new_pancake", name: "Bánh Kếp", weight: "300g", price: 4.99, icon: "🥞", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh kếp mềm, ăn kèm siro." },
  { id: "new_tamale", name: "Tamale", weight: "200g", price: 5.49, icon: "🫔", category: "bakery", brand: "Ifad", tags: ["exclusive"], detail: "Tamale nhân thịt." },
  { id: "new_taco", name: "Taco", weight: "150g", price: 3.99, icon: "🌮", category: "bakery", brand: "Ifad", tags: ["hot"], detail: "Taco giòn, nhân bò băm." },
  { id: "new_burrito", name: "Burrito", weight: "300g", price: 6.99, icon: "🌯", category: "bakery", brand: "Ifad", tags: ["exclusive"], detail: "Burrito nhân đậu, thịt." },
  { id: "new_stuffed_bread", name: "Bánh Mì Nhân", weight: "200g", price: 4.49, icon: "🥙", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh mì nhân thịt nướng." },
  { id: "new_falafel", name: "Falafel", weight: "200g", price: 4.99, icon: "🧆", category: "bakery", brand: "Ifad", tags: [], detail: "Falafel chiên giòn." },
  { id: "new_pasta_bowl", name: "Mì Ý Trộn", weight: "300g", price: 5.99, icon: "🥘", category: "bakery", brand: "Ifad", tags: [], detail: "Mì Ý sốt cà chua." },
  { id: "new_spaghetti", name: "Spaghetti", weight: "300g", price: 6.99, icon: "🍝", category: "bakery", brand: "Ifad", tags: [], detail: "Spaghetti sốt bò băm." },
  { id: "new_canned_food", name: "Đồ Hộp", weight: "400g", price: 3.49, icon: "🥫", category: "bakery", brand: "Ifad", tags: [], detail: "Đồ hộp các loại." },
  { id: "new_dumpling", name: "Há Cảo", weight: "10 cái", price: 5.49, icon: "🥟", category: "bakery", brand: "Ifad", tags: [], detail: "Há cảo nhân tôm thịt." },
  { id: "new_fortune_cookie", name: "Bánh May Mắn", weight: "10 cái", price: 3.99, icon: "🥠", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh quy may mắn, nhân giấy dự đoán." },
  { id: "new_rice_cracker", name: "Bánh Gạo", weight: "150g", price: 2.49, icon: "🍘", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh gạo giòn." },
  { id: "new_mooncake", name: "Bánh Trung Thu", weight: "200g", price: 6.99, icon: "🥮", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh trung thu nhân đậu xanh." },
  { id: "new_shaved_ice", name: "Đá Bào", weight: "1 phần", price: 3.49, icon: "🍧", category: "bakery", brand: "Kazi Farmas", tags: [], detail: "Đá bào ngọt mát." },
  { id: "new_ice_cream", name: "Kem Ốc Quế", weight: "1 cây", price: 2.49, icon: "🍨", category: "bakery", brand: "Kazi Farmas", tags: [], detail: "Kem ốc quế vị vani." },
  { id: "new_pie", name: "Bánh Pie", weight: "200g", price: 4.99, icon: "🥧", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh pie nhân táo." },
  { id: "new_cake_slice", name: "Bánh Ngọt", weight: "200g", price: 5.49, icon: "🍰", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh kem tươi." },
  { id: "new_pudding", name: "Pudding", weight: "150g", price: 3.49, icon: "🍮", category: "bakery", brand: "Ifad", tags: [], detail: "Pudding trứng thơm." },
  { id: "new_birthday_cake", name: "Bánh Sinh Nhật", weight: "1kg", price: 19.99, icon: "🎂", category: "bakery", brand: "Ifad", tags: [], detail: "Bánh sinh nhật các loại." },
  { id: "new_candy", name: "Kẹo Cứng", weight: "200g", price: 2.49, icon: "🍭", category: "bakery", brand: "Ifad", tags: [], detail: "Kẹo cứng nhiều vị." },
  { id: "new_gummy", name: "Kẹo Dẻo", weight: "200g", price: 3.49, icon: "🍬", category: "bakery", brand: "Ifad", tags: [], detail: "Kẹo dẻo thơm ngon." },
  { id: "new_popcorn", name: "Bắp Rang", weight: "150g", price: 2.99, icon: "🍿", category: "bakery", brand: "Cocola", tags: [], detail: "Bắp rang bơ." },

  // === DẦU ĂN & GIA VỊ ===
  { id: "o1", name: "Dầu Ô Liu", weight: "1L", price: 8.99, icon: "🫒", category: "oil", brand: "Ifad", detail: "Dầu ô liu nguyên chất.", nutrition: { calories: "884kcal", fat: "100g", sugar: "0g", protein: "0g" } },
  { id: "new_p1", name: "Mật Ong", weight: "500g", price: 5.99, icon: "🍯", category: "oil", brand: "Ifad", tags: ["new", "bestselling"], detail: "Mật ong nguyên chất, giàu vitamin.", nutrition: { calories: "304kcal", fat: "0g", sugar: "82g", protein: "0.3g" } },
  { id: "new_salt", name: "Muối Biển", weight: "500g", price: 1.99, icon: "🧂", category: "oil", brand: "Ifad", tags: [], detail: "Muối biển tinh khiết." },

  // === GẠO & ĐẬU ===
  { id: "r1", name: "Gạo Basmati", weight: "2kg", price: 5.99, icon: "🍚", category: "rice", brand: "Individual Collection", detail: "Gạo basmati cao cấp.", nutrition: { calories: "360kcal", fat: "0.9g", sugar: "0g", protein: "7g" } },
  { id: "p1", name: "Đậu Lăng Đỏ", weight: "1kg", price: 2.99, icon: "🫘", category: "pulses", brand: "Ifad", detail: "Đậu lăng đỏ khô, giàu đạm.", nutrition: { calories: "352kcal", fat: "1g", sugar: "2g", protein: "25g" } },
  { id: "new_chestnut", name: "Hạt Dẻ", weight: "500g", price: 4.99, icon: "🌰", category: "pulses", brand: "Ifad", tags: [], detail: "Hạt dẻ rang thơm." },
  { id: "new_bowl_food", name: "Cơm Trộn", weight: "400g", price: 5.49, icon: "🥣", category: "rice", brand: "Individual Collection", tags: [], detail: "Cơm trộn thập cẩm." },
  { id: "new_takeout_box", name: "Hộp Cơm", weight: "1 phần", price: 4.99, icon: "🥡", category: "rice", brand: "Individual Collection", tags: [], detail: "Cơm hộp văn phòng." },
  { id: "new_bento", name: "Bento", weight: "1 phần", price: 7.99, icon: "🍱", category: "rice", brand: "Individual Collection", tags: [], detail: "Cơm bento Nhật Bản." },
  { id: "new_rice_ball", name: "Cơm Nắm", weight: "200g", price: 2.99, icon: "🍙", category: "rice", brand: "Individual Collection", tags: [], detail: "Cơm nắm rong biển." },
  { id: "new_p2", name: "Đậu Phộng", weight: "500g", price: 2.99, icon: "🥜", category: "pulses", brand: "Ifad", tags: ["bestselling"], detail: "Đậu phộng rang muối.", nutrition: { calories: "567kcal", fat: "49g", sugar: "4g", protein: "26g" } },

  // === ĐỒ DÙNG NHÀ BẾP ===
  { id: "new_jar", name: "Lọ Thủy Tinh", weight: "1 lọ", price: 2.99, icon: "🫙", category: "kitchen", brand: "Ifad", tags: [], detail: "Lọ thủy tinh đựng gia vị." },
  { id: "new_teapot", name: "Ấm Trà", weight: "1 cái", price: 9.99, icon: "🫖", category: "kitchen", brand: "Ifad", tags: [], detail: "Ấm trà gốm sứ." },
  { id: "new_toast", name: "Ly Rượu", weight: "1 cái", price: 5.99, icon: "🥂", category: "kitchen", brand: "Ifad", tags: [], detail: "Ly rượu vang." },
  { id: "new_pitcher", name: "Bình Rót", weight: "1 cái", price: 7.99, icon: "🫗", category: "kitchen", brand: "Ifad", tags: [], detail: "Bình rót nước." },
  { id: "new_chopsticks", name: "Đũa", weight: "1 đôi", price: 1.99, icon: "🥢", category: "kitchen", brand: "Ifad", tags: [], detail: "Đũa tre cao cấp." },
  { id: "new_fork", name: "Dĩa", weight: "1 cái", price: 1.49, icon: "🍴", category: "kitchen", brand: "Ifad", tags: [], detail: "Dĩa inox." },
  { id: "new_spoon", name: "Thìa", weight: "1 cái", price: 1.49, icon: "🥄", category: "kitchen", brand: "Ifad", tags: [], detail: "Thìa inox." },
  { id: "new_knife", name: "Dao", weight: "1 cái", price: 4.99, icon: "🔪", category: "kitchen", brand: "Ifad", tags: [], detail: "Dao bếp thái thực phẩm." },
  { id: "new_fork_knife_set", name: "Bộ Dao Dĩa", weight: "1 bộ", price: 9.99, icon: "🍽️", category: "kitchen", brand: "Ifad", tags: [], detail: "Bộ dao dĩa cao cấp." },

  // === SẢN PHẨM COMBO ===
  {
    id: "combo_dawn", name: "Combo Dậy Sớm", weight: "1 combo", price: 3.99, icon: "☕🥐", category: "combo", brand: "HourLeaf Signature", tags: ["bestselling"],
    detail: "Cà phê + Bánh sừng bò. Khởi đầu ngày mới nhẹ nhàng.",
    nutrition: { calories: "320kcal", fat: "14g", sugar: "10g", protein: "6g" }
  },
  {
    id: "combo_breakfast", name: "Combo Bữa Sáng", weight: "1 combo", price: 4.99, icon: "🍳🥛🍞", category: "combo", brand: "HourLeaf Signature", tags: ["bestselling"],
    detail: "Trứng + Sữa tươi + Bánh mì. Bữa sáng đủ dinh dưỡng.",
    nutrition: { calories: "380kcal", fat: "12g", sugar: "8g", protein: "18g" }
  },
  {
    id: "combo_lunch", name: "Combo Cơm Trưa", weight: "1 combo", price: 12.99, icon: "🍖🍚🌽", category: "combo", brand: "HourLeaf Signature", tags: ["bestselling"],
    detail: "Thịt kho + Gạo basmati + Ngô ngọt. Bữa trưa no nê.",
    nutrition: { calories: "650kcal", fat: "18g", sugar: "6g", protein: "32g" }
  },
  {
    id: "combo_afternoon", name: "Combo Trà Chiều", weight: "1 combo", price: 5.99, icon: "🧋🍪", category: "combo", brand: "HourLeaf Signature", tags: ["exclusive"],
    detail: "Trà sữa trân châu + Bánh quy. Thư giãn cùng trà chiều.",
    nutrition: { calories: "520kcal", fat: "14g", sugar: "42g", protein: "6g" }
  },
  {
    id: "combo_evening", name: "Combo Nhậu Tối", weight: "1 combo", price: 6.99, icon: "🍺🍟", category: "combo", brand: "HourLeaf Signature", tags: ["exclusive"],
    detail: "Coca + Khoai tây chiên. Đồ nhậu lý tưởng cho buổi tối.",
    nutrition: { calories: "480kcal", fat: "22g", sugar: "35g", protein: "4g" }
  },
  {
    id: "combo_night", name: "Combo Đêm Khuya", weight: "1 combo", price: 8.99, icon: "🌙🥤🧁", category: "combo", brand: "HourLeaf Signature", tags: ["exclusive"],
    detail: "Coca không đường + Khoai tây chiên + Bánh nướng. Đồ ăn khuya cho dân thức đêm.",
    nutrition: { calories: "550kcal", fat: "20g", sugar: "38g", protein: "7g" }
  },
];

export const PRODUCTS_MAP: Record<string, Product> = Object.fromEntries(
  ALL_PRODUCTS.map((p) => [p.id, p]),
);