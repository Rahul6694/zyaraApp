import React, { useEffect, useState } from 'react';
import { Modal, View, Image, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Typography from '../UI/Typography';
import { Font } from '../../Constants/Font';
import { getImageUrl } from '../../Utils/imageUrl';

const { width, height } = Dimensions.get('window');

/**
 * Full-screen swipeable photo viewer.
 * @param {Array} images - [{ id, image, caption }]
 * @param {number|null} index - photo to open on; null keeps the viewer closed
 */
const GalleryViewer = ({ images = [], index = null, onClose = () => {} }) => {
    const [current, setCurrent] = useState(index || 0);

    useEffect(() => {
        if (index != null) {
            setCurrent(index);
        }
    }, [index]);

    const visible = index != null && images.length > 0;
    const caption = images[current]?.caption;

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.backdrop}>
                <SafeAreaView style={styles.flex}>
                    <View style={styles.topBar}>
                        <Typography type={Font.GeneralSans_Medium} size={15} color="#FFFFFF">
                            {current + 1} / {images.length}
                        </Typography>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={styles.close}>
                            <Typography type={Font.GeneralSans_Semibold} size={22} color="#FFFFFF" style={styles.closeText}>
                                ×
                            </Typography>
                        </TouchableOpacity>
                    </View>

                    {visible && (
                        <FlatList
                            data={images}
                            keyExtractor={(item, i) => String(item.id ?? i)}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            initialScrollIndex={index}
                            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
                            onMomentumScrollEnd={e => setCurrent(Math.round(e.nativeEvent.contentOffset.x / width))}
                            renderItem={({ item }) => (
                                <View style={styles.page}>
                                    <Image source={{ uri: getImageUrl(item.image) }} style={styles.image} resizeMode="contain" />
                                </View>
                            )}
                        />
                    )}

                    {!!caption && (
                        <Typography type={Font.GeneralSans_Regular} size={14} color="#FFFFFF" style={styles.caption}>
                            {caption}
                        </Typography>
                    )}
                </SafeAreaView>
            </View>
        </Modal>
    );
};

export default GalleryViewer;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    close: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeText: {
        lineHeight: 26,
    },
    page: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width,
        height: height * 0.75,
    },
    caption: {
        textAlign: 'center',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
});
