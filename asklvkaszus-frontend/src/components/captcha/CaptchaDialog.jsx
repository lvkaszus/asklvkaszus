import { Close, InfoRounded } from "@mui/icons-material";
import { Box, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CloudflareTurnstile from "./providers/CloudflareTurnstile";
import GoogleRecaptchaV2 from "./providers/GoogleRecaptchaV2";

const CaptchaDialog = ({ open, onClose, onVerify, captchaProvider, captchaSiteKey }) => {
    const { t } = useTranslation();

    return (
        <Dialog open={open} onClose={onClose}>
            <IconButton edge="end" color="inherit" onClick={onClose} onTouchEnd={onClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                <Close />
            </IconButton>

            <DialogContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <InfoRounded />
                    <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                        {t('captcha-title')}
                    </Typography>
                </Box>

                <Typography component='p' sx={{ marginTop: '16px' }}>
                    {t('captcha-description')}
                </Typography>

                <Divider sx={{ marginY: '16px' }} />



                {captchaProvider === "cf-turnstile" && (
                    <CloudflareTurnstile captchaSiteKey={captchaSiteKey} onVerify={onVerify} />
                )}
                {captchaProvider === "google-recaptcha-v2" && (
                    <GoogleRecaptchaV2 captchaSiteKey={captchaSiteKey} onVerify={onVerify} />
                )}



                <Divider sx={{ marginY: '16px' }} />

                <Box sx={{ marginTop: '24px', fontWeight: 300, textAlign: 'center', fontSize: '14px' }}>
                    <Link to="#" onClick={onClose}>
                        {t('dialog-close')}
                    </Link>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default CaptchaDialog