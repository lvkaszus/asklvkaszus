import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Dialog, DialogContent, Divider, IconButton, TextField, Typography } from "@mui/material";
import { Close, Done, InfoOutlined, LockReset, Warning } from "@mui/icons-material";
import { SendChangePasswordRequest } from "../requests/SendChangePasswordRequest";
import { useTranslation } from "react-i18next";

const ChangePassword = ({ changePasswordOutputData, setChangePasswordNotifyOpen, handleUserDataUpdate }) => {
    const { t } = useTranslation();

    const [dialogChangePasswordOpen, setDialogChangePasswordOpen] = useState(false);
    const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [passwordStrength, setPasswordStrength] = useState({
        length: false,
        uppercase: false,
        digit: false,
        specialChar: false,
    });

    const [isDialogChangePasswordConfirmButtonDisabled, setDialogChangePasswordConfirmButtonDisabled] = useState(true);
    const [isDialogConfirmButtonDisabled, setDialogConfirmButtonDisabled] = useState(false);

    const handleOldPasswordValue = (event) => {
        setOldPassword(event.target.value);
    }

    const handleNewPasswordValue = (event) => {
        setNewPassword(event.target.value);
        checkPasswordStrength(event.target.value);
    }

    const handleConfirmNewPasswordValue = (event) => {
        setConfirmNewPassword(event.target.value);
    }

    const checkPasswordStrength = (value) => {
        const lengthRegex = /^.{12,}$/;
        const uppercaseRegex = /[A-Z]/;
        const digitRegex = /\d/;
        const specialCharRegex = /[!@#$%^&*]/;
    
        setPasswordStrength({
          length: lengthRegex.test(value),
          uppercase: uppercaseRegex.test(value),
          digit: digitRegex.test(value),
          specialChar: specialCharRegex.test(value)
        });
      };
  
    useEffect(() => {
        checkPasswordStrength(newPassword);
    
        const isAnyPasswordRequirementFalse = Object.values(passwordStrength).some(value => value === false);
        const isOldPasswordEntered = oldPassword.length > 0;
        const isNewPasswordEntered = newPassword.length > 0;
        const isConfirmNewPasswordEntered = confirmNewPassword.length > 0;
        const areNewPasswordsSame = newPassword === confirmNewPassword;
    
        if (isAnyPasswordRequirementFalse || !isOldPasswordEntered || !isNewPasswordEntered || !isConfirmNewPasswordEntered || !areNewPasswordsSame) {
          setDialogChangePasswordConfirmButtonDisabled(true);

        } else {
          setDialogChangePasswordConfirmButtonDisabled(false);

        }
    }, [oldPassword, newPassword, confirmNewPassword]);

    const handleDialogChangePasswordOpen = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        setDialogChangePasswordOpen(true);
    };
    
    const { changePasswordError, changePasswordResponse, handleChangePasswordRequest } = SendChangePasswordRequest(oldPassword, newPassword, confirmNewPassword);

    useEffect(() => {
        changePasswordOutputData(changePasswordError, changePasswordResponse);
    }, [changePasswordError, changePasswordResponse]);

    const handleDialogChangePasswordConfirm = async () => {
        setDialogConfirmOpen(true);
    };

    const handleDialogConfirm = async () => {
        setDialogConfirmButtonDisabled(true);

        await handleChangePasswordRequest();
        setChangePasswordNotifyOpen(true);

        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');

        setDialogConfirmButtonDisabled(false);

        handleUserDataUpdate();
        setDialogChangePasswordOpen(false);
        setDialogConfirmOpen(false);
    }

    const handleDialogChangePasswordClose = () => {
        setDialogChangePasswordOpen(false);
    };

    const handleDialogConfirmClose = () => {
        setDialogConfirmOpen(false);
    }

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleDialogChangePasswordOpen} fullWidth>
                <LockReset />
                {t('admin-cp-changepassword')}
            </Button>

            <Dialog open={dialogChangePasswordOpen} onClose={handleDialogChangePasswordClose}>
                <IconButton edge="end" color="inherit" onClick={handleDialogChangePasswordClose} onTouchEnd={handleDialogChangePasswordClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoOutlined />

                            {t('admin-cp-dialog-changepassword-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                id="password"
                                type="password"
                                label={t('admin-cp-dialog-changepassword-currentpassword')}
                                autoComplete="password"
                                name="password"
                                autoFocus
                                variant="outlined"
                                value={oldPassword}
                                onChange={handleOldPasswordValue}
                                fullWidth
                                sx={{ marginBottom: '16px' }}
                            />

                            <TextField
                                id="new-password"
                                type="password"
                                label={t('admin-cp-dialog-changepassword-newpassword')}
                                autoComplete="new-password"
                                name="newPassword"
                                variant="outlined"
                                value={newPassword}
                                onChange={handleNewPasswordValue}
                                fullWidth
                                sx={{ marginBottom: '16px' }}
                            />

                            <TextField
                                id="confirm-password"
                                type="password"
                                label={t('admin-cp-dialog-changepassword-confirmnewpassword')}
                                autoComplete="new-password"
                                name="confirmPassword"
                                variant="outlined"
                                value={confirmNewPassword}
                                onChange={handleConfirmNewPasswordValue}
                                fullWidth
                            />
                        </Box>
                    </Box>

                    <Card variant="outlined" sx={{ textAlign: 'left', marginY: '8px' }}>
                        <CardContent>
                            {passwordStrength.length ? (
                                <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                    <Done />
                                    {t('register-password-length')}
                                </Typography>
                            ) : (
                                <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                    <Close />
                                    {t('register-password-length')}
                                </Typography>
                            )}

                            {passwordStrength.uppercase ? (
                                <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                    <Done />
                                    {t('register-password-uppercase')}
                                </Typography>
                            ) : (
                                <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                    <Close />
                                    {t('register-password-uppercase')}
                                </Typography>
                            )}

                            {passwordStrength.digit ? (
                                <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                    <Done />
                                    {t('register-password-digit')}
                                </Typography>
                            ) : (
                                <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                    <Close />
                                    {t('register-password-digit')}
                                </Typography>
                            )}

                            {passwordStrength.specialChar ? (
                                <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                    <Done />
                                    {t('register-password-specialchar')}
                                </Typography>
                            ) : (
                                <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                    <Close />
                                    {t('register-password-specialchar')}
                                </Typography>
                            )}

                            {newPassword && confirmNewPassword ? (
                                newPassword === confirmNewPassword ? (
                                    <Typography component='p' color="lightgreen" sx={{ fontWeight: 300 }}>
                                        <Done />
                                        {t('register-password-same')}
                                    </Typography>
                                ) : (
                                    <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                        <Close />
                                        {t('register-password-same')}
                                    </Typography>
                                )
                            ) : (
                                <Typography component='p' color="lightcoral" sx={{ fontWeight: 300 }}>
                                    <Close />
                                    {t('register-password-nopasswords')}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleDialogChangePasswordClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('cancel')}
                        </Button>
                        <Button variant="outlined" onClick={handleDialogChangePasswordConfirm} color="primary" disabled={isDialogChangePasswordConfirmButtonDisabled} sx={{ marginX: '4px' }}>
                            {t('confirm')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={dialogConfirmOpen} onClose={handleDialogConfirmClose}>
                <IconButton edge="end" color="inherit" onClick={handleDialogConfirmClose} onTouchEnd={handleDialogConfirmClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <Warning />

                            {t('admin-cp-dialog-confirm-title')}
                        </Typography>

                        <Divider sx={{ marginY: '16px' }} />

                        <Typography component='p'>
                            {t('admin-cp-dialog-confirm-description')}
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleDialogConfirmClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleDialogConfirm} disabled={isDialogConfirmButtonDisabled} color="primary" sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChangePassword