import React, { useState } from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';

import { useTranslation } from 'react-i18next';

const PurgeQuestion = ({ questionId }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { t } = useTranslation();

  const handleDelete = async () => {
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
      const response = await Axios.post(`https://${apiUrl}/api/v1/secure/purge_question/${questionId}`, null, {
        headers: {
          'Authorization': `Ask-lvkaszus-Auth-Key: ${apiKeyFromCookie}`,
        },
      });

      if (response.status === 200) {
        setError(t('msg-qremoved'));
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
        } else if (status === 404 && data.message === 'Question with selected ID does not exist') {
          setError(t('msg-questionnf'));
        } else {
          setError(t('msg-qdelerr'));
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
    <div className='bg-white'>
      <button className='mx-1 my-1 p-1 w-1/3 rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handleDelete}>
        {t('home-pq-delete')}
      </button>

      {error && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 fade-out-delayed'>
          <div className='bg-black bg-opacity-70 rounded-md p-4'>
            {error.includes(t('msg-qremoved')) ? (
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

export default PurgeQuestion;