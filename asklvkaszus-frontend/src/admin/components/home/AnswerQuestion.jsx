import React, { useState, useEffect } from "react";
import { Close, InfoRounded, Reply } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent, Divider, IconButton, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import MarkdownDescription from "../../../components/markdown/MarkdownDescription";
import { SendAnswerQuestionRequest } from "../requests/SendAnswerQuestionRequest";
import { Link } from "react-router-dom";
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const AnswerQuestion = ({ question_id, questionText, answer, markdownAdminEnabled, answerQuestionOutputData, AnswerQuestionNotifyOpen, handleForceDataFetch }) => {
    const { t } = useTranslation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmEditOpen, setConfirmEditOpen] = useState(false);
    const [answerText, setAnswerText] = useState('');
    const [isMarkdownDialogOpen, setMarkdownDialogOpen] = useState(false);
    const [isDialogYesButtonDisabled, setDialogYesButtonDisabled] = useState(false);

    const handleReplyDialogOpen = () => {
        if (answer !== "Not answered yet!") {
            setAnswerText(answer);
        } else {
            setAnswerText('');
        }
        setDialogOpen(true);
    }

    const handleAnswerChange = (event) => {
        setAnswerText(event.target.value);
    }

    const handleMarkdownDialogOpen = () => {
        setMarkdownDialogOpen(true);
    };
    
    const handleMarkdownDialogClose = () => {
        setMarkdownDialogOpen(false);
    };

    const { answerQuestionError, answerQuestionResponse, handleAnswerQuestionRequest } = SendAnswerQuestionRequest(question_id, answerText);

    useEffect(() => {
        answerQuestionOutputData(answerQuestionError, answerQuestionResponse);
    }, [answerQuestionError, answerQuestionResponse]);

    const handleConfirm = async () => {
        if (answer !== "Not answered yet!" && answer !== answerText) {
            setConfirmEditOpen(true);
        } else {
            await handleAnswerSubmit();
        }
    }

    const handleAnswerSubmit = async () => {
        setDialogYesButtonDisabled(true);
        await handleAnswerQuestionRequest();
        AnswerQuestionNotifyOpen(true);
        setAnswerText('');
        setDialogYesButtonDisabled(false);
        handleForceDataFetch();
        setDialogOpen(false);
    }

    const handleClose = () => {
        setDialogOpen(false);
    }

    const handleConfirmEdit = async () => {
        await handleAnswerSubmit();
        setConfirmEditOpen(false);
    }

    const handleCancelEdit = () => {
        setConfirmEditOpen(false);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '4px' }}>
            <Button variant="contained" color="primary" onClick={handleReplyDialogOpen} sx={{ width: '100%' }}>
                <Reply />
                {t('admin-aq-replytoquestion')}
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px', wordBreak: 'break-word' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />

                            {t('admin-aq-dialog-reply-title')} "<Typography component='span'>{questionText}</Typography>"
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <TextField
                        multiline
                        minRows={4}
                        placeholder={t('admin-aq-dialog-reply-placeholder')}
                        value={answerText}
                        onChange={handleAnswerChange}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />

                    <Typography component='p' sx={{ fontWeight: 300, fontSize: '14px' }}>
                        {markdownAdminEnabled ? (
                            t('sqf-markdownenabled')
                        ) : (
                            t('sqf-markdowndisabled')
                        )}

                        &nbsp;

                        (
                            <Link to='#' css={css({ textDecoration: 'underline' })} onClick={handleMarkdownDialogOpen}>{t('sqf-whatismarkdown')}</Link>
                        )
                    </Typography>

                    <MarkdownDescription open={isMarkdownDialogOpen} onClose={handleMarkdownDialogClose} />

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleClose} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('cancel')}
                        </Button>
                        <Button variant="outlined" onClick={handleConfirm} disabled={isDialogYesButtonDisabled} color="primary" sx={{ marginX: '4px' }}>
                            {t('admin-aq-dialog-reply-sendanswer')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={confirmEditOpen} onClose={handleCancelEdit}>
                <IconButton edge="end" color="inherit" onClick={handleClose} onTouchEnd={handleClose} aria-label="close" sx={{ position: 'absolute', top: '10px', right: '15px' }}>
                    <Close />
                </IconButton>

                <DialogContent sx={{ padding: '20px 40px', wordBreak: 'break-word' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography component='p' sx={{ fontWeight: 500, fontSize: '18px' }}>
                            <InfoRounded />

                            {t('admin-aq-dialog-edit-title')}
                        </Typography>
                    </Box>

                    <Divider sx={{ marginY: '16px' }} />

                    <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
                        <Button variant="contained" onClick={handleCancelEdit} color="primary" autoFocus sx={{ marginX: '4px' }}>
                            {t('no')}
                        </Button>
                        <Button variant="outlined" onClick={handleConfirmEdit} disabled={isDialogYesButtonDisabled} color="primary" sx={{ marginX: '4px' }}>
                            {t('yes')}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default AnswerQuestion;
