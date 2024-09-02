import React, { useState, useEffect } from "react";
import { Button, Menu, MenuItem, Dialog, DialogContent, IconButton, Typography, Box, Divider } from "@mui/material";
import { InfoRounded, Close, Delete, Visibility, Settings, Block } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { SendPurgeQuestionRequest } from "../requests/SendPurgeQuestionRequest";
import { SendToggleQuestionVisibilityRequest } from "../requests/SendToggleQuestionVisibilityRequest";
import { SendBlockSenderRequest } from "../requests/SendBlockSenderRequest";

const ManageQuestionMenu = ({ question_id, sender_ip, purgeQuestionOutputData, PurgeQuestionNotifyOpen, toggleQuestionVisibilityOutputData, ToggleQuestionVisibilityNotifyOpen, blockSenderOutputData, BlockSenderNotifyOpen, handleForceDataFetch }) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleActionClick = (action) => {
        setAnchorEl(null);
        setActionType(action);
        setDialogOpen(true);
    };

    const { purgeQuestionError, purgeQuestionResponse, handlePurgeQuestionRequest } = SendPurgeQuestionRequest(question_id);

    useEffect(() => {
        purgeQuestionOutputData(purgeQuestionError, purgeQuestionResponse);
    }, [purgeQuestionError, purgeQuestionResponse]);

    const { toggleQuestionVisibilityError, toggleQuestionVisibilityResponse, handleToggleQuestionVisibilityRequest } = SendToggleQuestionVisibilityRequest(question_id);

    useEffect(() => {
        toggleQuestionVisibilityOutputData(toggleQuestionVisibilityError, toggleQuestionVisibilityResponse);
    }, [toggleQuestionVisibilityError, toggleQuestionVisibilityResponse]);

    const { blockSenderError, blockSenderResponse, handleBlockSenderRequest } = SendBlockSenderRequest(sender_ip);

    useEffect(() => {
        blockSenderOutputData(blockSenderError, blockSenderResponse, sender_ip);
    }, [blockSenderError, blockSenderResponse]);

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);

        if (actionType === "delete") {
            await handlePurgeQuestionRequest();
            PurgeQuestionNotifyOpen(true);

        } else if (actionType === "toggleVisibility") {
            await handleToggleQuestionVisibilityRequest();
            ToggleQuestionVisibilityNotifyOpen(true);

        } else {
            await handleBlockSenderRequest();
            BlockSenderNotifyOpen(true);

        }

        setDialogYesButtonDisabled(false);
        handleForceDataFetch();
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button variant="contained" color="primary" onClick={handleMenuClick}>
                <Settings />
                {t('admin-mq-options')}
            </Button>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleActionClick("delete")}>
                    <Delete /> {t('admin-mq-deletequestion')}
                </MenuItem>
                <MenuItem onClick={() => handleActionClick("toggleVisibility")}>
                    <Visibility /> {t('admin-mq-togglequestionvisibility')}
                </MenuItem>
                <MenuItem onClick={() => handleActionClick("blockSender")}>
                    <Block /> {t('admin-mq-blocksender')}
                </MenuItem>
            </Menu>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />

                            {actionType === "delete" ? (
                                t('admin-mq-dialog-deletequestion-title')
                            ) : (actionType === "toggleVisibility" ? (
                                t('admin-mq-dialog-togglequestionvisibility-title')
                            ): (
                                t('admin-mq-dialog-blocksender-title')
                            ))}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {actionType === "delete" ? (
                                t('admin-mq-dialog-deletequestion-description')
                            ) : (actionType === "toggleVisibility" ? (
                                t('admin-mq-dialog-togglequestionvisibility-description')
                            ): (
                                t('admin-mq-dialog-blocksender-description')
                            ))}
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
}

export default ManageQuestionMenu;
