import { useState } from 'react';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
};

export const SendSubscribeToPushNotificationsRequest = (publicKey) => {
    const [subscribeToPushNotificationsError, setSubscribeToPushNotificationsError] = useState(false);
    const [subscribeToPushNotificationsResponse, setSubscribeToPushNotificationsResponse] = useState('');

    const [isUserSubscribed, setIsUserSubscribed] = useState(false);

    const navigate = useNavigate();

    const submitSubscribeToPushNotificationsRequest = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                });

                console.log('Subscription details:', subscription);

                const csrfToken = await SendFetchCsrfTokenRequest();

                const response = await axios.post(`${domain}/api/app/admin/subscribe_to_push_notifications`, {
                    endpoint: subscription.endpoint,
                    keys: subscription.toJSON().keys,
                },
                {
                    headers: {
                        'X-CSRFToken': csrfToken
                    }
                });

                const { success } = response.data;

                setIsUserSubscribed(true);

                setSubscribeToPushNotificationsResponse(success);
                setSubscribeToPushNotificationsError(false);

            } catch (error) {
                if (error.response) {
                    const { error: responseError } = error.response.data;

                    if (
                        responseError.includes("Token") ||
                        responseError.includes("CSRF")
                    ) {
                        setSubscribeToPushNotificationsResponse('Please login again!');
                        setSubscribeToPushNotificationsError(true);

                        navigate('/admin/login');

                    } else {
                        setSubscribeToPushNotificationsResponse(responseError);
                        setSubscribeToPushNotificationsError(true);
                        
                    }
                } else {
                    setSubscribeToPushNotificationsResponse('');
                    setSubscribeToPushNotificationsError(true);

                    console.error('An error occurred while sending a request to subscribe to push notifications!', error);
                }
            }
        } else {
            setSubscribeToPushNotificationsResponse('');
            setSubscribeToPushNotificationsError(true);

            console.error('Service Worker is not available in this browser!');
        }
    };

    const handleSubscribeToPushNotificationsRequest = async () => {
        await submitSubscribeToPushNotificationsRequest();
    };

    return {
        subscribeToPushNotificationsError,
        subscribeToPushNotificationsResponse,
        isUserSubscribed,
        handleSubscribeToPushNotificationsRequest,
    };
};
