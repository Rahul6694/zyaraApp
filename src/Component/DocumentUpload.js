import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React,{useState} from 'react';
import Typography from './UI/Typography';
import {Font} from '../Constants/Font';
import ImageModal from './Modals/ImageModal';

const DocumentUpload = ({
  images,
  text = '',
  text2 = '',
  onChage = () => {},
  style = {},
}) => {
  const [showImage, setShowImage] = useState(false)
  
  const handlePress = () => {
    console.log('DocumentUpload pressed, opening modal');
    setShowImage(true);
  };
  
  // Check if images is an object with uri/path (selected image) or a require() object
  const imageSource = typeof images === 'object' && images !== null && (images.uri || images.path)
    ? {uri: images.uri || images.path}
    : images;

  const hasSelectedImage = typeof images === 'object' && images !== null && (images.uri || images.path);

  return (
    <>
      <TouchableOpacity
      onPress={handlePress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: 140,
          borderWidth: 1,
          borderRadius: 7,
          borderColor: 'rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          ...style,
        }}>
        {hasSelectedImage ? (
          <Image 
            source={imageSource} 
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }} 
          />
        ) : (
          <>
            <Image source={imageSource} style={{width: 40, height: 40}} />
            <Typography
              type={Font?.Poppins_Regular}
              fontWeight={400}
              size={10}
              textAlign={"center"}
              color="#000"
              lineHeight={15}>
              {text}
            </Typography>
            {text2 && (
              <Typography
                type={Font?.Poppins_Regular}
                fontWeight={400}
                size={10}
                textAlign={"center"}
                color="#000"
                lineHeight={15}>
                ({`${text2}`})
              </Typography>
            )}
          </>
        )}
      </TouchableOpacity>

      <ImageModal
        showModal={showImage}
        selected={v => {
          console.log(v, 'v--------------->'), onChage(v[0])
        }}
        close={() => {
          setShowImage(!showImage);
        }}
      />
    </>
  );
};

export default DocumentUpload;

const styles = StyleSheet.create({});
