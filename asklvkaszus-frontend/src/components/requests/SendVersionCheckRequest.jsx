import { useState, useEffect } from 'react';
import axios from 'axios';
import currentVersion from '../../currentVersion.jsx';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendVersionCheckRequest = () => {
  const [latestGitVersion, setLatestGitVersion] = useState('');
  const [backendVersion, setBackendVersion] = useState('');

  const frontendVersion = currentVersion();

  const fetchLatestGitVersion = async () => {
    try {
      const gitData = await axios.get('https://api.github.com/repos/lvkaszus/asklvkaszus/releases/latest');
      const latestGitVersion = gitData.data.tag_name;

      setLatestGitVersion(latestGitVersion);

    } catch (error) {
      setLatestGitVersion(frontendVersion);

      console.error(`${t('error-fetchgithublatestversion')} ${error}`);

    }
  };

  const fetchBackendVersion = async () => {
    try {
      const backendData = await axios.get(`${domain}/api/app/user/fetch_backend_version`);
      const backendVersion = backendData.data.backend_version;

      setBackendVersion(backendVersion);
      
    } catch (error) {
      setBackendVersion('?');

      console.error(`${t('error-fetchrunningbackendversion')} ${error}`);

    }
  };

  useEffect(() => {
    fetchBackendVersion();
    fetchLatestGitVersion();
  }, []);

  const isLatestGitVersion = frontendVersion === latestGitVersion;

  return { frontendVersion, backendVersion, latestGitVersion, isLatestGitVersion };
};
