import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendAnswerQuestionRequest = () => {
  const [answerQuestionError, setAnswerQuestionError] = useState(false);
  const [answerQuestionResponse, setAnswerQuestionResponse] = useState('');

  const navigate = useNavigate();

  const handleAnswerQuestionRequest = useCallback(async ({ questionId, answerText }) => {
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

          console.error("An error occurred while sending answer to a question!", error);
        }
    }
  }, [navigate]);

  return {
    answerQuestionError,
    answerQuestionResponse,
    handleAnswerQuestionRequest,
  };
};