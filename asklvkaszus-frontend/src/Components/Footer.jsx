import { NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPython, faReact } from '@fortawesome/free-brands-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import { VersionCheck } from './VersionCheck.jsx';

const Footer = () => {
  const { currentVersion, latestVersion, isLatestVersion } = VersionCheck();

  return (
    <footer className="font-fira absolute hidden bottom-5 w-full text-center lg:block">
      <NavLink exact="true" to="/" className="text-xs no-underline">
        <p className="my-1 py-0 text-linkFooterColor">
          lvkaszus™ // @lvkaszus 2022-2023
        </p>
        
        <p className="my-1 py-0 text-linkFooterColor">
        <FontAwesomeIcon icon={faPython} className='mr-2' />
        <span>Python + </span>

        <FontAwesomeIcon icon={faReact} className='mr-2' />
        <span>React + Vite = </span><FontAwesomeIcon icon={faHeart} className='mr-2' />
        </p>

        {isLatestVersion ? (
          <p className="my-1 py-0 text-linkFooterColor">Ask @lvkaszus! - version: {currentVersion} - 06.10.2023 : latest</p>
        ) : (
          <p className="my-1 py-0 text-linkFooterColor">Ask @lvkaszus! - version: {currentVersion} - 06.10.2023 : please upgrade to {latestVersion}!</p>
        )}
      </NavLink>
    </footer>
  );
};

export default Footer;