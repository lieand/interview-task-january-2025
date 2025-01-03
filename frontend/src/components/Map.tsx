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

export default function Map() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [devices, setDevices] = useState<Device[]>([]);

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

  useEffect(() => {
    fetch("http://localhost:3000/data/devices")
    .then((response) => response.json())
    .then((data) => setDevices(data))
    .catch((error) => console.error("Error fetching devices:", error));
  }, []);

  useEffect(() => {
    if(mapRef.current && devices.length) {
        devices.forEach((device) => {
            new mapboxgl.Marker({color: device.status === "active" ? "green" : "red"})
            .setLngLat([device.longitude, device.latitude])
            .setPopup(new mapboxgl.Popup().setText(device.name))
            .addTo(mapRef.current);
        });
    }
  }, [devices]);


  return <div className="h-full w-full" id="map-container" ref={mapContainerRef} />;
}
