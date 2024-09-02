import { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendAnswerQuestionRequest = (questionId, answerText) => {
  const { t } = useTranslation();

  const [answerQuestionError, setAnswerQuestionError] = useState(false);
  const [answerQuestionResponse, setAnswerQuestionResponse] = useState('');

  const navigate = useNavigate();

  const submitAnswerQuestionRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        const response = await axios.put(
          `${domain}/api/app/admin/answer_question`,
          { question_id: questionId, question_answer: answerText },
          {
            headers: {
              'X-CSRFToken': csrfToken,
            }
          }
        );
        
        const { success } = response.data;

        setAnswerQuestionResponse(success);
        setAnswerQuestionError(false);

      } catch (error) {
        if (error.response) {
          const { error: responseError } = error.response.data;

          if (
            responseError.includes("Token") ||
            responseError.includes("CSRF")
          ) {
            setAnswerQuestionResponse('Please login again!');
            setAnswerQuestionError(true);

            navigate('/admin/login');

          } else {
            setAnswerQuestionResponse(responseError);
            setAnswerQuestionError(true);
            
          }
        } else {
          setAnswerQuestionResponse('');
          setAnswerQuestionError(true);

          console.error(`${t('admin-error-answerquestion')} ${error}`);
        }
    }
  };

  const handleAnswerQuestionRequest = async () => {
    await submitAnswerQuestionRequest();
  };

  return {
    answerQuestionError,
    answerQuestionResponse,
    handleAnswerQuestionRequest,
  };
};