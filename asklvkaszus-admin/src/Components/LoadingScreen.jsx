import { Helmet } from 'react-helmet';

import Navbar from './Navbar.jsx';

import '../Main.css';

import { useTranslation } from 'react-i18next';

const LoadingScreen = () =>{
  const { t } = useTranslation();

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px'>
      <Helmet>
        <title>{t('loadingscreen')}</title>

        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />

      <div className='bg-white rounded-lg bg-opacity-20'>
        <h1 className='text-center p-2 mt-6 text-2xl'>{t('loadingscreen')} 😸</h1>
      </div>
    </div>
  )
}

export default LoadingScreen;