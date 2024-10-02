import Constants from 'expo-constants';

const { linkingUri } = Constants;

export const BACKEND_URL = 'http://localhost:8000/'; //`http://${ Constants.manifest2.extra.expoGo.debuggerHost.split(':').shift() }:8000`;

(async function() {
    console.log(BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/get/dasdasdas`);

    if(!response.ok) {
        console.error('Backend not available');
        return;
    }

    console.log('Backend available');
})();

