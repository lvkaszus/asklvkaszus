import React, { useState } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { Close, Warning, Refresh, CheckCircle, Key } from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import CheckAdminApiKeyCopyResult from "../results/CheckAdminApiKeyCopyResult";

const ShowAdminApiKey = ({ adminApiKey }) => {
    const { t } = useTranslation();

    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);

    const [dialogSummaryOpen, setDialogSummaryOpen] = useState(false);
    const [isSummaryDialogCopyButtonDisabled, setSummaryDialogCopyButtonDisabled] = useState(false);

    const [adminApiKeyCopyError, setAdminApiKeyCopyError] = useState(false);
    const [isCopyAdminApiKeyNotifyOpen, setCopyAdminApiKeyNotifyOpen] = useState(false);

    const handleOpenConfirmDialog = () => {
        setDialogConfirmOpen(true);
    };

    const handleConfirmAccept = async () => {
        setDialogConfirmOpen(false);
        setDialogSummaryOpen(true);
    };

    const handleConfirmClose = () => {
        setDialogConfirmOpen(false);
    };

    const handleCopyAdminApiKey = async () => {
        setSummaryDialogCopyButtonDisabled(true);

        try {
            await navigator.clipboard.writeText(adminApiKey || "");
            
            setAdminApiKeyCopyError(false);
        } catch (err) {
            setAdminApiKeyCopyError(true);
        }

        setCopyAdminApiKeyNotifyOpen(true);
        setSummaryDialogCopyButtonDisabled(false);
    }

    const handleSummaryClose = () => {
        setDialogSummaryOpen(false);
    };

    const handleCopyAdminApiKeyNotifyClose = () => {
        setCopyAdminApiKeyNotifyOpen(false);
    }

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpenConfirmDialog} fullWidth>
                <Refresh />
                {t('admin-saa-showadminapikey')}
            </Button>

            <Dialog open={dialogConfirmOpen} onClose={handleConfirmClose}>
                <IconButton edge="end" color="inherit" onClick={handleConfirmClose} onTouchEnd={handleConfirmClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <Warning />

                            {t('admin-saa-dialog-confirm-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {t('admin-saa-dialog-confirm-description')}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleConfirmClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleConfirmAccept} color="primary" sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={dialogSummaryOpen} onClose={handleSummaryClose}>
                <IconButton edge="end" color="inherit" onClick={handleSummaryClose} onTouchEnd={handleSummaryClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <CheckCircle />
                            
                            {t('admin-saa-dialog-confirmed-title')}
                        </Typography>
                        <Typography  component='p'>
                            {t('admin-saa-dialog-confirmed-description')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                        <Key />
                        <Typography component='code' sx={{ fontFamily: 'revert', fontSize: '12px', borderWidth: '1px', borderStyle: 'solid', padding: '4px' }}>{adminApiKey || t('admin-saa-dialog-confirmed-error')}</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="outlined" onClick={handleSummaryClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('close')}
                        </Button>
                        <Button variant="contained" onClick={handleCopyAdminApiKey} color="primary" disabled={isSummaryDialogCopyButtonDisabled} sx={{ marginX: '4px' }}>
                            {t('admin-saa-dialog-confirmed-copyadminapikey')}
                        </Button>
                    </Box>

                    <CheckAdminApiKeyCopyResult open={isCopyAdminApiKeyNotifyOpen} error={adminApiKeyCopyError} onClose={handleCopyAdminApiKeyNotifyClose} />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ShowAdminApiKey