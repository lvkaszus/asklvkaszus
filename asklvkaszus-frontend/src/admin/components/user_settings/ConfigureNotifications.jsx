import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { Close, Notifications, InfoOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Telegram from "./notifications/Telegram";
import WebPush from "./notifications/WebPush"

const ConfigureNotifications = ({ userData, configureTelegramNotificationsOutputData, setConfigureTelegramNotificationsNotifyOpen, configureWebPushNotificationsOutputData, setConfigureWebPushNotificationsNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogSettingsOpen, setDialogSettingsOpen] = useState(false);

    const [webPushDialogSettingsOpen, setWebPushDialogSettingsOpen] = useState(false);
    const [telegramDialogSettingsOpen, setTelegramDialogSettingsOpen] = useState(false);

    const [notificationProvider, setNotificationProvider] = useState('pwa');


    const handleDialogSettingsOpen = () => {
        setDialogSettingsOpen(true);
    };

    const handleDialogSettingsClose = () => {
        setDialogSettingsOpen(false);
    };


    const handleWebPushDialogOpen = () => {
        setWebPushDialogSettingsOpen(true);
    }

    const handleWebPushDialogClose = () => {
        setWebPushDialogSettingsOpen(false);
    }


    const handleTelegramDialogOpen = () => {
        setTelegramDialogSettingsOpen(true);
    }

    const handleTelegramDialogClose = () => {
        setTelegramDialogSettingsOpen(false);
    }


    const handleDialogSettingsConfirm = () => {
        if (notificationProvider === 'pwa') {
            handleWebPushDialogOpen();
        } else {
            handleTelegramDialogOpen();
        }

        setDialogSettingsOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleDialogSettingsOpen} fullWidth>
                <Notifications />
                {t('admin-cn-editnotificationssettings')}
            </Button>

            <Dialog fullWidth maxWidth="sm" open={dialogSettingsOpen} onClose={handleDialogSettingsClose}>
                <IconButton edge="end" color="inherit" onClick={handleDialogSettingsClose} onTouchEnd={handleDialogSettingsClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoOutlined />

                            {userData.telegram_enabled ? (
                                t('admin-cn-notificationsmanagement')
                            ) : (
                                t('admin-cn-notificationsconfiguration')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <Typography component='p'>
                                {t('admin-cn-notifications-provider')}
                            </Typography>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                <Select
                                    labelId="notification-provider-label"
                                    value={notificationProvider}
                                    onChange={(e) => setNotificationProvider(e.target.value)}
                                    label={t('choose-provider')}
                                    fullWidth
                                >
                                    <MenuItem value="telegram">{t('telegram')}</MenuItem>
                                    <MenuItem value="pwa">{t('pwa')}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleDialogSettingsConfirm} 
                            fullWidth 
                            sx={{ marginTop: '20px' }}
                        >
                            {t('choose')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {notificationProvider === 'telegram' && (
                <Telegram userData={userData} dialogSettingsOpen={telegramDialogSettingsOpen} handleDialogSettingsClose={handleTelegramDialogClose} configureTelegramNotificationsOutputData={configureTelegramNotificationsOutputData} setConfigureTelegramNotificationsNotifyOpen={setConfigureTelegramNotificationsNotifyOpen} handleUserDataUpdate={handleUserDataUpdate} />
            )}

            {notificationProvider === 'pwa' && (
                <WebPush userData={userData} dialogSettingsOpen={webPushDialogSettingsOpen} handleDialogSettingsClose={handleWebPushDialogClose} configureWebPushNotificationsOutputData={configureWebPushNotificationsOutputData} setConfigureWebPushNotificationsNotifyOpen={setConfigureWebPushNotificationsNotifyOpen} handleUserDataUpdate={handleUserDataUpdate} />
            )}
        </>
    );
}

export default ConfigureNotifications;
