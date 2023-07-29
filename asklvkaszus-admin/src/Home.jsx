import React, { useEffect, useState  } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import './Main.css';

import Navbar from './Components/Navbar.jsx';

import QuestionsList from './Components/QuestionsList.jsx';

import { useTranslation } from 'react-i18next';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || 'me';

const Home = () =>{
  const [remainingTime, setRemainingTime] = useState(0);
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    const apiKey = Cookies.get('apiKey');
    const url = Cookies.get('url');
  
    if (!apiKey || !url) {
      navigate('/login');
    }
  }, [navigate]);  

  useEffect(() => {
    const interval = setInterval(() => {
      const expirationTime = Cookies.get('apiKey_expiration');
      const remaining = expirationTime ? (new Date(expirationTime) - new Date()) / 1000 : 0;
      setRemainingTime(remaining);
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);  

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
  
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      };

    const handleLogout = () => {
      Cookies.remove('url');
      Cookies.remove('apiKey');
      Cookies.remove('apiKey_expiration');
      navigate('/login');
    };

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px fade-in'>
      <Helmet>
        <title>Ask {yourNickname}!</title>
      </Helmet>

      <Navbar />

      <div className='bg-white rounded-lg bg-opacity-20'>
        <h1 className='p-2 mt-6 text-2xl'>Ask {yourNickname}! 😸</h1>
        <h3 className='text-subtitleText mb-4 text-base'>{t('home-description')}</h3>

        <p className='font-light underline'>{t('home-sessiontime')} {formatTime(remainingTime)}</p>

        <button className='my-1 p-1 w-1/2 rounded-md text-base bg-bgSecondary cursor-pointer hover:bg-bgPrimary transition-all duration-200 ease-in-out' onClick={handleLogout}>{t('home-logout')}</button>

        <QuestionsList />
      </div>
    </div>
  )
}

export default Home;