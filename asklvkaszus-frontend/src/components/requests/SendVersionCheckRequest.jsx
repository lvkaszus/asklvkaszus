import { useState, useEffect } from 'react';
import axios from 'axios';
import currentVersion from '../../currentVersion.jsx';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendVersionCheckRequest = () => {
  const [versionLoading, setVersionLoading] = useState(true);
  const [latestGitVersion, setLatestGitVersion] = useState('');
  const [backendVersion, setBackendVersion] = useState('');

  const frontendVersion = currentVersion();

  useEffect(() => {
    const fetchVersionNumbers = async () => {
      setVersionLoading(true);

      try {
        const backendData = await axios.get(`${domain}/api/app/user/fetch_backend_version`);
        setBackendVersion(backendData.data.backend_version);
      } catch {
        setBackendVersion('?');
      }

      try {
        const gitData = await axios.get('https://api.github.com/repos/lvkaszus/asklvkaszus/releases/latest');
        setLatestGitVersion(gitData.data.tag_name);
      } catch {
        setLatestGitVersion(frontendVersion);
      }

      setVersionLoading(false);
    };

    fetchVersionNumbers();
  }, [frontendVersion]);

  const isLatestGitVersion = frontendVersion === latestGitVersion;

  return { versionLoading, frontendVersion, backendVersion, latestGitVersion, isLatestGitVersion };
};
