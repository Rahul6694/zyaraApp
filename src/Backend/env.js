import {Platform} from 'react-native';

export const MixPanelKey = "";

// Local backend (zyara_backend running on this Mac: `cd zyara_backend && npm start`, port 4000)
// Android emulator reaches the Mac via 10.0.2.2, iOS simulator via localhost.
// On a physical phone, replace LOCAL_HOST with your Mac's Wi-Fi IP (e.g. '192.168.1.5').
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const BASE_URL = `http://${LOCAL_HOST}:4000/api/`;

// Remote server API URL (switch back to this to use the hosted backend)
// export const BASE_URL = 'http://72.61.224.206:3000/api/';

// Production API URL (commented - DNS issue in emulator)
// export const BASE_URL = 'http://api.zyara.co/api/';

export const mapKey = 'AIzaSyCt8jw_uRbRfr9_8CBRdauiHY8rWCjV6WU';

