import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

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
    const { t } = useTranslation();

    const [subscribeToPushNotificationsError, setSubscribeToPushNotificationsError] = useState(false);
    const [subscribeToPushNotificationsResponse, setSubscribeToPushNotificationsResponse] = useState('');

    const [isUserSubscribed, setIsUserSubscribed] = useState(false);

    const submitSubscribeToPushNotificationsRequest = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey),
                });

                console.log(t('admin-success-configurenotifications-aboutsubscription'), subscription);

                const response = await axios.post(`${domain}/api/app/admin/subscribe_to_push_notifications`, {
                    endpoint: subscription.endpoint,
                    keys: subscription.toJSON().keys,
                });

                const { success } = response.data;

                setIsUserSubscribed(true);

                setSubscribeToPushNotificationsResponse(success);
                setSubscribeToPushNotificationsError(false);

            } catch (error) {
                if (error.response) {
                    const { error: responseError } = error.response.data;

                    setSubscribeToPushNotificationsResponse(responseError);
                    setSubscribeToPushNotificationsError(true);
                } else {
                    setSubscribeToPushNotificationsResponse('');
                    setSubscribeToPushNotificationsError(true);

                    console.error(`${t('admin-error-subscribetopushnotifications')} ${error}`);
                }
            }
        } else {
            setSubscribeToPushNotificationsResponse('');
            setSubscribeToPushNotificationsError(true);

            console.error(t('admin-error-configurenotifications-serviceworker'));
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
