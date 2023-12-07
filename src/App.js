import React, { useState } from 'react';
import Routes from "./Routes";
import './App.css';

function App() {
    const [loadingHeader, setLoadingHeader] = useState(true);

    return (
        <div>
            {loadingHeader && <p>Loading...</p>}
            <div
                className="App"
                style={{ display: loadingHeader ? 'none' : 'block' }}
            >
                <Routes
                    setLoadingHeader={setLoadingHeader}
                />
            </div>
        </div>
    );
}

export default App;
