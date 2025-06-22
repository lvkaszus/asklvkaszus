import { useState, useEffect } from 'react';
import axios from 'axios';
import currentVersion from '../../currentVersion.jsx';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendVersionCheckRequest = () => {
  const [versionLoading, setVersionLoading] = useState(true);
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

      console.error('An error occurred while downloading the latest version of the app from GitHub!', error);

    }
  };

  const fetchBackendVersion = async () => {
    try {
      const backendData = await axios.get(`${domain}/api/app/user/fetch_backend_version`);
      const backendVersion = backendData.data.backend_version;

      setBackendVersion(backendVersion);

      
    } catch (error) {
      setBackendVersion('?');

      console.error('An error occurred while downloading the currently running version of the application backend!', error);

    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setVersionLoading(true);
      await fetchBackendVersion()
      await fetchLatestGitVersion()
      setVersionLoading(false);
    };
    fetchAll();
  }, []);

  const isLatestGitVersion = frontendVersion === latestGitVersion;

  return { versionLoading, frontendVersion, backendVersion, latestGitVersion, isLatestGitVersion };
};
