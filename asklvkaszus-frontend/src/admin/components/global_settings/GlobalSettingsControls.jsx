import React, { useState, useEffect } from "react";
import { Box, Typography, FormControlLabel, Switch, Divider, Card, CardContent, Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { SendUpdateAppSettingsRequest } from "../requests/SendUpdateAppSettingsRequest";
import CheckUpdateAppSettingsResult from "../results/CheckUpdateAppSettingsResult";
import { CheckBox, Close, InfoRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const GlobalSettingsControls = ({ appSettings, forceDataFetch }) => {
    const { t } = useTranslation();

    const [globalApiEnabled, setGlobalApiEnabled] = useState(false);
    const [markdownAdminEnabled, setMarkdownAdminEnabled] = useState(false);
    const [markdownFrontendEnabled, setMarkdownFrontendEnabled] = useState(false);
    const [questionsNeedApproval, setQuestionsNeedApproval] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const [isUpdateAppSettingsNotificationOpen, setUpdateAppSettingsNotificationOpen] = useState(false);

    useEffect(() => {
        if (appSettings) {
            setGlobalApiEnabled(appSettings.global_api_enabled || false);
            setMarkdownAdminEnabled(appSettings.markdown_admin_enabled || false);
            setMarkdownFrontendEnabled(appSettings.markdown_frontend_enabled || false);
            setQuestionsNeedApproval(appSettings.approve_questions_first || false);
        }
    }, [appSettings]);

    const { updateAppSettingsError, updateAppSettingsResponse, handleUpdateAppSettingsRequest } = SendUpdateAppSettingsRequest(globalApiEnabled, markdownFrontendEnabled, markdownAdminEnabled, questionsNeedApproval);

    const handleOpenConfirmDialog = () => {
        setDialogOpen(true);
    };

    const handleConfirm = async () => {
        setDialogYesButtonDisabled(true);
        await handleUpdateAppSettingsRequest();
        forceDataFetch();
        setUpdateAppSettingsNotificationOpen(true);
        setDialogYesButtonDisabled(false);
        setDialogOpen(false);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };

    const handleUpdateAppSettingsNotificationClose = () => {
        setUpdateAppSettingsNotificationOpen(false);
    };

    return (
        <>
            <Card variant="outlined" sx={{ width: '100%', maxWidth: '600px' }} className="fade-in">
                <CardContent>
                    <Typography variant="h5" component='h5' sx={{ textAlign: 'center' }}>
                        {t('admin-gsc-title')}
                    </Typography>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography component="p">
                            {t('admin-gsc-globalapienabled')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={globalApiEnabled}
                                    onChange={(e) => setGlobalApiEnabled(e.target.checked)}
                                />
                            }
                            label={globalApiEnabled ? t('enabled') : t('disabled')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography component="p">
                            {t('admin-gsc-adminmarkdownenabled')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={markdownAdminEnabled}
                                    onChange={(e) => setMarkdownAdminEnabled(e.target.checked)}
                                />
                            }
                            label={markdownAdminEnabled ? t('enabled') : t('disabled')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Typography component="p">
                            {t('admin-gsc-usermarkdownenabled')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={markdownFrontendEnabled}
                                    onChange={(e) => setMarkdownFrontendEnabled(e.target.checked)}
                                />
                            }
                            label={markdownFrontendEnabled ? t('enabled') : t('disabled')}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography component="p">
                            {t('admin-gsc-questionsapprovalenabled')}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={questionsNeedApproval}
                                    onChange={(e) => setQuestionsNeedApproval(e.target.checked)}
                                />
                            }
                            label={questionsNeedApproval ? t('enabled') : t('disabled')}
                        />
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box>
                        <Button variant="contained" onClick={handleOpenConfirmDialog} fullWidth>
                            <CheckBox />
                            {t('admin-gsc-savesettings')}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

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
                            {t('admin-gsc-dialog-save-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {t('admin-gsc-dialog-save-description')}
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

            <CheckUpdateAppSettingsResult open={isUpdateAppSettingsNotificationOpen} error={updateAppSettingsError} response={updateAppSettingsResponse} onClose={handleUpdateAppSettingsNotificationClose} />
        </>
    );
};

export default GlobalSettingsControls;
