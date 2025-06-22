import axios from 'axios';
import { SendFetchCsrfTokenRequest } from './SendFetchCsrfTokenRequest';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN || 'https://ask.lvkasz.us';

export const SendCheckSessionRequest = () => {
  const navigate = useNavigate();

  const submitCheckSessionRequest = async () => {
    try {
        const csrfToken = await SendFetchCsrfTokenRequest();

        await axios.post(`${domain}/api/app/admin/session_guard`, {},
          {
            headers: {
              'X-CSRFToken': csrfToken
            }
          }
        );
        
        navigate('/admin/home');

    } catch (error) {
        if (error.response) {
          // Leave user on the current page!

        } else {
          // Leave user on the current page!

          console.error('An error occurred while sending a request to retrieve the current session state!', error);
          
        }
    }
  };

  const handleCheckSessionRequest = async () => {
    await submitCheckSessionRequest();
  };

  return {
    handleCheckSessionRequest,
  };
};