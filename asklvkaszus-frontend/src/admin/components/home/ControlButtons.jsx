import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Delete, Visibility, Close, InfoRounded } from "@mui/icons-material";
import { SendPurgeAllQuestionsRequest } from "../requests/SendPurgeAllQuestionsRequest";
import { SendToggleAllQuestionsVisibilityRequest } from "../requests/SendToggleAllQuestionsVisibilityRequest";

const ControlButtons = ({ purgeAllQuestionsOutputData, PAQNotifyOpen, toggleAllQuestionsVisibilityOutputData, TAQVisibilityNotifyOpen, handleForceDataFetch }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState("");

    const handleActionClick = (action) => {
        setActionType(action);
        setDialogOpen(true);
    };

    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const { purgeAllQuestionsError, purgeAllQuestionsResponse, handlePurgeAllQuestionsRequest } = SendPurgeAllQuestionsRequest();

    const { toggleAllQuestionsVisibilityError, toggleAllQuestionsVisibilityResponse, handleToggleAllQuestionsVisibilityRequest } = SendToggleAllQuestionsVisibilityRequest();

    useEffect(() => {
        purgeAllQuestionsOutputData(purgeAllQuestionsError, purgeAllQuestionsResponse);
    }, [purgeAllQuestionsError, purgeAllQuestionsResponse]);

    useEffect(() => {
        toggleAllQuestionsVisibilityOutputData(toggleAllQuestionsVisibilityError, toggleAllQuestionsVisibilityResponse);
    }, [toggleAllQuestionsVisibilityError, toggleAllQuestionsVisibilityResponse]);

    const handleConfirm = async () => {
        if (actionType === "delete") {
            setDialogYesButtonDisabled(true);
            await handlePurgeAllQuestionsRequest();
            PAQNotifyOpen(true);
            setDialogYesButtonDisabled(false);
            handleForceDataFetch();

        } else if (actionType === "toggleVisibility") {
            setDialogYesButtonDisabled(true);
            await handleToggleAllQuestionsVisibilityRequest();
            TAQVisibilityNotifyOpen(true);
            setDialogYesButtonDisabled(false);
            handleForceDataFetch();
        }
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={() => handleActionClick("delete")} sx={{ marginX: '4px' }}>
                <Delete /> {t('admin-cb-purgeallquestions')}
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleActionClick("toggleVisibility")} sx={{ marginX: '4px' }}>
                <Visibility /> {t('admin-cb-togglequestionsvisibility')}
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />

                            {actionType === "delete" ? (
                                t('admin-cb-dialog-delete-title')
                            ) : (
                                t('admin-cb-dialog-togglequestionsvisibility-title')
                            )}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {actionType === "delete" ? (
                                t('admin-cb-dialog-delete-description')
                            ) : (
                                t('admin-cb-dialog-togglequestionsvisibility-description')
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
        </Box>
    );
};

export default ControlButtons;
