import React, { useState } from "react";
import Map from "./components/Map";
import DeviceList from "./components/DeviceList";

function App(): React.JSX.Element {
    const [activeDevice, setActiveDevice] = useState(null);

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/3 h-full overflow-auto border-r">
        <DeviceList onDeviceSelect={setActiveDevice}/>
      </div>
      <div className="w-2/3 h-full">
        <Map activeDevice={activeDevice}/>
      </div>
    </div>
  );
}

export default App;
