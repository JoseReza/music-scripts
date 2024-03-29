import { Navbar } from './components/navbar';
import { Scripts } from './components/scripts';
import { useEffect, useState } from 'react';
import './App.css';

function App() {

  const [navbarSearchValue, setNavbarSearchValue] = useState("");
  const [ScriptsCounter, setScriptsCounter] = useState(0);

  const onChangeSearchValue = (value) => {
    setNavbarSearchValue(value);
  }

  const onChangeCounter = (value) => {
    setScriptsCounter(value);
  }

  return (
    <div className="App">
      <header className="App-header">
        <Navbar onChangeSearchValue={onChangeSearchValue} ScriptsCounter={ScriptsCounter}></Navbar>
        <Scripts navbarSearchValue={navbarSearchValue} onChangeCounter={onChangeCounter}></Scripts>
      </header>
    </div>
  );
}

export default App;
