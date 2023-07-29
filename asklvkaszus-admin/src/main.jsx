import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import { I18nextProvider } from 'react-i18next';

import '@fontsource/fira-code/300.css';
import 'typeface-roboto';

import 'tailwindcss/tailwind.css';

import './Main.css';

import LoadingScreen from './Components/LoadingScreen.jsx';

const Login = lazy(() => import("./Components/Login.jsx"))

const Home = lazy(() => import("./Home.jsx"))
const Info = lazy(() => import("./Info.jsx"))

const Footer = lazy(() => import('./Components/Footer.jsx'));

const NotFound = lazy(() => import("./Components/NotFound.jsx"))

import i18n from './Components/i18n.jsx';

ReactDOM.createRoot(document.getElementById('flex-container')).render(
  <I18nextProvider i18n={i18n}>
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route exact path="/" element={<>
            <Home />
          </>} />
          <Route path="/login" element={<>
            <Login />
            <Footer />
          </>} />
          <Route path="/info" element={<>
            <Info />
            <Footer />
          </>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  </I18nextProvider>
)
