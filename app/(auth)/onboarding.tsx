import { useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Animated, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng Expo Icons

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: '🛒 Mua sắm thông minh',
    desc: 'Siêu thị trực tuyến với hàng ngàn sản phẩm tươi ngon mỗi ngày',
    image: require('../../assets/onboarding/1.png'),
    backgroundColor: '#F1F8F2', 
  },
  {
    id: '2',
    title: '⏱️ Giao hàng siêu tốc',
    desc: 'Nhận hàng trong vòng 1 giờ, giao đúng giờ, đúng chất lượng',
    image: require('../../assets/onboarding/2.png'),
    backgroundColor: '#E3F2FD', 
  },
  {
    id: '3',
    title: '🔥 Deal xịn mỗi ngày',
    desc: 'Săn ưu đãi độc quyền, voucher chất, tích điểm đổi quà sang chảnh',
    image: require('../../assets/onboarding/3.png'),
    backgroundColor: '#faf1e6', 
  },
  {
    id: '4',
    title: '⚡ Trải nghiệm liền tay',
    desc: 'Đăng nhập ngay – đặt hàng siêu tốc, nhận ưu đãi mỗi ngày',
    image: require('../../assets/onboarding/4.png'),
    backgroundColor: '#fcfafc8c', 
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index } : any) => {
    const isLast = index === slides.length - 1;
    return (
      <View style={[s.slide, { width, height, backgroundColor: item.backgroundColor }]}>
        
        <ImageBackground source={item.image} style={s.image} resizeMode="contain">
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={s.overlay}
          />
          
          <View style={s.content}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.desc}>{item.desc}</Text>
            
            {isLast && (
              <TouchableOpacity 
                style={s.btn} 
                onPress={() => router.replace('/(auth)/login')}
                activeOpacity={0.8}
              >
                <Text style={s.btnText}>Bắt đầu ngay</Text>
                <View style={s.arrowCircle}>
                   <Ionicons name="arrow-forward" size={18} color="#27AE60" />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <View style={s.container}>
      <FlatList
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        removeClippedSubviews={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
      />
      
      <View style={s.dotContainer}>
        {slides.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 20, 8],
            extrapolate: 'clamp',
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={i}
              style={[s.dot, { width: dotWidth, opacity, backgroundColor: '#27AE60' }]}
            />
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  slide: { flex: 1 },
  image: {
    width: width,
    height: height,
    justifyContent: 'flex-end', // Đẩy nội dung xuống dưới
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%', // Phủ 50% dưới để che phần chân ảnh và làm nền cho chữ
  },
  content: {
    paddingHorizontal: 30,
    paddingBottom: 110, // Chừa chỗ cho dots
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)', // Thêm bóng để dễ đọc trên nền ảnh
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  desc: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  btn: {
    flexDirection: 'row',
    backgroundColor: '#27AE60', // Màu xanh lá chủ đạo
    paddingLeft: 25,
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 50, // Hình dạng viên thuốc
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginRight: 15,
  },
  // Hình tròn trắng chứa mũi tên
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
});