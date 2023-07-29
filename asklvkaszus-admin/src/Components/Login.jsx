import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faGlobe } from '@fortawesome/free-solid-svg-icons/faGlobe';
import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';

import { useTranslation } from 'react-i18next';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || 'me';

const Login = () => {
  const navigate = useNavigate()

  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const { t } = useTranslation();

  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9.-]+)\.([a-zA-Z]{2,})(\/.*)?$/;
  //const urlPattern = "";

  const handleLogin = (e) => {
    e.preventDefault();
  
    if (!url.trim() || !apiKey.trim()) {
      setError(t('msg-nourlorapi'));
  
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
  
    if (!url.match(urlPattern) || url.includes('/') || url.includes('\\')) {
      setError(t('msg-invalidurl'));
  
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
  
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000);
    Cookies.set('apiKey', apiKey, { expires: expirationDate, sameSite: 'Strict', secure: true });
    Cookies.set('url', url, { expires: expirationDate, sameSite: 'Strict', secure: true });
    Cookies.set('apiKey_expiration', expirationDate.toISOString(), { expires: expirationDate, sameSite: 'Strict', secure: true });
  
    setError('');
    setUrl('');
    setApiKey('');
  
    navigate('/');
  };

  useEffect(() => {
    const apiKey = Cookies.get('apiKey');
    const url = Cookies.get('url');
      if (apiKey && url) {
        navigate('/');
      }
    }, [navigate]);

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px fade-in'>
      <Helmet>
        <title>{t('login-title') + ' ' + yourNickname + '!'}</title>
      </Helmet>

      <div className='bg-white rounded-lg bg-opacity-20'>
        <h1 className='p-2 mt-6 text-2xl'>Ask {yourNickname}!</h1>
        <p className='text-subtitleText mb-4 text-base'>{t('login-description')}</p>

        <form onSubmit={handleLogin}>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faGlobe} className='ml-3 mr-2' />
            <input
              className="bg-gray-800 text-base mx-1 my-1 mr-3 p-1 w-95% border border-gray-300 rounded-md"
              type="text"
              name='username'
              id='username'
              autocomplete="username"
              placeholder={t('login-urltextbox')}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className='flex items-center'>
            <FontAwesomeIcon icon={faKey} className='ml-3 mr-2' />
            <input
            className="bg-gray-800 text-base mx-1 my-1 mr-3 p-1 w-95% border border-gray-300 rounded-md"
            type="password"
            name='password'
            id='password'
            autocomplete="current-password"
            placeholder={t('login-apitextbox')}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <button className='my-1 p-2 w-95% rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' type="submit">{t('login-loginbutton')}</button>
        </form>

        {error && (
          <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 fade-out-delayed'>
            <div className='bg-black bg-opacity-70 rounded-md p-4'>
              <div className='flex items-center text-xl'>
                <FontAwesomeIcon icon={faExclamationCircle} className='text-red-500 mr-2' />
                <p className='text-red-500'>{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;