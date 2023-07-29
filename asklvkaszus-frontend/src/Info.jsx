import { Helmet } from 'react-helmet';

import './Main.css';

import Navbar from './Components/Navbar.jsx';

import { useTranslation } from 'react-i18next';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || 'me';

const Info = () => {
  const { t } = useTranslation();

  return (
    <div className='font-roboto font-bold text-center p-2 w-450px fade-in'>
      <Helmet>
        <title>{t('info-title') + ' ' + yourNickname + '!'}</title>
      </Helmet>

      <Navbar />

      <div className='bg-white rounded-lg bg-opacity-20'>
      <p className='font-bold text-xl mb-10px mt-6 sm:text-2xl sm:mt-20px sm:mb-0'>{t('info-pagetitle') + ' ' + yourNickname + '!'}</p>
        <p className='font-normal text-xs sm:text-base mb-4'>{t('info-description')}</p>

        <p className='font-light text-xs sm:text-base mb-2'>&quot;{t('info-authorquote')}&quot; <span className='font-bold'>- @lvkaszus 2023</span></p>

        <div className='mt-1 sm:mt-4'>
            <a className='text-sky-600 text-xs sm:text-base underline' href="https://github.com/lvkaszus/asklvkaszus-react" target='_blank' rel='noreferrer'>{t('info-sclink')}</a>
        </div>

        <p className='font-normal text-xs sm:text-base text-left mt-2 sm:mt-8 mb-1 ml-2'>{t('info-pageauthors')}</p>
        
        <li className='font-light text-xs sm:text-base text-left mt-2 sm:mt-4 ml-6'>lvkaszus <span className='font-normal'>({t('info-author1-work')})</span></li>
        <li className='font-light text-xs sm:text-base text-left mt-2 sm:mt-4 ml-6'>{yourNickname} <span className='font-normal'>({t('info-author2-work')})</span></li>
      </div>

    </div>
  )
}

export default Info;