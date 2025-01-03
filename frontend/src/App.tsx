import React, { useState } from "react";
import Map from "./components/Map";
import DeviceList from "./components/DeviceList";

function App(): React.JSX.Element {
    const [selectedDevice, setselectedDevice] = useState(null);
    //const [filteredDevices, setFilteredDevices] = useState(null);

  return (
    <div className="w-screen h-screen flex">
      <div className="w-1/3 h-full overflow-auto border-r">
        <DeviceList 
            onDeviceSelect={setselectedDevice}
            //onFilterChange={setFilteredDevices}
        />
      </div>
      <div className="w-2/3 h-full">
        <Map 
            selectedDevice={selectedDevice}
            //filteredDevices={filteredDevices}
        />
      </div>
    </div>
  );
}

export default App;
