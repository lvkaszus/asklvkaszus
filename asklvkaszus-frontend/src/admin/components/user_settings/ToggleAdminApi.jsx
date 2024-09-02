import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { Close, AdminPanelSettings, DoNotDisturb, InfoRounded } from "@mui/icons-material";
import { SendToggleAdminApiRequest } from "../requests/SendToggleAdminApiRequest";
import { useTranslation } from "react-i18next";

const ToggleAdminApi = ({ adminApiEnabled, toggleAdminApiOutputData, setToggleAdminApiNotifyOpen, username, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const { toggleAdminApiError, toggleAdminApiResponse, handleToggleAdminApiRequest } = SendToggleAdminApiRequest();

    useEffect(() => {
        toggleAdminApiOutputData(toggleAdminApiError, toggleAdminApiResponse, username);
    }, [toggleAdminApiError, toggleAdminApiResponse]);

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);

        await handleToggleAdminApiRequest();
        setToggleAdminApiNotifyOpen(true);

        setDialogYesButtonDisabled(false);
        handleUserDataUpdate();
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                {adminApiEnabled ? (
                    <>
                        <DoNotDisturb />
                        {t('admin-taa-disableadminapi')}
                    </>
                ) : (
                    <>
                        <AdminPanelSettings />
                        {t('admin-taa-enableadminapi')}
                    </>
                )}
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />
                            
                            {adminApiEnabled ? (
                                t('admin-taa-dialog-disable-title')
                            ) : (
                                t('admin-taa-dialog-enable-title')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {adminApiEnabled ? (
                                t('admin-taa-dialog-disable-description')
                            ) : (
                                t('admin-taa-dialog-enable-description')

                            )}
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

export default ToggleAdminApi