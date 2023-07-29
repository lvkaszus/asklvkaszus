import { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faMessage } from '@fortawesome/free-solid-svg-icons/faMessage';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

import axios from 'axios';

import { useTranslation } from 'react-i18next';


const encodedQuestion = (question) => encodeURIComponent(question);

const apiDomainName = import.meta.env.VITE_API_DOMAIN_NAME || '127.0.0.1';
const submitQuestionUrl = `https://${apiDomainName}/api/v1/submit_question`;

const QuestionForm = () => {
  const { t } = useTranslation();

  const [question, setQuestion] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [showBBCodeHelp, setShowBBCodeHelp] = useState(false);
  const [hideBBCodeHelp, setHideBBCodeHelp] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(submitQuestionUrl, null, {
        headers: { 'Question': encodedQuestion(question) }
      });

      const { message } = response.data;

      setResponseMessage(message);
      setResponseStatus('success');
      setShowResponse(true);

      setQuestion('');
    } catch (error) {
      if (error.response) {
        const { message } = error.response.data;

        setResponseMessage(message);
        setResponseStatus('error');
        setShowResponse(true);
      } else {
        console.error("[Ask @lvkaszus! - React] submitQuestion:  Submit question  -  ERROR: " + error);
      }
    }
  };

  const handleBBCodeHelp = (e) => {
    e.preventDefault();
    setShowBBCodeHelp(true);
  };

  const handleBBCodeHelpClose = () => {
    setHideBBCodeHelp(true);
    setTimeout(() => {
      setShowBBCodeHelp(false);
      setHideBBCodeHelp(false);
    }, 500);
  };

  useEffect(() => {
    let timeoutId = null;

    if (showResponse) {
      timeoutId = setTimeout(() => {
        setShowResponse(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showResponse]);

  return (
    <div>
      <p className='font-light text-left text-base mt-4 ml-2 p-1'>{t('home-qf-yourquestion')}</p>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          className='text-blue-400 text-base mx-1 my-1 p-1 w-95% border border-gray-300 rounded-md'
          placeholder={t('home-qf-textbox')}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button className='my-1 p-2 w-95% rounded-md text-base bg-btnBlue cursor-pointer hover:bg-btnBlueHover transition-all duration-200 ease-in-out'>
          <FontAwesomeIcon icon={faMessage} className='mr-2' />
          {t('home-qf-button')}
        </button>
      </form>

      <p className='font-light text-left text-sm mb-1 ml-2 p-1'>
        {t('home-qf-bbcodeinfo')}{' '}
        <span>
          <a className='underline' href="#" onClick={handleBBCodeHelp}>
            ({t('home-qf-whatisbbcode')})
          </a>
        </span>
      </p>

      {showBBCodeHelp && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 ${hideBBCodeHelp ? 'fade-out' : ''}`}>
          <div className='bg-black bg-opacity-70 rounded-md p-4 w-350px'>
            <p className='font-bold text-lg mb-2'>
              <FontAwesomeIcon icon={faCircleInfo} className='mr-2' />
              {t('home-bbc-howtobbcode')}
            </p>

            <p className='font-normal text-left mt-4 mb-2'>{t('home-bbc-whatisbbcode')}</p>
            <p className='font-light text-left text-sm'>{t('home-bbc-bbcodeoverview')}</p>

            <p className='font-normal text-left mt-4'>{t('home-bbc-bbcodeexamples')}</p>
            <p className='font-light text-left text-sm my-2'>- [b]{t('home-bbc-boldtext')}[/b] = <span className='font-bold'>{t('home-bbc-boldtextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [u]{t('home-bbc-underlinetext')}[/u] = <span className='font-bold'>{t('home-bbc-underlinetextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [i]{t('home-bbc-italictext')}[/i] = <span className='font-bold'>{t('home-bbc-italictextoverview')}</span></p>

            <p className='font-light text-left text-sm mt-6 mb-2'>- [yt]{t('home-bbc-yttext')}[/yt] = <span className='font-bold'>{t('home-bbc-yttextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [location:{t('home-bbc-locationtext')}] = <span className='font-bold'>{t('home-bbc-locationtextoverview')}</span></p>

            <button className='my-2 py-2 px-10 rounded-md text-base bg-btnBlue cursor-pointer hover:bg-btnBlueHover transition-all duration-200 ease-in-out' onClick={handleBBCodeHelpClose}>Ok</button>
          </div>
        </div>
      )}

      {showResponse && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 fade-out-delayed'>
          <div className='bg-black bg-opacity-70 rounded-md p-4'>
            {responseStatus === 'success' && (
              <div className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faCheckCircle} className='text-green-300 mr-2' />
                <p className='text-green-300'>{t('msg-sent')}</p>
              </div>
            )}
            {responseStatus === 'error' && (
              <div className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faExclamationCircle} className='text-red-500 mr-2' />
                <p className='text-red-500'>
                  {responseMessage === 'Sending question failed. Empty questions not allowed'
                    ? t('msg-empty')
                    : t('msg-senderr')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionForm;