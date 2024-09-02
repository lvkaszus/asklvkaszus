import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, Typography, Button, Box } from '@mui/material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import MarkdownDescription from '../markdown/MarkdownDescription';
import CheckSubmitQuestionResult from '../results/CheckSubmitQuestionResult';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { SendSubmitQuestionRequest } from '../requests/SendSubmitQuestionRequest';
import { Link } from 'react-router-dom';

const SubmitQuestionForm = ({ markdownFrontendEnabled, questionsNeedApproval, forceQuestionsListDataFetch }) => {
    const { t } = useTranslation();

    const [questionText, setQuestionText] = useState('');
    const [isMarkdownDialogOpen, setMarkdownDialogOpen] = useState(false);
    const [isSubmitDialogOpen, setSubmitDialogOpen] = useState(false);
    const [isButtonDisabled, setButtonDisabled] = useState(false);

    const handleQuestionTextFieldChange = (event) => {
        setQuestionText(event.target.value.replace(/\n/g, ''));
    };

    const handleMarkdownDialogOpen = () => {
      setMarkdownDialogOpen(true);
    };
  
    const handleMarkdownDialogClose = () => {
      setMarkdownDialogOpen(false);
    };

    const { submitQuestionError, submitQuestionResponse, handleSubmitQuestionRequest } = SendSubmitQuestionRequest(questionText);

    const handleSendQuestion = async (event) => {
      event.preventDefault();
      setButtonDisabled(true);
      await handleSubmitQuestionRequest();
      setQuestionText('');
      setButtonDisabled(false);
      setSubmitDialogOpen(true);
      forceQuestionsListDataFetch();
    };

    const handleEnterKeyPress = async (event) => {
      if (event.key === 'Enter') {
        await handleSendQuestion(event);
      }
    };
    
    const handleSubmitDialogClose = () => {
      setSubmitDialogOpen(false);
    };

    return (
        <Box component="form" onSubmit={handleSendQuestion} sx={{ marginBottom: '16px', textAlign: 'left' }}>
            <Typography component='p' sx={{ fontWeight: 400, marginTop: '12px', marginBottom: '6px' }}>
                {t('sqf-title')}
            </Typography>

            <TextField
              label={(t('sqf-placeholder'))}
              multiline
              minRows={4}
              variant="filled"
              value={questionText}
              onChange={handleQuestionTextFieldChange}
              onKeyDown={handleEnterKeyPress}
              fullWidth
            />

            {questionsNeedApproval && (
                <Typography component='p' sx={{ marginTop: '4px', fontWeight: 300, fontSize: '14px' }}>{t('sqf-approvalenabled')}</Typography>
            )}

            <Button type="submit" onClick={handleSendQuestion} disabled={isButtonDisabled} fullWidth>
                <ChatBubbleIcon />
                {t('sqf-button')}
            </Button>

            <Typography component='p' sx={{ fontWeight: 300, fontSize: '14px' }}>
              {markdownFrontendEnabled ? (
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

            <CheckSubmitQuestionResult open={isSubmitDialogOpen} error={submitQuestionError} response={submitQuestionResponse} onClose={handleSubmitDialogClose}/>
        </Box>
    );
};

export default SubmitQuestionForm;