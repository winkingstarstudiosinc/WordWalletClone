import { Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// 🌎 Get the latest screen size dynamically
const { width, height } = Dimensions.get('window');

// 📏 Console Log to Verify Detected Dimensions
console.log("📏 Detected Screen Dimensions → Width:", width, "Height:", height);

// 📏 Device Type Functions (Updated)
export const isSmallPhone = width >= 360 && width <= 400 && height <= 650 && height >= 540; 
export const isCompactMediumPhone = width >= 360 && width <= 412 && height && height <= 730 && height >=680; 
export const isMediumPhone = width >= 420 && width <= 430 && height > 750 && height <= 900; 
export const isTallMediumPhone = width >= 400 && width <= 430 && height > 900 && height <= 950;
export const isMediumTallPhone = width >= 410 && width <= 412 && height >= 830 && height <= 900;
export const isGalaxySPhone = width >= 400 && width <= 415 && height >= 800 && height <= 815 // ✅ NEW CATEGORY FOR YOUR PHONE
export const isLargePhone = width > 430 || height > 950; 
export const isFoldable = width >= 700; 

// 📌 Consolidated Categories for Previously Unclassified Phones
export const isPixel6ProOr7Pro = width === 412 && height === 892; 
export const isPixel5Or4a = width === 393 && height === 851;
export const isPixel4XL = width === 412 && height === 869;

// Export scaling functions
export { wp, hp };