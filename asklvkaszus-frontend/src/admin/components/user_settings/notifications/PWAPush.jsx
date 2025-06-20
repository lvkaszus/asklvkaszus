import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, FormControlLabel, IconButton, Switch, Typography, Alert } from "@mui/material";
import { Close, InfoOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SendFetchVapidPublicKeyRequest } from "../../requests/SendFetchVapidPublicKeyRequest";
import { SendSubscribeToPushNotificationsRequest } from "../../requests/SendSubscribeToPushNotificationsRequest";
import { SendConfigureWebPushNotificationsRequest } from "../../requests/SendConfigureWebPushNotificationsRequest";

const PWAPush = ({ userData, dialogSettingsOpen, handleDialogSettingsClose, fetchVapidPublicKeyOutputData, setFetchVapidPublicKeyNotifyOpen, subscribeToPushNotificationsOutputData, setSubscribeToPushNotificationsNotifyOpen, configureWebPushNotificationsOutputData, setConfigureWebPushNotificationsNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);


    const [webPushEnabled, setWebPushEnabled] = useState(true);

    useEffect(() => {
        if (userData) {
            setWebPushEnabled(userData.push_notifications_enabled || false);
        }
    }, [userData]);


    const [vapidPublicKey, setVapidPublicKey] = useState(null);

    const { fetchVapidPublicKeyError, fetchVapidPublicKeyResponse, handleFetchVapidPublicKeyRequest } = SendFetchVapidPublicKeyRequest();

    useEffect(() => {
        if (fetchVapidPublicKeyResponse) {
            fetchVapidPublicKeyOutputData(fetchVapidPublicKeyError, fetchVapidPublicKeyResponse);
        }

        if (fetchVapidPublicKeyError === false) {
            setVapidPublicKey(fetchVapidPublicKeyResponse);
            setFetchVapidPublicKeyNotifyOpen(false);
            
        } else {
            setFetchVapidPublicKeyNotifyOpen(true);

        }
    }, [fetchVapidPublicKeyResponse]);

    useEffect(() => {
        handleFetchVapidPublicKeyRequest();
    }, [])


    const [isDialogConfirmButtonDisabled, setDialogConfirmButtonDisabled] = useState(false);

    const handleWebPushEnabledValue = () => {
        setWebPushEnabled(!webPushEnabled);
    };


    const { subscribeToPushNotificationsError, subscribeToPushNotificationsResponse, isUserSubscribed, handleSubscribeToPushNotificationsRequest } = SendSubscribeToPushNotificationsRequest(vapidPublicKey);

    useEffect(() => {
        subscribeToPushNotificationsOutputData(subscribeToPushNotificationsError, subscribeToPushNotificationsResponse);
    }, [subscribeToPushNotificationsError, subscribeToPushNotificationsResponse]);

    const handleSubscribeUser = async () => {
        await handleSubscribeToPushNotificationsRequest();
        setSubscribeToPushNotificationsNotifyOpen(true);
    }


    const { configureWebPushNotificationsError, configureWebPushNotificationsResponse, handleConfigureWebPushNotificationsRequest } = SendConfigureWebPushNotificationsRequest(webPushEnabled);

    useEffect(() => {
        configureWebPushNotificationsOutputData(configureWebPushNotificationsError, configureWebPushNotificationsResponse);
    }, [configureWebPushNotificationsError, configureWebPushNotificationsResponse]);


    const handleDialogSettingsConfirm = async () => {
        setDialogConfirmOpen(true);
    };

    const handleDialogConfirm = async () => {
        setDialogConfirmButtonDisabled(true);

        await handleConfigureWebPushNotificationsRequest();
        setConfigureWebPushNotificationsNotifyOpen(true);

        setDialogConfirmButtonDisabled(false);

        handleUserDataUpdate();
        handleDialogSettingsClose();
        setDialogConfirmOpen(false);
    }

    const handleDialogConfirmClose = () => {
        setDialogConfirmOpen(false);
    }


    const isSecureConnection = window.location.protocol === 'https:'

    return (
        <>
            <Dialog fullWidth maxWidth="sm" open={dialogSettingsOpen} onClose={handleDialogSettingsClose}>
                <IconButton edge="end" color="inherit" onClick={handleDialogSettingsClose} onTouchEnd={handleDialogSettingsClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoOutlined />
                            {t('admin-cn-notificationsmanagement')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {isSecureConnection ? (
                                <>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: '16px' }}>
                                        <Typography component='p'>
                                            {t('admin-cn-pushnotifications-enabled')}
                                        </Typography>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={webPushEnabled}
                                                    onChange={(e) => handleWebPushEnabledValue(e.target.checked)}
                                                />
                                            }
                                            label={webPushEnabled ? t('enabled') : t('disabled')}
                                            sx={{ marginLeft: 'auto' }}
                                        />
                                    </Box>

                                    {webPushEnabled && (
                                        <Button variant="outlined" onClick={handleSubscribeUser} disabled={isUserSubscribed} color="primary">
                                            {isUserSubscribed ? t('admin-cn-pushnotifications-alreadysubscribed') : t('admin-cn-pushnotifications-subscribe')}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Box>
                                    <Alert severity="error" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {t('admin-error-configurenotifications-insecureconnection')}
                                    </Alert>
                                </Box>
                            )}
                        </Box>

                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        {isSecureConnection ? (
                            <>
                                <Button variant="contained" onClick={handleDialogSettingsClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                                    {t('cancel')}
                                </Button>
                                <Button variant="outlined" onClick={handleDialogSettingsConfirm} color="primary" sx={{ marginX: '4px' }}>
                                    {t('confirm')}
                                </Button>
                            </>
                        ) : (
                            <Button variant="contained" onClick={handleDialogSettingsClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                                {t('cancel')}
                            </Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={dialogConfirmOpen} onClose={handleDialogConfirmClose}>
                <IconButton edge="end" color="inherit" onClick={handleDialogConfirmClose} onTouchEnd={handleDialogConfirmClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoOutlined />

                            {webPushEnabled ? (
                                t('admin-cn-dialog-confirm-changecurrentconfiguration-title')
                            ) : (
                                t('admin-cn-dialog-confirm-newconfiguration-title')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {webPushEnabled ? (
                                t('admin-cn-dialog-confirm-changecurrentconfiguration-description')
                            ) : (
                                t('admin-cn-dialog-confirm-newconfiguration-description')
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleDialogConfirmClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleDialogConfirm} disabled={isDialogConfirmButtonDisabled} color="primary" sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default PWAPush