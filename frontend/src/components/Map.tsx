import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Device {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
  }

  interface MapProps {
    selectedDevice?: Device;  // Currently selected device
    //filteredDevices: Device[];// Filtered devices to display on the map
}

export default function Map({ selectedDevice } : MapProps) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);


  // Set up map default values
  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiaHNqb2hhbnNlbiIsImEiOiJjbTVlOWQ1cDAyNnR4MmxyNzJtZmhvMmVmIn0.aRUwNHNNmYO7e0TrCs7Ksg";

    mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
       //style: "mapbox://styles/mapbox/streets-v11",
        center: [13.4050, 52.5200], // Berlin 
        zoom: 4,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);


  // Synchronize Map with external data.
  useEffect(() => {
    fetch("http://localhost:3000/data/devices")
    .then((response) => response.json())
    .then((data) => setDevices(data))
    .catch((error) => console.error("Error fetching devices:", error));
  }, []);


  // Add fecthed devices to map.
  useEffect(() => {
    // Clear existing markers.
    // markersRef.current.forEach((marker) => marker.remove());
    // markersRef.current = [];

    // // Add markers.
    // filteredDevices.forEach((filteredDevice) => {
    //     const marker = new mapboxgl.Marker()
    //         .setLngLat([filteredDevice.longitude, filteredDevice.latitude])
    //         .addTo(mapRef.current!);
    //     markersRef.current.push(marker);
    // });
    // if(selectedDevice) {
    //     mapRef.current?.flyTo({
    //         center: [selectedDevice.longitude, selectedDevice.latitude],
    //         zoom: 10,
    //     });
    // }

    if(mapRef.current && devices.length) {
        devices.forEach((device) => {
            new mapboxgl.Marker({color: device.status === "active" ? "green" : "red"})
            .setLngLat([device.longitude, device.latitude])
            .setPopup(new mapboxgl.Popup().setText(device.name))
            .addTo(mapRef.current!);
        });
    }
  }, [devices]);


  // Change map location to the selected device's location.
  useEffect(() => {
    if(mapRef.current && selectedDevice) {
        mapRef.current.flyTo({
            center: [selectedDevice.longitude, selectedDevice.latitude],
            zoom: 8,
            essential: true,
        });
    }
  }, [selectedDevice]);




  return <div className="h-full w-full" id="map-container" ref={mapContainerRef} />;
}
