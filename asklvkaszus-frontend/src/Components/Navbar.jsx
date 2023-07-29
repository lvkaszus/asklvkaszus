import { NavLink } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="font-fira font-light text-sm text-black mt-2 mb-1">
      <NavLink exact="true" to="/" className="underline ml-2 mr-2">
        {t('navbar-homepage')}
      </NavLink>
      <NavLink to="/info" className="underline ml-2 mr-2">
        {t('navbar-informations')}
      </NavLink>
    </nav>
  );
};

export default Navbar;