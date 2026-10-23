import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, Typography, LinearProgress, Box } from "@mui/material";

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || '@me';

const SuspenseFallback = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `Ask ${yourNickname}!`;
    }, []);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Card variant="outlined" sx={{ width: '300px', marginBottom: '4px' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography component='p'>{t('loading')}</Typography>

                    <LinearProgress sx={{ marginTop: '12px', width: '100%' }} />
                </CardContent>
            </Card>
        </Box>
    )
}

export default SuspenseFallback;
