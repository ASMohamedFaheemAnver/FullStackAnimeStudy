import React, {useEffect, useState} from 'react';
import {
  Animated,
  ColorValue,
  Dimensions,
  Easing,
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

const {height} = Dimensions.get('window');

const animationEndY = Math.ceil(height * 0.8);
const negativeEndY = animationEndY * -1;

const FloatingIconContainer = (props: {
  style: StyleProp<ViewStyle>;
  onComplete: Function;
  icon: ImageSourcePropType;
}) => {
  const [state, setState] = useState<{
    position: Animated.Value;
  }>({
    position: new Animated.Value(0),
  });

  let animation;
  let opacityAnimation;
  useEffect(() => {
    Animated.timing(state.position, {
      duration: 2 * 1000,
      toValue: negativeEndY,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      props.onComplete();
    });
  }, []);

  animation = state.position.interpolate({
    inputRange: [negativeEndY, 0],
    outputRange: [animationEndY, 0],
  });
  opacityAnimation = animation.interpolate({
    inputRange: [0, animationEndY],
    outputRange: [1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.FloatingIconContainer,
        {opacity: opacityAnimation, transform: [{translateY: state.position}]},
        props.style,
      ]}>
      <FloatingIcon icon={props.icon} color="red" style={styles.floatingIcon} />
    </Animated.View>
  );
};

const FloatingIcon = (props: {
  style: StyleProp<ViewStyle>;
  color: ColorValue | number | undefined;
  icon: ImageSourcePropType;
}) => {
  return (
    <View style={[props.style]}>
      <Image style={{height: 25, width: 25}} source={props.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  floatingIcon: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FloatingIconContainer: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'transparent',
  },
});

export default FloatingIconContainer;
