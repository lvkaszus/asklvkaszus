import { Helmet } from 'react-helmet';

import './Main.css';

import Navbar from './Components/Navbar.jsx';

import QuestionForm from './Components/QuestionForm.jsx';
import QuestionsList from './Components/QuestionsList.jsx';

import { useTranslation } from 'react-i18next';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || 'me';

const Home = () =>{
  const { t } = useTranslation();

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px fade-in'>
      <Helmet>
        <title>Ask {yourNickname}!</title>
      </Helmet>

      <Navbar />

      <div className='bg-white rounded-lg bg-opacity-20'>
        <h1 className='text-center p-2 mt-6 text-2xl'>{t('home-pagetitle') + ' ' + yourNickname + t('home-pagetitleend')}</h1>

        <QuestionForm />

        <QuestionsList />
      </div>
    </div>
  )
}

export default Home;