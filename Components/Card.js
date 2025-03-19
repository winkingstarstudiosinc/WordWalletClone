import React, {useRef, useEffect} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import { useDeviceType, hp, wp } from './DynamicDimensions';

function Card({color, label, onPress, isSelected, style}) {
  const animation = useRef(new Animated.Value(0)).current; // Uses a ref to persist the value

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: true,
      tension: 200,
      friction: 20,
    }).start();
  }, [isSelected, animation]);

  const handlePress = () => {
    onPress(label);
  };

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={handlePress}>
      <Animated.View
        style={[
          styles.cardContent,
          {
            backgroundColor: color,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -hp(3.4)], // Converted from -27.5
                }),
              },
            ],
          },
        ]}>
        <Text style={styles.label}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: wp(85), // Converted from '95%'
    height: hp(5.2), // Converted from 45
    borderColor: 'black',
    borderWidth: wp(0.3), // Converted from 1
    borderRadius: wp(2.6), // Converted from 10
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: hp(0.75), // Converted from 5.75
    shadowColor: '#000',
    shadowOffset: {width: 0, height: hp(0.5)}, // Converted from 4
    shadowOpacity: 0.3,
    shadowRadius: wp(1.3), // Converted from 5
    elevation: 5,
  },

  cardContent: {
    borderRadius: wp(2.6), // Converted from 10
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center', // Added to ensure text is centered
    width: wp(85),
  },
  label: {
    fontSize: wp(4.2), // Converted from 16
    color: 'black',
    textAlign: 'center', // Ensures text stays centered
    borderRadius: wp(2.6), // Converted from 10
  },
});

export default Card;