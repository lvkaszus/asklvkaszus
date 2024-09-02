import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { Close, Person, PersonOff, Warning } from "@mui/icons-material";
import { SendToggleUserApiRequest } from "../requests/SendToggleUserApiRequest";
import { useTranslation } from "react-i18next";

const ToggleUserApi = ({ userApiEnabled, toggleUserApiOutputData, setToggleUserApiNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const { toggleUserApiError, toggleUserApiResponse, handleToggleUserApiRequest } = SendToggleUserApiRequest();

    useEffect(() => {
        toggleUserApiOutputData(toggleUserApiError, toggleUserApiResponse);
    }, [toggleUserApiError, toggleUserApiResponse]);

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);

        await handleToggleUserApiRequest();
        setToggleUserApiNotifyOpen(true);

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
                {userApiEnabled ? (
                    <>
                        <PersonOff />
                        {t('admin-tua-disableuserapi')}
                    </>
                ) : (
                    <>
                        <Person />
                        {t('admin-tua-enableuserapi')}   
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
                            <Warning />

                            {userApiEnabled ? (
                                t('admin-tua-dialog-disable-title')
                            ) : (
                                t('admin-tua-dialog-enable-title')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {userApiEnabled ? (
                                t('admin-tua-dialog-disable-description')
                            ) : (
                                t('admin-tua-dialog-enable-description')
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

export default ToggleUserApi