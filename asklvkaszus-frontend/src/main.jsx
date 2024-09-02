import React from 'react';
import ReactDOM from 'react-dom/client';

import './main.css';

import 'leaflet/dist/leaflet.css';

import '@fontsource/fira-code/300.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import Core from './Core';

ReactDOM.createRoot(document.getElementById('app-main')).render(
  <Core />
);
