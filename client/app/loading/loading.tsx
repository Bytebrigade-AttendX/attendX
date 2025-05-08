import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingOverlay() {
  const pulseScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseScaleAnim, {
          toValue: 1.07,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseScaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.overlay}>
      <Animated.Text style={[styles.text, { transform: [{ scale: pulseScaleAnim }] }]}>
        Attend<Text style={styles.x}>X</Text>
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'white',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    fontFamily: 'SFProRounded-Bold', // match splash screen
    color: 'black',
  },
  x: {
    color: '#FF4D6D',
  },
});
