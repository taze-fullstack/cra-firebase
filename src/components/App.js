import React, {useState, useEffect} from 'react';

import firebase from '../firebase';

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
    },
    [
      /* Trigger once */
    ]
  );

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
      </header>
    </div>
  );
};

export default App;
