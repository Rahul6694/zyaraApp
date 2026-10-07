import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import Button from '../../Component/Button';
import ImageModal from '../../Component/Modals/ImageModal';
import GalleryViewer from '../../Component/Modals/GalleryViewer';
import { getMyGallery, uploadGalleryImages, deleteGalleryImage } from '../../Backend/BookingAPI';
import { getImageUrl } from '../../Utils/imageUrl';

const { width } = Dimensions.get('window');
const COLUMNS = 3;
const GAP = 8;
const TILE = (width - 44 - GAP * (COLUMNS - 1)) / COLUMNS;
const MAX_PER_UPLOAD = 10;

const BeauticianGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [maxImages, setMaxImages] = useState(30);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [viewerIndex, setViewerIndex] = useState(null);

    const loadGallery = useCallback(() => {
        getMyGallery(
            res => {
                setPhotos(res?.data || []);
                if (res?.max_images) {
                    setMaxImages(res.max_images);
                }
                setLoading(false);
            },
            () => setLoading(false),
        );
    }, []);

    useFocusEffect(loadGallery);

    const remaining = Math.max(maxImages - photos.length, 0);

    const handleUpload = images => {
        const picked = (images || []).slice(0, Math.min(MAX_PER_UPLOAD, remaining));
        if (!picked.length) {
            return;
        }
        if (images.length > picked.length) {
            SimpleToast.show(`Only ${picked.length} photo${picked.length === 1 ? '' : 's'} will be added`, SimpleToast.SHORT);
        }

        const formData = new FormData();
        picked.forEach((img, i) => {
            formData.append('images', {
                uri: img.path || img.uri,
                type: img.mime || 'image/jpeg',
                name: img.filename || `gallery-${Date.now()}-${i}.jpg`,
            });
        });

        setUploading(true);
        uploadGalleryImages(
            formData,
            res => {
                setUploading(false);
                setPhotos(prev => [...(res?.data || []), ...prev]);
                SimpleToast.show('Photos added — customers can see them on your profile', SimpleToast.SHORT);
            },
            err => {
                setUploading(false);
                SimpleToast.show(err?.data?.message || 'Could not upload photos', SimpleToast.SHORT);
            },
        );
    };

    const handleDelete = photo => {
        Alert.alert('Delete photo', 'Remove this photo from your gallery?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () =>
                    deleteGalleryImage(
                        photo.id,
                        () => setPhotos(prev => prev.filter(p => p.id !== photo.id)),
                        err => SimpleToast.show(err?.data?.message || 'Could not delete photo', SimpleToast.SHORT),
                    ),
            },
        ]);
    };

    const openPicker = () => {
        if (!remaining) {
            SimpleToast.show(`Gallery is full (${maxImages} photos). Delete some to add more.`, SimpleToast.SHORT);
            return;
        }
        setShowImageModal(true);
    };

    const renderPhoto = ({ item, index }) => (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setViewerIndex(index)}
            onLongPress={() => handleDelete(item)}
            style={styles.tile}>
            <Image source={{ uri: getImageUrl(item.image) }} style={styles.tileImage} />
            <TouchableOpacity
                onPress={() => handleDelete(item)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                style={styles.deleteBadge}>
                <Typography type={Font.GeneralSans_Semibold} size={14} color={Colors.white} style={styles.deleteBadgeText}>
                    ×
                </Typography>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#EFFFF4', '#FFFFFF']} style={styles.flex}>
            <SafeAreaView style={styles.flex}>
                <ScreenHeader title="My Gallery" showGreenLine={true} />

                <FlatList
                    data={photos}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderPhoto}
                    numColumns={COLUMNS}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <>
                            <Typography type={Font.GeneralSans_Regular} size={14} color={Colors.textSecondary} style={styles.hint}>
                                Show customers your best work. These photos appear on your profile when customers choose a beautician.
                            </Typography>

                            <TouchableOpacity
                                style={[styles.addTile, !remaining && styles.addTileDisabled]}
                                onPress={openPicker}
                                disabled={uploading}
                                activeOpacity={0.8}>
                                {uploading ? (
                                    <ActivityIndicator color={Colors.brand} />
                                ) : (
                                    <>
                                        <Typography type={Font.GeneralSans_Semibold} size={28} color={Colors.brand}>
                                            +
                                        </Typography>
                                        <Typography type={Font.GeneralSans_Semibold} size={15} color={Colors.brand}>
                                            Add photos
                                        </Typography>
                                        <Typography type={Font.GeneralSans_Regular} size={12} color={Colors.textSecondary} style={styles.addTileSub}>
                                            Up to {MAX_PER_UPLOAD} at a time · {photos.length}/{maxImages} used
                                        </Typography>
                                    </>
                                )}
                            </TouchableOpacity>

                            {photos.length > 0 && (
                                <Typography type={Font.GeneralSans_Regular} size={12} color={Colors.textSecondary} style={styles.tip}>
                                    Tap a photo to view it, tap × to delete.
                                </Typography>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        loading ? (
                            <ActivityIndicator color={Colors.brand} style={styles.loader} />
                        ) : (
                            <Typography type={Font.GeneralSans_Regular} size={14} color={Colors.textSecondary} style={styles.empty}>
                                No photos yet. Add a few to help customers pick you.
                            </Typography>
                        )
                    }
                />

                {photos.length > 0 && (
                    <View style={styles.bottomContainer}>
                        <Button
                            title="ADD MORE PHOTOS"
                            onPress={openPicker}
                            loader={uploading}
                            disabled={!remaining}
                            linerColor={['#00B272', '#00B272']}
                        />
                    </View>
                )}

                <ImageModal
                    showModal={showImageModal}
                    multiple
                    cropping={false}
                    selected={images => {
                        setShowImageModal(false);
                        handleUpload(images);
                    }}
                    close={() => setShowImageModal(false)}
                    mediaType="photo"
                />

                <GalleryViewer
                    images={photos}
                    index={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default BeauticianGallery;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 20,
    },
    hint: {
        lineHeight: 20,
        marginBottom: 14,
    },
    addTile: {
        height: 130,
        borderRadius: 16,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: Colors.brand,
        backgroundColor: Colors.brandTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    addTileDisabled: {
        opacity: 0.5,
    },
    addTileSub: {
        marginTop: 4,
    },
    tip: {
        marginBottom: 10,
    },
    columnWrapper: {
        gap: GAP,
        marginBottom: GAP,
    },
    tile: {
        width: TILE,
        height: TILE,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: Colors.brandSoft,
    },
    tileImage: {
        width: '100%',
        height: '100%',
    },
    deleteBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBadgeText: {
        lineHeight: 18,
    },
    loader: {
        marginTop: 30,
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
    },
    bottomContainer: {
        paddingHorizontal: 22,
        paddingBottom: 8,
        paddingTop: 2,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
});
