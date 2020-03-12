import React, {useState, useEffect} from 'react';

import searchYoutube from 'youtube-api-v3-search';

import firebase from '../firebase';
import '../style.scss';

const App = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [items, setItems] = useState();
  const [videoQuery, setVideoQuery] = useState('');
  const [videoResults, setVideoResults] = useState();

  useEffect(
    () => {
      const itemsRef = firebase.database().ref('items');

      itemsRef.on('value', (snapshot) => {
        let items = snapshot.val();
        let newState = [];
        for (let item in items) {
          newState.push({
            id: item,
            name: items[item].name,
            color: items[item].color,
          });
        }
        setItems(newState);
      });

      async function yt() {
        let result = await searchYoutube(
          'AIzaSyAlw5mGkush_MCe_0EvYroPUW9y5O5W_sk',
          {
            q: 'dogs',
            part: 'snippet',
            type: 'video',
          }
        );

        console.log(result);
      }

      // yt();
      searchYoutube(
        'AIzaSyAlw5mGkush_MCe_0EvYroPUW9y5O5W_sk',
        {
          q: 'latest music video',
          part: 'snippet',
          type: 'video',
          maxResults: '18',
          videoCategoryId: '10',
        },
        resultsCallback
      );
    },
    [
      /* Trigger once */
    ]
  );

  const resultsCallback = (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      setVideoResults(result.items);
    }
  };

  const handleName = (e) => {
    setName(e.currentTarget.value);
  };

  const handleColor = (e) => {
    setColor(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const itemsRef = firebase.database().ref('items');
    const item = {
      name: name,
      color: color,
    };

    itemsRef.push(item);
    setName('');
    setColor('');
  };

  const removeItem = (id) => {
    const itemRef = firebase.database().ref(`/items/${id}`);
    itemRef.remove();
  };

  const handleVideoQuery = (e) => {
    setVideoQuery(e.currentTarget.value);
  };

  const handleVideoQuerySubmit = (e) => {
    e.preventDefault();

    searchYoutube(
      'AIzaSyAlw5mGkush_MCe_0EvYroPUW9y5O5W_sk',
      {
        q: videoQuery,
        part: 'snippet',
        type: 'video',
        maxResults: '18',
        videoCategoryId: '10',
      },
      resultsCallback
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello World</p>
      </header>
      <form onSubmit={handleVideoQuerySubmit}>
        <input
          name="query"
          placeholder="search"
          value={videoQuery}
          onChange={handleVideoQuery}
        />
        <button type="submit">Search</button>
      </form>
      {/* <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleName}
        />
        <input
          name="color"
          placeholder="Favorite Color"
          value={color}
          onChange={handleColor}
        />
        <button type="submit">Add Item</button>
      </form> */}

      <div>
        {videoResults !== undefined ? (
          videoResults.length > 0 ? (
            <div style={{display: 'flex'}}>
              {videoResults.map((vid) => {
                const {snippet, id} = vid;
                const {title, channelTitle, thumbnails} = snippet;

                return (
                  <div key={id.videoId}>
                    <img src={thumbnails.medium.url} alt="" />
                    <p>{title}</p>
                    <p>{channelTitle}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No results</div>
          )
        ) : (
          <div>Fetching...</div>
        )}
        {/* {items !== undefined ? (
          items.length > 0 ? (
            items.map((item) => {
              return (
                <div key={item.id}>
                  <div>
                    <p>
                      {item.name} || {item.color}
                    </p>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>No items</div>
          )
        ) : (
          <div>Loading...</div>
        )} */}
      </div>
    </div>
  );
};

export default App;
