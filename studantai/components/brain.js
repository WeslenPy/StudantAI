import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Brain, XCircleIcon } from 'lucide-react-native';

export default function BrainLoading({onClose}) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    [wave1, wave2, wave3].forEach((wave, index) => {
      Animated.loop(
        Animated.timing(wave, {
          toValue: 1,
          duration: 2000,
          delay: index * 600,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      ).start();
    });

    Animated.loop(
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: false,
      })
    ).start();

    [dot1, dot2, dot3].forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            delay: index * 200,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });

    [particle1, particle2, particle3].forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle, {
            toValue: 1,
            duration: 1500 + index * 300,
            delay: index * 100,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 1500 + index * 300,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const brainScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const brainOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const createWaveStyle = (wave) => ({
    opacity: wave.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 0],
    }),
    transform: [
      {
        scale: wave.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
      },
    ],
  });

  const createDotStyle = (dot) => ({
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  });

  const createParticleStyle = (particle, x, y) => ({
    transform: [
      {
        translateY: particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0, y],
        }),
      },
      {
        translateX: particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0, x],
        }),
      },
    ],
    opacity: particle.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1, 0],
    }),
  });

  return (
    <View style={styles.container} className='relative'>
      <View style={styles.brainContainer}>

        <Animated.View style={[styles.wave, styles.wave1, createWaveStyle(wave1)]} />
        <Animated.View style={[styles.wave, styles.wave2, createWaveStyle(wave2)]} />
        <Animated.View style={[styles.wave, styles.wave3, createWaveStyle(wave3)]} />

        <Animated.View style={[styles.particle, styles.particle1, createParticleStyle(particle1, -5, -15)]}>
          <View style={styles.particleDot} />
        </Animated.View>
        <Animated.View style={[styles.particle, styles.particle2, createParticleStyle(particle2, 10, -20)]}>
          <View style={[styles.particleDot, { backgroundColor: '#FCD34D' }]} />
        </Animated.View>
        <Animated.View style={[styles.particle, styles.particle3, createParticleStyle(particle3, 5, -18)]}>
          <View style={[styles.particleDot, { backgroundColor: '#EAB308' }]} />
        </Animated.View>

        <Animated.View style={{ opacity: brainOpacity, transform: [{ scale: brainScale }] }}>
          <Brain size={80} color="#22D3EE"></Brain>
        </Animated.View>
      </View>

      <Text style={styles.text}>Gerando suas questões...</Text>


      <View style={styles.dotsContainer}>
        <Animated.View style={[styles.dot, createDotStyle(dot1)]} />
        <Animated.View style={[styles.dot, createDotStyle(dot2)]} />
        <Animated.View style={[styles.dot, createDotStyle(dot3)]} />
      </View>

      <View className='absolute bottom-10 left-0 right-0 items-center'>
        <TouchableOpacity  className='bg-red-500 rounded-full' onPress={()=>onClose()}>
          <XCircleIcon size={50} color={"white"}></XCircleIcon>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C547E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brainContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wave: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
  },
  wave1: {
    borderColor: '#22D3EE',
  },
  wave2: {
    borderColor: '#06B6D4',
  },
  wave3: {
    borderColor: '#0891B2',
  },
  particle: {
    position: 'absolute',
  },
  particle1: {
    top: 40,
    left: 60,
  },
  particle2: {
    top: 30,
    right: 50,
  },
  particle3: {
    bottom: 70,
    right: 60,
  },
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF24',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 24,
  },
  progressContainer: {
    width: 192,
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22D3EE',
    borderRadius: 4,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22D3EE',
  },
});