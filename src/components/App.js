import React, {useState, useEffect} from 'react';

import {searchYoutube} from './youtube';

import firebase from '../firebase';
import '../style.scss';

const App = () => {
  const [user, setUser] = useState();
  const [videoQuery, setVideoQuery] = useState('');
  const [videoResults, setVideoResults] = useState();
  const [q, setQ] = useState();

  useEffect(
    () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          console.log(user);
          setUser(user);

          const qRef = firebase.database().ref('q');
          qRef.on('value', (snap) => {
            let items = snap.val();
            let newState = [];
            for (let item in items) {
              newState.push({
                id: item,
                dj: items[item].dj,
                video: items[item].video,
              });
            }
            setQ(newState);
          });
        } else {
          setUser('');
        }
      });
    },
    [
      /* Trigger once */
    ]
  );

  const videoResultsCallback = (error, result) => {
    if (error) {
      alert('Error: please check console');
      console.log(error);
    } else {
      console.log(result);
      setVideoResults(result);
    }
  };

  const removeItem = (id) => {
    const itemRef = firebase.database().ref(`/q/${id}`);
    itemRef.remove();
  };

  const handleVideoQuery = (e) => {
    setVideoQuery(e.currentTarget.value);
  };

  const handleVideoQuerySubmit = (e) => {
    e.preventDefault();

    searchYoutube(videoQuery, videoResultsCallback);
  };

  const handleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    provider.setCustomParameters({
      login_hint: 'user@fullstack.ph',
    });

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result) {
        // // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // // The signed-in user info.
        // console.log(result);
        // var user = result.user;
        // // console.log(user);
        // // ...
      })
      .catch(function(error) {
        // // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // // ...
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
        setUser('');
        setQ();
      })
      .catch(function(error) {
        alert('error, check console log');
        console.log(error);
      });
  };

  const handleAddToQueue = (vid) => {
    const qRef = firebase.database().ref('q');

    const item = {
      dj: {
        name: user.displayName,
        email: user.email,
      },
      video: {
        videoId: vid.id.videoId,
        title: vid.snippet.title,
      },
    };

    qRef.push(item);
  };

  return (
    <div className="app">
      <div className="pane-search">
        <header>
          {user !== undefined ? (
            user ? (
              <div>
                <p>Hello, {user.displayName.split(' ')[0]} :D</p>
                <p>{user.email}</p>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            ) : (
              <button onClick={handleSignIn}>Sign In</button>
            )
          ) : (
            <></>
          )}
        </header>
        {user !== undefined && user && (
          <div>
            <form onSubmit={handleVideoQuerySubmit}>
              <input
                name="query"
                placeholder="search"
                value={videoQuery}
                onChange={handleVideoQuery}
              />
              <button type="submit">Search</button>
            </form>
            <div>
              {videoResults !== undefined ? (
                videoResults.length > 0 ? (
                  <div className="video-results">
                    {videoResults.map((vid) => {
                      const {snippet, id} = vid;
                      const {title, channelTitle, thumbnails} = snippet;

                      return (
                        <div key={id.videoId} className="video">
                          <img src={thumbnails.medium.url} alt="" />
                          <p>{title}</p>
                          <p>{channelTitle}</p>
                          <button onClick={() => handleAddToQueue(vid)}>
                            q
                          </button>
                          <button>q next</button>
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
            </div>
          </div>
        )}
      </div>
      <div className="pane-list">
        <ul>
          {q !== undefined ? (
            q.map((item) => {
              return (
                <li key={item.id}>
                  <span>{item.video.title}</span>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                    }}
                  >
                    Remove
                  </button>
                </li>
              );
            })
          ) : (
            <li>Fetching...</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
