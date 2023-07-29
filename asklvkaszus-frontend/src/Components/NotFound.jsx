import { Helmet } from 'react-helmet';

import Navbar from './Navbar';

import { useTranslation } from 'react-i18next';

import '../Main.css';

function NotFound() {
  const { t } = useTranslation();

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px'>
      <Helmet>
        <title>HTTP 404!</title>

        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />

      <div className='bg-white rounded-lg bg-opacity-20'>
        <p className='font-normal text-2xl my-6'>{t('notfound-pagetitle')}</p>

        <a className='underline' href="/">{t('notfound-backtohomepage')}</a>
      </div>
    </div>
  );
}

export default NotFound;