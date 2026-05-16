import { FontAwesome5 } from '@expo/vector-icons';
import { Text } from 'react-native';

const iconMap: Record<string, string> = {
    "🍎": "apple-alt",
    "🍌": "banana",
    "🍓": "strawberry",
    "🍒": "cherries",
    "🥝": "kiwi",
    "🍊": "orange",
    "🍋": "lemon",
    "🍉": "watermelon",
    "🥭": "mango",
    "🍑": "peach",
    "🍍": "pineapple",
    "🥥": "coconut",
    "🥕": "carrot",
    "🥦": "broccoli",
    "🍅": "tomato",
    "🥒": "cucumber",
    "🫑": "pepper",
    "🧅": "onion",
    "🧄": "garlic",
    "🥩": "meat",
    "🍗": "drumstick",
    "🐟": "fish",
    "🦐": "shrimp",
    "🥚": "egg",
    "🥛": "glass-milk",
    "🧀": "cheese",
    "🍞": "bread",
    "🥐": "croissant",
    "🍕": "pizza",
    "🍔": "hamburger",
    "🍟": "fries",
    "🍦": "ice-cream",
    "🍫": "chocolate",
    "🍺": "beer",
    "🥤": "cup-straw",
    "🧋": "mug-hot",
    "☕": "coffee",
};

export const ProductIcon = ({ emoji, size = 48, color = "#FF6B6B" }: { emoji: string; size?: number; color?: string }) => {
    const name = iconMap[emoji];
    if (!name) return <Text style={{ fontSize: size }}>{emoji}</Text>;
    return <FontAwesome5 name={name} size={size} color={color} />;
};