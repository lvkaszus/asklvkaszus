import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, FormControlLabel, IconButton, Switch, TextField, Typography, InputAdornment, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { Close, InfoOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SendConfigureTelegramNotificationsRequest } from "../../requests/SendConfigureTelegramNotificationsRequest";

const Telegram = ({ userData, dialogSettingsOpen, handleDialogSettingsClose, configureTelegramNotificationsOutputData, setConfigureTelegramNotificationsNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);

    const [telegramEnabled, setTelegramEnabled] = useState(false);
    const [telegramBotToken, setTelegramBotToken] = useState('');
    const [telegramBotChatId, setTelegramBotChatId] = useState('');

    const [showTelegramBotToken, setShowTelegramBotToken] = useState(false);

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

    const handleTelegramBotTokenVisibility = () => {
        setShowTelegramBotToken(!showTelegramBotToken);
    };

    const handleTelegramBotChatIdValue = (event) => {
        setTelegramBotChatId(event.target.value);
    }

    const { configureTelegramNotificationsError, configureTelegramNotificationsResponse, handleConfigureTelegramNotificationsRequest } = SendConfigureTelegramNotificationsRequest(telegramEnabled, telegramBotToken, telegramBotChatId);

    useEffect(() => {
        configureTelegramNotificationsOutputData(configureTelegramNotificationsError, configureTelegramNotificationsResponse);
    }, [configureTelegramNotificationsError, configureTelegramNotificationsResponse]);

    const handleDialogSettingsConfirm = async () => {
        setDialogConfirmOpen(true);
    };

    const handleDialogConfirm = async () => {
        setDialogConfirmButtonDisabled(true);

        await handleConfigureTelegramNotificationsRequest();
        setConfigureTelegramNotificationsNotifyOpen(true);

        setDialogConfirmButtonDisabled(false);

        handleUserDataUpdate();
        handleDialogSettingsClose();
        setDialogConfirmOpen(false);
    }

    const handleDialogConfirmClose = () => {
        setDialogConfirmOpen(false);
    }

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

                            {userData.telegram_enabled ? (
                                t('admin-cn-notificationsmanagement')
                            ) : (
                                t('admin-cn-notificationsconfiguration')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <FormControl sx={{ margin: '8px' }} variant="outlined">
                                <InputLabel htmlFor="telegram-bot-token">{t('admin-cn-telegramnotifications-bottoken')}</InputLabel>
                                <OutlinedInput
                                    id="telegram-bot-token"
                                    type={showTelegramBotToken ? 'text' : 'password'}
                                    value={telegramBotToken}
                                    onChange={handleTelegramBotTokenValue}
                                    fullWidth
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showTelegramBotToken ? 'Ukryj token bota' : 'Pokaż token bota'
                                                }
                                                onClick={handleTelegramBotTokenVisibility}
                                                edge="end"
                                            >
                                                {showTelegramBotToken ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label={t('admin-cn-telegramnotifications-bottoken')}
                                />
                            </FormControl>

                            <TextField
                                label={t('admin-cn-telegramnotifications-chatid')}
                                variant="outlined"
                                value={telegramBotChatId}
                                onChange={handleTelegramBotChatIdValue}
                                sx={{ margin: '8px' }}
                            />

                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginY: '16px' }}>
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
    );
}

export default Telegram