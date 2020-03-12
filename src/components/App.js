import React, {useState, useEffect} from 'react';

import firebase from '../firebase';

import searchYoutube from 'youtube-api-v3-search';

const App = () => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [items, setItems] = useState();

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
          q: 'dogs',
          part: 'snppet',
          type: 'video',
          maxResults: '30',
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

  return (
    <div className="App">
      <header className="App-header">
        <p>Hello World</p>
      </header>
      <form onSubmit={handleSubmit}>
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
      </form>

      <div>
        {items !== undefined ? (
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
        )}
      </div>
    </div>
  );
};

export default App;
