import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ScreenHeader from '../../Component/ScreenHeader';
import Typography from '../../Component/UI/Typography';
import { Font } from '../../Constants/Font';
import { Colors } from '../../Constants/Colors';
import { ImageConstant } from '../../Constants/ImageConstant';
import { customerDeleteAccount } from '../../Backend/CustomerAPI';
import { logOut } from '../../Redux/action';
import SimpleToast from 'react-native-simple-toast';
import Button from '../../Component/Button';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setLoading(true);
    customerDeleteAccount(
      (response) => {
        setLoading(false);
        SimpleToast.show('Account deleted successfully', SimpleToast.SHORT);
        dispatch(logOut());
      },
      (error) => {
        setLoading(false);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete account';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.lightGreen }}>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.white, Colors.lightGreen]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.backgroundGradient}
        />

        <ScreenHeader title="Settings" showGreenLine={true} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.section}>
              <Typography
                size={18}
                color={Colors.black}
                type={Font.GeneralSans_Semibold}
                style={styles.sectionTitle}
              >
                Danger Zone
              </Typography>

              <TouchableOpacity
                style={[styles.menuItem, styles.deleteItem]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                <View style={styles.menuItemContent}>
                  <Image
                    source={ImageConstant.logout}
                    style={[styles.menuIcon, { tintColor: '#FF3B30' }]}
                    resizeMode="contain"
                  />
                  <Typography
                    size={16}
                    color="#FF3B30"
                    type={Font.GeneralSans_Medium}
                  >
                    {loading ? 'Deleting Account...' : 'Delete Account'}
                  </Typography>
                </View>
                {loading ? (
                  <ActivityIndicator size="small" color="#FF3B30" />
                ) : (
                  <Image
                    source={ImageConstant.nextarrow}
                    style={[styles.arrowIcon, { tintColor: '#FF3B30' }]}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDeleteModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Typography
              size={20}
              color={Colors.black}
              type={Font.GeneralSans_Semibold}
              style={styles.modalTitle}
            >
              Delete Account
            </Typography>
            
            <Typography
              size={16}
              color="#515154"
              type={Font.GeneralSans_Regular}
              style={styles.modalMessage}
            >
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </Typography>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Typography
                  size={16}
                  color={Colors.black}
                  type={Font.GeneralSans_Medium}
                >
                  No
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
              >
                <Typography
                  size={16}
                  color={Colors.white}
                  type={Font.GeneralSans_Medium}
                >
                  Yes
                </Typography>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  backgroundGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 15,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  deleteItem: {
    borderColor: '#FFE5E5',
    backgroundColor: '#FFF5F5',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: Colors.zyaraGreen,
  },
  arrowIcon: {
    width: 12,
    height: 12,
    tintColor: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E3E3E3',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});

