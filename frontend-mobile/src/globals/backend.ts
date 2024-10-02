export const BACKEND_URL = 'http://10.0.0.132'; //'https://3a89-2601-404-cb02-ed20-91c6-e7ad-186b-3d0b.ngrok-free.app';

(async function() {
    console.log(BACKEND_URL);
    const response = await fetch(`${BACKEND_URL}/get/dasdasdas`);

    if(!response.ok) {
        console.error('Backend not available');
        return;
    }

    console.log('Backend available');
})();

