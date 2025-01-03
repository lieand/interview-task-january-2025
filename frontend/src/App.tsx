import React from "react";
import Map from "./components/Map";
import DeviceList from "./components/DeviceList";

function App(): React.JSX.Element {
  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/3 h-full overflow-auto border-r">
        <DeviceList />
      </div>
      <div className="w-2/3 h-full">
        <Map />
      </div>
    </div>
  );
}

export default App;
