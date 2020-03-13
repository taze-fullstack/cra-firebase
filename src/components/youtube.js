import axios from 'axios';

const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_KEY = 'AIzaSyAlw5mGkush_MCe_0EvYroPUW9y5O5W_sk';

const searchYoutube = (query, cb) => {
  const data = {
    key: YOUTUBE_KEY,
    q: query,
    part: 'snippet',
    type: 'video',
    maxResults: '18',
    videoCategoryId: '10',
  };

  axios
    .get(SEARCH_URL, {params: data})
    .then((response) => {
      cb(null, response.data.items);
    })
    .catch((err) => {
      cb(err, null);
    });
};

export {searchYoutube};
