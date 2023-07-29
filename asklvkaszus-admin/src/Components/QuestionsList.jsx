import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons/faCircleExclamation';
import PurgeQuestionsButton from './PurgeQuestionsButton.jsx';
import AnswerQuestion from './AnswerQuestion.jsx';
import PurgeQuestion from './PurgeQuestion.jsx';
import { useTranslation } from 'react-i18next';

const yourNickname = import.meta.env.VITE_YOUR_NICKNAME || 'me';

const decodeQuestion = (question) => decodeURIComponent(question);

const renderBBCode = (text) => {
  let result = text;

  result = result.replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>');
  result = result.replace(/\[i\](.*?)\[\/i\]/g, '<em>$1</em>');
  result = result.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>');

  result = result.replace(
    /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/g,
    '$1<a class="font-bold underline" target="_blank" rel="noreferrer" href="$2">$2</a>'
  );

  result = result.replace(
    /\[yt\](.*?)\[\/yt\]/g,
    (_, link) => {
      const videoId = extractVideoIdFromURL(link);
      return `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    }
  );

  result = result.replace(/\[location:([\d.-]+),([\d.-]+)\]/g, (_, lat, lng) => {
    const latNumber = parseFloat(lat);
    const lngNumber = parseFloat(lng);

    const expandedLatMin = latNumber - 0.01;
    const expandedLatMax = latNumber + 0.01;
    const expandedLngMin = lngNumber - 0.01;
    const expandedLngMax = lngNumber + 0.01;

    return `<div class="map-embed p-0">
      <iframe width="100%" height="200" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${expandedLngMin},${expandedLatMin},${expandedLngMax},${expandedLatMax}&amp;layer=mapnik&amp;marker=${lat},${lng}&amp;showMarker=0">
      </iframe>
    </div>`;
  });

  return result;
};

const extractVideoIdFromURL = (url) => {
  const match = url.match(/youtube\.com.*(\?v=|\/embed\/|\/\d\/|\/vi\/|v\/|\/u\/\w\/|embed\/|\/v\/|id_)([^#&?]*).*/);
  return (match && match[2]) ? match[2] : url;
};

const decodeAndFormatText = (text) => {
  let formattedText = decodeQuestion(text);
  formattedText = renderBBCode(formattedText);
  return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
};

const QuestionsList = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    const apiKeyFromCookie = Cookies.get('apiKey');
    const apiUrl = Cookies.get('url');

    if (!apiUrl || !apiKeyFromCookie) {
      navigate('/login');
      return;
    }

      try {
        const response = await axios.get(`https://${apiUrl}/api/v1/fetch_all_questions`);
        const jsonData = response.data;
        setData(jsonData);
        setError(false);
      } catch (error) {
        console.error("[Ask @lvkaszus! - React] fetchAllQuestions: Fetch all questions - ERROR: " + error);
        setError(true);
      }
    };

  return (
    <div>
      {error ? (
        <div className="bg-red-500 text-white mt-4 px-4 py-1 rounded-lg">{t('msg-fetchqerr') + ' ' + yourNickname + ' ' + t('msg-fetchqerr2')}</div>
      ) : (
        <div>
          <p className='text-xl mt-6 font-normal'>{t('home-ql-questions')}</p>
          <p className='text-base font-light mt-2 mb-4'>{t('home-ql-questionsoverview')}</p>

          <PurgeQuestionsButton />

          {data.message === 'No questions yet' ? (
            <p className="text-xl"><FontAwesomeIcon icon={faCircleExclamation} className='mr-2' />{t('msg-noquestionsyet')}</p>
          ) : (
            data.map(({ answer, date, question, id }) => (
              <div key={id} className="rounded-lg p-3 my-2">
                <p className="bg-gradient-to-br from-stPrimary to-stSecondary text-white font-light text-xl py-2 rounded-t-lg">{decodeAndFormatText(question)}</p>
                {answer === 'TODO' ? (
                  <p className="bg-bgStickerBot text-gray-400 text-xl px-4 pt-2 pb-6">{yourNickname + ' ' + t('msg-notanswered')}</p>
                ) : (
                  <p className="bg-bgStickerBot text-black text-xl px-2 pt-2 pb-6">{decodeAndFormatText(answer)}</p>
                )}

                <AnswerQuestion questionId={id} questionText={question} />
                <PurgeQuestion questionId={id} />

                <p className="bg-white text-black font-light text-xs px-4 py-1 rounded-b-lg">{date}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionsList;