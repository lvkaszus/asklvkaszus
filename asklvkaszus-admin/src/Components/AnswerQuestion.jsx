import { useState } from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { faReply } from '@fortawesome/free-solid-svg-icons/faReply';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

import { useTranslation } from 'react-i18next';

const decodeQuestion = (question) => decodeURIComponent(question);
const encodeQuestion = (question) => encodeURIComponent(question);

const renderBBCode = (text) => {
    let result = text;

    result = result.replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
    result = result.replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>');
    result = result.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');
  
    result = result.replace(
      /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/g,
      '$1<a class="font-bold underline" target="_blank" rel="noreferrer" href="$2">$2</a>'
    );
  
    return result;
  };
  
  const decodeAndFormatText = (text) => {
    let formattedText = decodeQuestion(text);
    formattedText = renderBBCode(formattedText);
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

const AnswerQuestion = ({ questionId, questionText }) => {
  const [reply, setReply] = useState('');
  const [error, setError] = useState('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [hideReplyBox, setHideReplyBox] = useState(false);
  const [showBBCodeHelp, setShowBBCodeHelp] = useState(false);
  const [hideBBCodeHelp, setHideBBCodeHelp] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleReply = async (e) => {
    e.preventDefault();

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
      const response = await Axios.post(`https://${apiUrl}/api/v1/secure/reply_to_question/${questionId}`, null, {
          headers: {
            'Authorization': `Ask-lvkaszus-Auth-Key: ${apiKeyFromCookie}`,
            'Answer': `${encodeQuestion(reply)}`,
          },
        }
      );

      if (response.status === 200) {
        setError(t('msg-replysent'));

        setHideReplyBox(true);
        setTimeout(() => {
          setShowReplyBox(false);
          setHideReplyBox(false);
        }, 500);

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
        } else if (status === 400 && data.message === 'No answer to selected question') {
          setError(t('msg-empty'));
        }
      } else {
        setError(t('msg-queryerr'));
      }

      setHideReplyBox(true);
      setTimeout(() => {
        setShowReplyBox(false);
        setHideReplyBox(false);
      }, 500);

      setTimeout(() => {
        setError('');
      }, 3000);
    }
  };

  const handleReplyShow = (e) => {
    e.preventDefault();
    setShowReplyBox(true);
  };

  const handleReplyShowClose = () => {
    setHideReplyBox(true);
    setTimeout(() => {
      setShowReplyBox(false);
      setHideReplyBox(false);
    }, 500);
  }

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

  return (
    <div className='bg-white'>
      <button className='mx-1 my-1 p-1 w-1/3 rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handleReplyShow}>{t('home-aq-reply')}</button>

      {showReplyBox && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 ${hideReplyBox && 'fade-out'}`}>
          <div className='bg-black bg-opacity-70 rounded-md p-4 w-350px'>
            <p className='font-bold text-lg mb-2'>
              <FontAwesomeIcon icon={faCircleInfo}className='mr-2' />
              {t('home-aq-replyto')} "{decodeAndFormatText(questionText)}"
            </p>

            <form onSubmit={handleReply}>
                <div className='flex items-center'>
                    <FontAwesomeIcon icon={faReply}className='mr-2' />
                    <input className="bg-gray-800 text-base mx-1 my-1 mr-3 p-1 w-full border border-gray-300 rounded-md" type="text" placeholder={t('home-aq-yourreply')} value={reply} onChange={(e) => setReply(e.target.value)} />
                </div>

                <button className='my-1 p-2 w-95% rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' type="submit">{t('home-aq-sendreply')}</button>
            </form>
            <p className='font-light text-left text-sm mb-1 ml-2 p-1'>{t('home-aq-bbcodeinfo')}{' '}<span><a className='underline' href="#" onClick={handleBBCodeHelp}>({t('home-aq-whatisbbcode')})</a></span></p>

            <button className='my-1 p-2 w-95% rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handleReplyShowClose}>{t('home-aq-close')}</button>
          </div>
        </div>
      )}

    {showBBCodeHelp && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 ${hideBBCodeHelp && 'fade-out'}`}>
          <div className='bg-black bg-opacity-70 rounded-md p-4 w-350px'>
            <p className='font-bold text-lg mb-2'><FontAwesomeIcon icon={faCircleInfo} className='mr-2' />{t('home-bbc-howtobbcode')}</p>

            <p className='font-normal text-left mt-4 mb-2'>{t('home-bbc-whatisbbcode')}</p>
            <p className='font-light text-left text-sm'>{t('home-bbc-bbcodeoverview')}</p>

            <p className='font-normal text-left mt-4'>{t('home-bbc-bbcodeexamples')}</p>
            <p className='font-light text-left text-sm my-2'>- [b]{t('home-bbc-boldtext')}[/b] = <span className='font-bold'>{t('home-bbc-boldtextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [u]{t('home-bbc-underlinetext')}[/u] = <span className='font-bold'>{t('home-bbc-underlinetextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [i]{t('home-bbc-italictext')}[/i] = <span className='font-bold'>{t('home-bbc-italictextoverview')}</span></p>

            <p className='font-light text-left text-sm mt-6 mb-2'>- [yt]{t('home-bbc-yttext')}[/yt] = <span className='font-bold'>{t('home-bbc-yttextoverview')}</span></p>
            <p className='font-light text-left text-sm my-2'>- [location:{t('home-bbc-locationtext')}] = <span className='font-bold'>{t('home-bbc-locationtextoverview')}</span></p>

            <button className='my-2 py-2 px-10 rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handleBBCodeHelpClose}>Ok</button>
          </div>
        </div>
      )}

    {error && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 fade-out-delayed'>
          <div className='bg-black bg-opacity-70 rounded-md p-4'>
            {error.includes(t('msg-replysent')) ? (
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
}

export default AnswerQuestion;