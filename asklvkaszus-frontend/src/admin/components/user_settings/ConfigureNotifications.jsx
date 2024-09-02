import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, FormControlLabel, IconButton, Switch, TextField, Typography } from "@mui/material";
import { Close, NotificationsNone, Notifications, InfoOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SendConfigureNotificationsRequest } from "../requests/SendConfigureNotificationsRequest";

const ConfigureNotifications = ({ userData, configureNotificationsOutputData, setConfigureNotificationsNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogSettingsOpen, setDialogSettingsOpen] = useState(false);
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);

    const [telegramEnabled, setTelegramEnabled] = useState(false);
    const [telegramBotToken, setTelegramBotToken] = useState('');
    const [telegramBotChatId, setTelegramBotChatId] = useState('');

    useEffect(() => {
        if (userData) {
            setTelegramEnabled(userData.telegram_enabled || false);
            setTelegramBotToken(userData.telegram_bot_token || '');
            setTelegramBotChatId(userData.telegram_bot_chat_id || '');
        }
    }, [userData]);

    const [isDialogConfirmButtonDisabled, setDialogConfirmButtonDisabled] = useState(false);

    const handleTelegramBotTokenValue = (event) => {
        setTelegramBotToken(event.target.value);
    }

    const handleTelegramBotChatIdValue = (event) => {
        setTelegramBotChatId(event.target.value);
    }

    const handleDialogSettingsOpen = () => {
        setDialogSettingsOpen(true);
    };

    const { configureNotificationsError, configureNotificationsResponse, handleConfigureNotificationsRequest } = SendConfigureNotificationsRequest(telegramEnabled, telegramBotToken, telegramBotChatId);

    useEffect(() => {
        configureNotificationsOutputData(configureNotificationsError, configureNotificationsResponse);
    }, [configureNotificationsError, configureNotificationsResponse]);

    const handleDialogSettingsConfirm = async () => {
        setDialogConfirmOpen(true);
    };

    const handleDialogConfirm = async () => {
        setDialogConfirmButtonDisabled(true);

        await handleConfigureNotificationsRequest();
        setConfigureNotificationsNotifyOpen(true);

        setDialogConfirmButtonDisabled(false);

        handleUserDataUpdate();
        setDialogSettingsOpen(false);
        setDialogConfirmOpen(false);
    }

    const handleDialogSettingsClose = () => {
        setDialogSettingsOpen(false);
    };

    const handleDialogConfirmClose = () => {
        setDialogConfirmOpen(false);
    }

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleDialogSettingsOpen} fullWidth>
                {telegramEnabled ? (
                    <>
                        <Notifications />
                        {t('admin-cn-editnotificationssettings')}
                    </>
                ) : (
                    <>
                        <NotificationsNone />
                        {t('admin-cn-configurenotifications')}
                    </>
                )}
            </Button>

            <Dialog open={dialogSettingsOpen} onClose={handleDialogSettingsClose}>
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

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <Typography component='p'>
                                {t('admin-cn-telegramnotifications-enabled')}
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={telegramEnabled}
                                        onChange={(e) => setTelegramEnabled(e.target.checked)}
                                    />
                                }
                                label={telegramEnabled ? t('enabled') : t('disabled')}
                                sx={{ marginLeft: 'auto' }}
                            />
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                label={t('admin-cn-telegramnotifications-bottoken')}
                                autoFocus
                                variant="outlined"
                                value={telegramBotToken}
                                onChange={handleTelegramBotTokenValue}
                                fullWidth
                                sx={{ marginBottom: '16px' }}
                            />

                            <TextField
                                label={t('admin-cn-telegramnotifications-chatid')}
                                variant="outlined"
                                value={telegramBotChatId}
                                onChange={handleTelegramBotChatIdValue}
                                fullWidth
                            />
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleDialogSettingsClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('cancel')}
                        </Button>
                        <Button variant="outlined" onClick={handleDialogSettingsConfirm} color="primary" sx={{ marginX: '4px' }}>
                            {t('confirm')}
                        </Button>
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

                            {telegramEnabled ? (
                                t('admin-cn-dialog-confirm-changecurrentconfiguration-title')
                            ) : (
                                t('admin-cn-dialog-confirm-newconfiguration-title')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {telegramEnabled ? (
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
    )
}

export default ConfigureNotifications