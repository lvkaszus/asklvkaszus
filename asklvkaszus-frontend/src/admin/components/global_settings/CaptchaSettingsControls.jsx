import { useState, useEffect } from "react";
import { Box, Typography, FormControlLabel, Switch, Divider, CardContent, Button, Dialog, DialogContent, IconButton, Alert, Select, MenuItem, TextField, InputAdornment } from "@mui/material";
import { CheckBox, Close, InfoRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SendFetchCaptchaSettingsRequest } from "../requests/SendFetchCaptchaSettingsRequest";
import CheckFetchCaptchaSettingsResult from "../results/CheckFetchCaptchaSettingsResult";
import { SendUpdateCaptchaSettingsRequest } from "../requests/SendUpdateCaptchaSettingsRequest";
import CheckUpdateCaptchaSettingsResult from "../results/CheckUpdateCaptchaSettingsResult";

const CaptchaSettingsControls = () => {
    const { t } = useTranslation();

    const [captchaEnabled, setCaptchaEnabled] = useState(false);
    const [captchaProvider, setCaptchaProvider] = useState('cf-turnstile');
    const [captchaSiteKey, setCaptchaSiteKey] = useState('');
    const [captchaSecretKey, setCaptchaSecretKey] = useState('');

    const [showSecretKey, setShowSecretKey] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const [isFetchCaptchaSettingsNotificationOpen, setFetchCaptchaSettingsNotificationOpen] = useState(false);
    const [isUpdateCaptchaSettingsNotificationOpen, setUpdateCaptchaSettingsNotificationOpen] = useState(false);

    const { fetchCaptchaSettingsResponse, fetchCaptchaSettingsError, handleFetchCaptchaSettings } = SendFetchCaptchaSettingsRequest();

    useEffect(() => {
        handleFetchCaptchaSettings();
    }, [])

    useEffect(() => {
        if (!fetchCaptchaSettingsError) {
            setCaptchaEnabled(fetchCaptchaSettingsResponse?.captcha_enabled || false);
            setCaptchaProvider(fetchCaptchaSettingsResponse?.captcha_provider || 'cf-turnstile');
            setCaptchaSiteKey(fetchCaptchaSettingsResponse?.captcha_site_key || '');
            setCaptchaSecretKey(fetchCaptchaSettingsResponse?.captcha_secret_key || '');
        } else {
            setFetchCaptchaSettingsNotificationOpen(true);
        }
    }, [fetchCaptchaSettingsError, fetchCaptchaSettingsResponse]);

    const handleOpenConfirmDialog = () => {
        setDialogOpen(true);
    };

    const { updateCaptchaSettingsResponse, updateCaptchaSettingsError, handleUpdateCaptchaSettings } = SendUpdateCaptchaSettingsRequest(captchaEnabled, captchaProvider, captchaSiteKey, captchaSecretKey);

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);
        await handleUpdateCaptchaSettings();
        setUpdateCaptchaSettingsNotificationOpen(true);
        await handleFetchCaptchaSettings();
        setDialogYesButtonDisabled(false);
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleFetchCaptchaSettingsNotificationClose = () => {
        setFetchCaptchaSettingsNotificationOpen(false);
    };

    const handleUpdateCaptchaSettingsNotificationClose = () => {
        setUpdateCaptchaSettingsNotificationOpen(false);
    };

    const toggleSecretKeyVisibility = () => {
        setShowSecretKey(!showSecretKey);
    };

    return (
        <>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Typography component="p">
                        {t('admin-csc-captchaenabled')}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={captchaEnabled}
                                onChange={(e) => setCaptchaEnabled(e.target.checked)}
                            />
                        }
                        label={captchaEnabled ? t('enabled') : t('disabled')}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Typography component="p">
                        {t('admin-csc-captchaprovider')}
                    </Typography>
                    <Select
                        value={captchaProvider}
                        onChange={(e) => setCaptchaProvider(e.target.value)}
                        sx={{ textAlign: 'left' }}
                    >
                        <MenuItem value="cf-turnstile">Cloudflare Turnstile</MenuItem>
                        <MenuItem value="google-recaptcha-v2">Google reCAPTCHA - v2</MenuItem>
                    </Select>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Typography component="p">
                        {t('admin-csc-captchasitekey')}
                    </Typography>
                    <TextField
                        value={captchaSiteKey}
                        onChange={(e) => setCaptchaSiteKey(e.target.value)}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <Typography component="p">
                        {t('admin-csc-captchasecretkey')}
                    </Typography>
                    <TextField
                        value={captchaSecretKey}
                        onChange={(e) => setCaptchaSecretKey(e.target.value)}
                        type={showSecretKey ? 'text' : 'password'}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={toggleSecretKeyVisibility}>
                                            {showSecretKey ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                        sx={{ maxWidth: '400px' }}
                    />
                </Box>

                <Divider sx={{ marginY: '16px' }} />

                <Alert severity="warning" sx={{ textAlign: 'left' }}>
                    {t('admin-csc-warning')}
                </Alert>

                <Box>
                    <Button variant="contained" onClick={handleOpenConfirmDialog} fullWidth>
                        <CheckBox />
                        {t('admin-csc-savesettings')}
                    </Button>
                </Box>
            </CardContent>

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
            >
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />
                            {t('admin-csc-dialog-save-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {t('admin-csc-dialog-save-description')}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleConfirm} color="primary" disabled={isDialogYesButtonDisabled} sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <CheckFetchCaptchaSettingsResult open={isFetchCaptchaSettingsNotificationOpen} error={fetchCaptchaSettingsError} response={fetchCaptchaSettingsResponse} onClose={handleFetchCaptchaSettingsNotificationClose} />

            <CheckUpdateCaptchaSettingsResult open={isUpdateCaptchaSettingsNotificationOpen} error={updateCaptchaSettingsError} response={updateCaptchaSettingsResponse} onClose={handleUpdateCaptchaSettingsNotificationClose} />
        </>
    );
};

export default CaptchaSettingsControls;
