import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getCMSData } from '../Backend/CMSAPI';
import ScreenHeader from '../Component/ScreenHeader';
import { Colors } from '../Constants/Colors';
import SimpleToast from 'react-native-simple-toast';

const { height } = Dimensions.get('window');

const CMSScreen = ({ route, navigation }) => {
  const { slug } = route.params || {};
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (slug) {
      handleCMS();
    } else {
      setIsLoading(false);
      setPageContent('<h3>No page specified.</h3>');
    }
  }, [slug]);

  const handleCMS = () => {
    console.log('🔹 Fetching CMS from API for slug:', slug);
    setIsLoading(true);
    
    getCMSData(
      slug,
      (response) => {
        console.log('✅ CMS API Response:', response);
        setIsLoading(false);
        
        // Handle different response formats
        let content = '';
        let title = '';
        
        if (response?.data) {
          // If response has data object
          if (typeof response.data === 'string') {
            content = response.data;
          } else if (response.data?.body || response.data?.content) {
            content = response.data.body || response.data.content || '';
            title = response.data.page_name || response.data.title || response.data.name || '';
          } else {
            content = JSON.stringify(response.data);
          }
        } else if (response?.body || response?.content) {
          // If response directly has body/content
          content = response.body || response.content || '';
          title = response.page_name || response.title || response.name || '';
        } else if (typeof response === 'string') {
          content = response;
        } else {
          content = '<h3>Unable to fetch content.</h3>';
        }

        if (!content || content.trim() === '') {
          content = '<h3>No content available for this page.</h3>';
        }

        setPageContent(content);
        setPageTitle(title || slug || 'CMS Page');
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      },
      (error) => {
        console.log('❌ CMS API Error:', error);
        setIsLoading(false);
        const errorMessage = error?.data?.message || error?.message || 'Error loading content';
        SimpleToast.show(errorMessage, SimpleToast.SHORT);
        setPageContent('<h3>Error loading content. Please try again later.</h3>');
        setPageTitle(slug || 'CMS Page');
      }
    );
  };

  const formattedTitle = pageTitle
    ? pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1).replace(/-/g, ' ')
    : slug
    ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ')
    : 'CMS Page';

  return (
    <View style={styles.container}>
      <ScreenHeader 
        title={formattedTitle} 
        showGreenLine={false}
      />
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.zyaraGreen} />
        </View>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <WebView
            originWhitelist={['*']}
            style={styles.webview}
            source={{
              html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                    }
                    body {
                      padding: 20px;
                      font-size: 16px;
                      line-height: 1.6;
                      color: #333;
                      background-color: #ffffff;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    }
                    h1, h2, h3, h4, h5, h6 {
                      color: #000000;
                      margin-top: 20px;
                      margin-bottom: 10px;
                      font-weight: 600;
                    }
                    h1 { font-size: 24px; }
                    h2 { font-size: 22px; }
                    h3 { font-size: 20px; }
                    p {
                      margin-bottom: 14px;
                      text-align: justify;
                    }
                    ul, ol {
                      margin-left: 20px;
                      margin-bottom: 14px;
                    }
                    li {
                      margin-bottom: 8px;
                    }
                    a {
                      color: ${Colors.zyaraGreen};
                      text-decoration: none;
                    }
                    a:hover {
                      text-decoration: underline;
                    }
                    strong, b {
                      font-weight: 600;
                    }
                    img {
                      max-width: 100%;
                      height: auto;
                      border-radius: 8px;
                      margin: 10px 0;
                    }
                  </style>
                </head>
                <body>${pageContent}</body>
              </html>
              `,
            }}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white,
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default CMSScreen;

