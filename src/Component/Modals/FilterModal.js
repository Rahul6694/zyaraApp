import React, {useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Typography from '../UI/Typography';
import {Colors} from '../../Constants/Colors';
import {Font} from '../../Constants/Font';

export const SORT_OPTIONS = [
  {label: 'Recommended', value: 'newest'},
  {label: 'Price: Low to High', value: 'price_asc'},
  {label: 'Price: High to Low', value: 'price_desc'},
  {label: 'Top Rated', value: 'rating'},
  {label: 'Biggest Discount', value: 'discount'},
];

export const PRICE_OPTIONS = [
  {label: 'Under ₹500', min: undefined, max: 500},
  {label: '₹500 – ₹1,000', min: 500, max: 1000},
  {label: '₹1,000 – ₹2,500', min: 1000, max: 2500},
  {label: '₹2,500 – ₹5,000', min: 2500, max: 5000},
  {label: 'Above ₹5,000', min: 5000, max: undefined},
];

export const RATING_OPTIONS = [
  {label: '4.0+', value: 4},
  {label: '4.5+', value: 4.5},
];

export const EMPTY_FILTERS = {
  sort: 'newest',
  categoryId: null,
  priceIndex: null,
  minRating: null,
};

// Number of filters that differ from the defaults (shown as a badge)
export const countActiveFilters = filters =>
  [
    filters.sort !== EMPTY_FILTERS.sort,
    filters.categoryId !== null,
    filters.priceIndex !== null,
    filters.minRating !== null,
  ].filter(Boolean).length;

// Convert UI filter state into API query params
export const filtersToParams = filters => {
  const price = PRICE_OPTIONS[filters.priceIndex];
  return {
    sort: filters.sort,
    category_id: filters.categoryId ?? undefined,
    min_price: price?.min,
    max_price: price?.max,
    min_rating: filters.minRating ?? undefined,
  };
};

const Chip = ({label, selected, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.chip, selected && styles.chipSelected]}>
    <Typography
      size={13}
      type={selected ? Font.GeneralSans_Semibold : Font.GeneralSans_Medium}
      color={selected ? Colors.brandDark : Colors.textPrimary}>
      {label}
    </Typography>
  </TouchableOpacity>
);

const Section = ({title, children}) => (
  <View style={styles.section}>
    <Typography
      size={15}
      type={Font.GeneralSans_Semibold}
      color={Colors.textPrimary}
      style={styles.sectionTitle}>
      {title}
    </Typography>
    <View style={styles.chipWrap}>{children}</View>
  </View>
);

const FilterModal = ({
  visible,
  onClose = () => {},
  onApply = () => {},
  filters = EMPTY_FILTERS,
  categories = [],
}) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(filters);

  // Start from the applied filters each time the sheet opens
  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  const update = (key, value) =>
    setDraft(prev => ({...prev, [key]: prev[key] === value ? EMPTY_FILTERS[key] : value}));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={[styles.sheet, {paddingBottom: insets.bottom + 16}]}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Typography size={19} type={Font.GeneralSans_Semibold} color={Colors.textPrimary}>
              Filters
            </Typography>
            <TouchableOpacity onPress={() => setDraft(EMPTY_FILTERS)} hitSlop={10}>
              <Typography size={14} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                Clear all
              </Typography>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.body}>
            <Section title="Sort by">
              {SORT_OPTIONS.map(option => (
                <Chip
                  key={option.value}
                  label={option.label}
                  selected={draft.sort === option.value}
                  onPress={() => setDraft(prev => ({...prev, sort: option.value}))}
                />
              ))}
            </Section>

            {categories.length > 0 && (
              <Section title="Category">
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    selected={draft.categoryId === category.id}
                    onPress={() => update('categoryId', category.id)}
                  />
                ))}
              </Section>
            )}

            <Section title="Price">
              {PRICE_OPTIONS.map((option, index) => (
                <Chip
                  key={option.label}
                  label={option.label}
                  selected={draft.priceIndex === index}
                  onPress={() => update('priceIndex', index)}
                />
              ))}
            </Section>

            <Section title="Rating">
              {RATING_OPTIONS.map(option => (
                <Chip
                  key={option.value}
                  label={`★ ${option.label}`}
                  selected={draft.minRating === option.value}
                  onPress={() => update('minRating', option.value)}
                />
              ))}
            </Section>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.footerButton, styles.cancelButton]}
              onPress={onClose}>
              <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.brand}>
                Cancel
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.footerButton, styles.applyButton]}
              onPress={() => onApply(draft)}>
              <Typography size={15} type={Font.GeneralSans_Semibold} color={Colors.white}>
                Apply
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  body: {
    flexGrow: 0,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipSelected: {
    borderColor: Colors.brand,
    backgroundColor: Colors.brandSoft,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  footerButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: Colors.brand,
  },
  applyButton: {
    backgroundColor: Colors.brand,
  },
});
