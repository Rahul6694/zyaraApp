import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import SimpleToast from 'react-native-simple-toast';
import { Colors } from '../../Constants/Colors';
import { Font } from '../../Constants/Font';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import Input from '../../Component/Input';
import DropdownNew from '../../Component/DropdownNew';
import Button from '../../Component/Button';
import ImageModal from '../../Component/Modals/ImageModal';
import { GET } from '../../Backend/Backend';
import { CATEGORIES } from '../../Backend/api_routes';
import { getMyServices, createBeauticianService, deleteBeauticianService } from '../../Backend/BookingAPI';
import { getImageUrl, formatPrice } from '../../Utils/imageUrl';

const SERVICE_TYPES = [
    { label: 'Home visit', value: 'home_visit' },
    { label: 'At salon', value: 'at_salon' },
    { label: 'Online', value: 'online' },
];

const AddService = () => {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState(null);
    const [serviceType, setServiceType] = useState('home_visit');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [duration, setDuration] = useState('');
    const [description, setDescription] = useState('');
    const [cover, setCover] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        GET(
            `${CATEGORIES}?limit=100`,
            res => setCategories((res?.data || []).map(c => ({ label: c.name, value: c.id }))),
            () => {},
        );
    }, []);

    const loadServices = useCallback(() => {
        getMyServices(
            res => {
                setServices(res?.data || []);
                setLoadingServices(false);
            },
            () => setLoadingServices(false),
        );
    }, []);

    useFocusEffect(loadServices);

    const resetForm = () => {
        setName('');
        setCategoryId(null);
        setPrice('');
        setDiscount('');
        setDuration('');
        setDescription('');
        setCover(null);
        setErrors({});
    };

    const handleSave = () => {
        const next = {};
        if (!name.trim()) next.name = 'Service name is required';
        if (!categoryId) next.category = 'Select a category';
        if (!(Number(price) > 0)) next.price = 'Enter a valid price';
        if (discount && !(Number(discount) >= 0 && Number(discount) < 100)) next.discount = 'Discount must be 0–99%';
        if (duration && !(parseInt(duration, 10) > 0)) next.duration = 'Enter minutes, e.g. 60';
        setErrors(next);
        if (Object.keys(next).length) {
            return;
        }

        const formData = new FormData();
        formData.append('service_name', name.trim());
        formData.append('category_id', String(categoryId));
        formData.append('service_type', serviceType);
        formData.append('price', String(Number(price)));
        if (discount) formData.append('discount', String(Number(discount)));
        if (duration) formData.append('duration', String(parseInt(duration, 10)));
        if (description.trim()) formData.append('description', description.trim());
        formData.append('status', 'published');
        if (cover) {
            formData.append('cover_photo', {
                uri: cover.path || cover.uri,
                type: cover.mime || 'image/jpeg',
                name: cover.filename || 'cover.jpg',
            });
        }

        setSaving(true);
        createBeauticianService(
            formData,
            () => {
                setSaving(false);
                SimpleToast.show('Service added — customers can now book it', SimpleToast.SHORT);
                resetForm();
                loadServices();
            },
            err => {
                setSaving(false);
                SimpleToast.show(err?.data?.message || 'Could not add service', SimpleToast.SHORT);
            },
        );
    };

    const handleDelete = service => {
        Alert.alert('Delete service', `Remove "${service.service_name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () =>
                    deleteBeauticianService(
                        service.id,
                        () => loadServices(),
                        err => SimpleToast.show(err?.data?.message || 'Could not delete service', SimpleToast.SHORT),
                    ),
            },
        ]);
    };

    return (
        <LinearGradient colors={['#EFFFF4', '#FFFFFF']} style={styles.flex}>
            <SafeAreaView style={styles.flex}>
                <ScreenHeader title="Add Service" showGreenLine={true} />
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                        {/* Cover photo */}
                        <TouchableOpacity style={styles.cover} onPress={() => setShowImageModal(true)} activeOpacity={0.8}>
                            {cover ? (
                                <Image source={{ uri: cover.path || cover.uri }} style={styles.coverImage} />
                            ) : (
                                <View style={styles.coverPlaceholder}>
                                    <Typography size={28} color={Colors.brand}>+</Typography>
                                    <Typography size={14} type={Font.GeneralSans_Medium} color={Colors.textSecondary}>
                                        Add cover photo
                                    </Typography>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Input title="Service Name" placeholder="e.g. Bridal Makeup" value={name} onChange={setName} error={errors.name} showTitle />
                        <DropdownNew
                            title="Category"
                            data={categories}
                            value={categoryId}
                            onChange={item => setCategoryId(item.value)}
                            placeholder="select"
                            error={errors.category}
                            marginHorizontal={0}
                            MainBoxStyle={styles.dropdown}
                        />
                        <DropdownNew
                            title="Service Type"
                            data={SERVICE_TYPES}
                            value={serviceType}
                            onChange={item => setServiceType(item.value)}
                            placeholder="select"
                            marginHorizontal={0}
                            MainBoxStyle={styles.dropdown}
                        />
                        <View style={styles.row}>
                            <View style={styles.flex}>
                                <Input title="Price (₹)" placeholder="999" value={price} onChange={setPrice} keyboardType="numeric" error={errors.price} showTitle />
                            </View>
                            <View style={styles.flex}>
                                <Input title="Discount (%)" placeholder="0" value={discount} onChange={setDiscount} keyboardType="numeric" error={errors.discount} showTitle />
                            </View>
                        </View>
                        <Input title="Duration (minutes)" placeholder="60" value={duration} onChange={setDuration} keyboardType="numeric" error={errors.duration} showTitle />
                        <Input
                            title="Description"
                            placeholder="What's included?"
                            value={description}
                            onChange={setDescription}
                            multiline
                            numberOfLines={4}
                            style_inputContainer={styles.description}
                            showTitle
                        />

                        <Button title="Publish service" onPress={handleSave} loader={saving} style={styles.button} />

                        {/* Existing services */}
                        <Typography size={18} type={Font.GeneralSans_Semibold} color={Colors.textPrimary} style={styles.sectionTitle}>
                            Your services
                        </Typography>
                        {loadingServices ? (
                            <ActivityIndicator color={Colors.brand} />
                        ) : services.length === 0 ? (
                            <Typography size={14} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                You have not added any services yet.
                            </Typography>
                        ) : (
                            services.map(s => {
                                const img = getImageUrl(s.cover_photo);
                                return (
                                    <View key={s.id} style={styles.serviceRow}>
                                        {img ? <Image source={{ uri: img }} style={styles.thumb} /> : <View style={[styles.thumb, styles.thumbEmpty]} />}
                                        <View style={styles.flex}>
                                            <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.textPrimary} numberOfLines={1}>
                                                {s.service_name}
                                            </Typography>
                                            <Typography size={13} type={Font.GeneralSans_Regular} color={Colors.textSecondary}>
                                                {formatPrice(Number(s.discounted_price) || s.price)}
                                                {s.duration ? ` · ${s.duration} min` : ''} · {s.status}
                                            </Typography>
                                        </View>
                                        <TouchableOpacity onPress={() => handleDelete(s)}>
                                            <Typography size={13} type={Font.GeneralSans_Semibold} color={Colors.danger}>
                                                Delete
                                            </Typography>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>

                <ImageModal
                    showModal={showImageModal}
                    selected={images => {
                        if (images && images.length > 0) {
                            setCover(images[0]);
                        }
                        setShowImageModal(false);
                    }}
                    close={() => setShowImageModal(false)}
                    mediaType="photo"
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default AddService;

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: 40,
    },
    cover: {
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 6,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: Colors.brand,
        backgroundColor: Colors.brandTint,
    },
    coverImage: {
        width: '100%',
        height: '100%',
    },
    coverPlaceholder: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    description: {
        height: 110,
        alignItems: 'flex-start',
    },
    button: {
        marginTop: 10,
    },
    sectionTitle: {
        marginTop: 26,
        marginBottom: 8,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: 10,
        marginBottom: 8,
    },
    thumb: {
        width: 52,
        height: 52,
        borderRadius: 10,
    },
    thumbEmpty: {
        backgroundColor: Colors.brandSoft,
    },
});
