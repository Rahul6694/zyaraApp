import { StyleSheet, Text as RNText, PixelRatio } from 'react-native';
import React from 'react';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';

const Typography = ({
    size = 14,
    children,
    type = Font.GeneralSans_Regular,   // Default General Sans
    color = Colors.black,
    textAlign,
    style = {},
    numberOfLines,
    lineHeight,
    fontWeight,
    letterSpacing,
    ...props
}) => {

    const fontScale = PixelRatio.getFontScale();

    return (
        <RNText
            numberOfLines={numberOfLines}
            style={[
                styles.font,
                {
                    fontSize: size / fontScale,   // Better scaling
                    color: color,
                    textAlign,
                    lineHeight: lineHeight,
                    fontFamily: type,
                    letterSpacing: letterSpacing,
                },
                style,
            ]}
            {...props}
        >
            {children}
        </RNText>
    );
};

export default Typography;

const styles = StyleSheet.create({
    font: {
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
});
