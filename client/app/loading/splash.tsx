import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');
const typingText = 'Attend';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const yAnim = useRef(new Animated.Value(height)).current;
  const xScaleAnim = useRef(new Animated.Value(1)).current;
  const pulseScaleAnim = useRef(new Animated.Value(1)).current;
  const [typedText, setTypedText] = useState('');
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {

    Animated.timing(yAnim, {
      toValue: 0,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start(() => {

      Animated.sequence([
        Animated.timing(xScaleAnim, {
          toValue: 3, 
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(xScaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStartTyping(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!startTyping) return;

    const delay = 100;
    let i = 1;

    const interval = setInterval(() => {
      setTypedText(typingText.slice(0, i));
      i++;
      if (i > typingText.length) {
        clearInterval(interval);


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

        setTimeout(onFinish, 2000);
      }
    }, delay);
  }, [startTyping]);

  const logoTransform = [
    { translateY: yAnim },
    ...(typedText.length === typingText.length
      ? [{ scale: pulseScaleAnim }]
      : [{ scale: xScaleAnim }]),
  ];

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logoText, { transform: logoTransform }]}>
        {typedText}
        <Text style={styles.pinkX}>X</Text>
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  pinkX: {
    color: '#FD346D',
  },
});
