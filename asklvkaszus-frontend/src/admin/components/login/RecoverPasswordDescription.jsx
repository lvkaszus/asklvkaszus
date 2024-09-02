import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Folder, InfoRounded, Terminal } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const RecoverPasswordDescription = ({ open, onClose }) => {
    const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
        <IconButton edge="end" color="inherit" onClick={onClose} onTouchEnd={onClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
            <CloseIcon />
        </IconButton>

        <DialogContent>
            <Box sx={{ textAlign: 'center' }}>
                <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                    <InfoRounded />
                    {t('recoverpassword-title')}
                </Typography>
                <Typography component='p'>
                    {t('recoverpassword-description')}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <Folder />
                <Typography component='code' sx={{ fontFamily: 'revert', fontSize: '12px', borderWidth: '1px', borderStyle: 'solid', padding: '4px' }}>asklvkaszus-backend/asklvkaszus/tools/change_admin_password.py</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                <Terminal />
                <Typography component='code' sx={{ fontFamily: 'revert', fontSize: '12px', borderWidth: '1px', borderStyle: 'solid', padding: '4px' }}>python3 change_admin_password.py</Typography>
            </Box>


            <Box sx={{ fontWeight: 300, textAlign: 'center', fontSize: '14px', marginTop: '24px' }}>
                <Link to='#' onClick={onClose}>
                    {t('dialog-close')}
                </Link>
            </Box>
        </DialogContent>
    </Dialog>
  );
};

export default RecoverPasswordDescription;
