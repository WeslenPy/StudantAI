import React, { useState, useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';

const AnimatedTextList = ({ data, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, interval);

    return () => clearInterval(timer);
  }, [data, interval]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(interval - 1000), 
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex, fadeAnim, interval]);

  return (
    <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
      <Text style={styles.text}>{data[currentIndex]}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AnimatedTextList;
