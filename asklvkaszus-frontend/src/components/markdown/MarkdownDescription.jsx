import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Dialog, DialogContent, Divider, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { InfoRounded } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const MarkdownDescription = ({ open, onClose }) => {
    const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose}>
        <IconButton edge="end" color="inherit" onClick={onClose} onTouchEnd={onClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
            <Close />
        </IconButton>

        <DialogContent sx={{ textAlign: 'center' }}>
            <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                <InfoRounded />
                {t('markdown-whatismarkdown-title')}
            </Typography>

            <Typography component='p'>
                {t('markdown-whatismarkdown-description')}
            </Typography>

            <Divider sx={{ marginY: '16px' }} />

            <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                <InfoRounded />
                {t('markdown-howtouse-title')}
            </Typography>

            <Box sx={{ textAlign: 'left' }}>
                <Typography component='p'>
                    - <Typography component='code' sx={{ fontFamily: 'revert' }}>{t('markdown-howtouse-method-1')}</Typography>
                    <Typography component='span'> - {t('markdown-howtouse-description-1')}</Typography>
                </Typography>
                <Typography component='p'>
                    - <Typography component='code' sx={{ fontFamily: 'revert' }}>{t('markdown-howtouse-method-2')}</Typography>
                    <Typography component='span'> - {t('markdown-howtouse-description-2')}</Typography>
                </Typography>
                <Typography component='p'>
                    - <Typography component='code' sx={{ fontFamily: 'revert' }}>{t('markdown-howtouse-method-3')}</Typography>
                    <Typography component='span'> - {t('markdown-howtouse-description-3')}</Typography>
                </Typography>
                <Typography component='p'>
                    - <Typography component='code' sx={{ fontFamily: 'revert' }}>{t('markdown-howtouse-method-4')}</Typography>
                    <Typography component='span'> - {t('markdown-howtouse-description-4')}</Typography>
                </Typography>
                <Typography component='p'>
                    - <Typography component='code' sx={{ fontFamily: 'revert' }}>{t('markdown-howtouse-method-5')}</Typography>
                    <Typography component='span'> - {t('markdown-howtouse-description-5')}</Typography>
                </Typography>
            </Box>

            <Box sx={{ marginTop: '24px', fontWeight: 300, textAlign: 'center', fontSize: '14px' }}>
                <Link to="#" onClick={onClose}>
                    {t('dialog-close')}
                </Link>
            </Box>
        </DialogContent>
    </Dialog>
  );
};

export default MarkdownDescription;
