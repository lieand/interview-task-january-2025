import React, { useState, useEffect, useMemo, useRef } from "react";
import { AllCommunityModule, ModuleRegistry, ColDef, GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "../index.css"
ModuleRegistry.registerModules([AllCommunityModule]);

interface Device {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    status: string;
}

interface DeviceListProps {
    onDeviceSelect: (device: Device) => void;
    //onFilterChange: (filteredDevices: Device[]) => void;
}

export default function DeviceList({ onDeviceSelect} : DeviceListProps) {

    const [loading, setLoading] = useState(true);
    const gridApiRef = useRef<GridApi | null>(null);

    // Filter status & original data
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [originalData, setOriginalData] = useState<Device[]>([]);

    // Active Device Data.
    const [activeDeviceId, setActiveDeviceId] = useState<number | null>(null);

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<Device[]>([]);

    // Column Definitions: Defines the columns to be displayed.
    const colDefs: ColDef<Device>[] = [
        {field: "id", headerName: "ID"},
        {field: "name", headerName: "Name"},
        {field: "latitude", headerName: "Latitude"},
        {field: "longitude", headerName: "Longitude"},
        {field: "status", headerName: "Status"},
    ];



    // Click Listener for row selection.
    const rowClickListener = (event: any) => {
        const clickedDevice = event.data;

        if(clickedDevice.id !== activeDeviceId) {
            setActiveDeviceId(clickedDevice.id);
            onDeviceSelect(clickedDevice);

            if(gridApiRef.current) {
                const selectedNodes = gridApiRef.current.getSelectedNodes();
                selectedNodes.forEach((node: any) => {
                    node.setSelected(false);
                });
                gridApiRef.current.refreshCells({force: true});
            }
                
        }

        console.log("Row clicked: ", event);
        console.log("Row name: ", clickedDevice.name)
        console.log("Selected Device:", clickedDevice.id )
    };


    // Highlight selected row.
    const rowClass = {
        "ag-row-active": (params: any) => params.data.id === activeDeviceId,
    };
    

    //
    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = event.target.value;
        setFilterStatus(selectedStatus);

        const filteredData = selectedStatus === "all" ? originalData
        : originalData.filter((device) => device.status === selectedStatus);
        
        setRowData(filteredData);
        //onFilterChange(filteredData);
    }


    // Synchronize DeviceList with external data.
    useEffect(() => {
        fetch("http://localhost:3000/data/devices") // Data source
        .then((response) => response.json())
        .then((data) => {
            setRowData(data);    
            setOriginalData(data);   
            //onFilterChange(data);                
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching devices:", error);
            setLoading(false);
        });
    }, []);


    // Grid initialization
    const onGridReady = (params: any) => {
        gridApiRef.current = params.api;
    }




    return (
        <div className="h-full w-full flex flex-col">
            <div className="p-2">
                <label htmlFor="status-filter" className="mr-2">
                    Filter by Status:
                </label>

                <select
                    id="status-filter"
                    value={filterStatus}
                    onChange={handleFilterChange}
                    className="border rounded px-2 py-1"
                >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <div className="h-full w-full">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <AgGridReact
                        onRowClicked={rowClickListener}     // Row click listener
                        rowClassRules={rowClass}           // Active row styling
                        rowSelection="single"
                        onGridReady={onGridReady}           // Store gridApi when grid is ready
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
        </div>
        
    );
}
