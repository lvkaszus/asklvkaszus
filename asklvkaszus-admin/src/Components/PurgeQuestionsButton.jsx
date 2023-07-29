import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';

import { useTranslation } from 'react-i18next';

const PurgeQuestionsButton = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handlePurgeAllQuestions = async () => {
    const apiKeyFromCookie = Cookies.get('apiKey');
    const apiUrl = Cookies.get('url');

    if (!apiUrl || !apiKeyFromCookie) {
      navigate('/login');
      return;
    }

    const expirationDate = new Date(Date.now() + 30 * 60 * 1000);
    Cookies.set('apiKey', Cookies.get('apiKey'), { expires: expirationDate, sameSite: 'Strict', secure: true });
    Cookies.set('url', Cookies.get('url'), { expires: expirationDate, sameSite: 'Strict', secure: true });
    Cookies.set('apiKey_expiration', expirationDate.toISOString(), { expires: expirationDate, sameSite: 'Strict', secure: true });

    try {
      const response = await Axios.post(`https://${apiUrl}/api/v1/secure/purge_all_questions`, null, {
        headers: {
          'Authorization': `Ask-lvkaszus-Auth-Key: ${apiKeyFromCookie}`,
        },
      });

      if (response.status === 200) {
        setError(t('msg-delallquestions'));
        setTimeout(() => {
          setError('');
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 403 && data.message === 'Unauthorized') {
          setError(t('msg-checkapikey'));
        } else if (status === 403 && data.message === 'Incorrect API Key') {
          setError(t('msg-invapikey'));
        } else {
          setError(t('msg-delquestionserr'));
        }
      } else {
        setError(t('msg-queryerr'));
      }

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  return (
    <div>
      <button className='my-1 p-2 w-95% rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handlePurgeAllQuestions}>
        {t('home-pqb-button')}
      </button>

      {error && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 fade-out-delayed'>
          <div className='bg-black bg-opacity-70 rounded-md p-4'>
            {error.includes(t('msg-delallquestions')) ? (
              <div className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faCheckCircle} className='text-green-300 mr-2' />
                <p className='text-green-300'>{error}</p>
              </div>
            ) : (
              <div className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faExclamationCircle} className='text-red-500 mr-2' />
                <p className='text-red-500'>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurgeQuestionsButton;