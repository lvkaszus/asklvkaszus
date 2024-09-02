import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { Close, Warning, GroupRemove } from "@mui/icons-material";
import { SendUnblockAllSendersRequest } from "../requests/SendUnblockAllSendersRequest";
import { useTranslation } from "react-i18next";

const UnblockAllSendersButton = ({ unblockAllSendersOutputData, setUnblockAllSendersNotifyOpen, handleBlockedSendersDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const { unblockAllSendersError, unblockAllSendersResponse, handleUnblockAllSendersRequest } = SendUnblockAllSendersRequest();

    useEffect(() => {
        unblockAllSendersOutputData(unblockAllSendersError, unblockAllSendersResponse);
    }, [unblockAllSendersError, unblockAllSendersResponse]);

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);

        await handleUnblockAllSendersRequest();
        setUnblockAllSendersNotifyOpen(true);

        setDialogYesButtonDisabled(false);
        handleBlockedSendersDataUpdate();
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} fullWidth>
                <GroupRemove />
                {t('admin-uas-unblockallsenders')}
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <Warning />

                            {t('admin-uas-dialog-confirm-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {t('admin-uas-dialog-confirm-description')}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleConfirm} disabled={isDialogYesButtonDisabled} color="primary" sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UnblockAllSendersButton