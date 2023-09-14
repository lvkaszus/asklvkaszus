import { useEffect, useState } from 'react';

import axios from 'axios';

export const VersionCheck = () => {
  const [latestVersion, setLatestVersion] = useState(['']);

  const fetchLatestVersion = async () => {
    try {
      const gitData = await axios.get('https://api.github.com/repos/lvkaszus/asklvkaszus-react/releases/latest');
      const latestVersion = gitData.data.tag_name;

      setLatestVersion(latestVersion);
    } catch (error) {
      console.error("[Ask @lvkaszus! - React] fetchLatestVersion:  Fetch latest release from GitHub  -  ERROR: " + error);
    }
  };

  useEffect(() => {
    fetchLatestVersion();
  }, []);

  const currentVersion = '2.1';
  const isLatestVersion = currentVersion === latestVersion;

  return { currentVersion, latestVersion, isLatestVersion };
};