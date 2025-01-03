import React, { useState, useEffect, useMemo } from "react";
import { AllCommunityModule, ModuleRegistry, ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([AllCommunityModule]);

interface Device {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
}


export default function DeviceList() {
    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs: ColDef<Device>[] = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name"},
        {field: "latitude", headerName: "Latitude"},
        {field: "longitude", headerName: "Longitude"},
        {field: "status", headerName: "Status"},
    ];



    

    // Synchronize DeviceList with external data.
    useEffect(() => {
        fetch("http://localhost:3000/data/devices") // Data source
        .then((response) => response.json())
        .then((data) => {
            setRowData(data);                       
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching devices:", error);
            setLoading(false);
        });
    }, []);


    return (
        <div className="h-full w-full">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <AgGridReact
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={{
                    sortable: true,
                    filter: true,
                    flex: 1,
                }}
                />
            )}
        </div>
    );
}
