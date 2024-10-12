import {View, Text, StyleProp, TextStyle} from 'react-native';
import React from 'react';
import {sizes} from '../constants/sizes';
import {colors} from '../constants/colors';
import {fontFamilies} from '../constants/fontFamilies';

type Props = {
  text: string;
  size?: number;
  font?: string;
  flex?: number;
  numOfLine?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  type?: 'bigTitle' | 'title' | 'text' | 'description';
};
const TextComponent = (props: Props) => {
  const {text, size, font, flex, numOfLine, color, style, type} = props;
  let fontSize: number = sizes.text;
  let fontFamily: string = fontFamilies.regular;
  switch (type) {
    case 'bigTitle':
      fontSize = sizes.bigTitle;
      fontFamily = fontFamilies.bold;
      break;
    case 'title':
      fontSize = sizes.title;
      fontFamily = fontFamilies.medium;
      break;
    case 'description':
      fontSize = sizes.description;
      fontFamily = fontFamilies.regular;
      break;
    default:
      fontSize = sizes.text;
      fontFamily = fontFamilies.regular;
      break;
  }
  return (
    <Text
      style={[
        {
          fontSize: size ? size : fontSize,
          fontFamily: font ? font : fontFamily,
          flex: flex,
          color: color ?? colors.text,
        },
        style,
      ]}
      numberOfLines={numOfLine}>
      {text}
    </Text>
  );
};

export default TextComponent;
