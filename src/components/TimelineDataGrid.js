import React, { useState, Component } from 'react';
import MaterialTable from 'material-table';
import jsonData from './../testData.json'

export default function TimelineDataGrid() {

    const [columns, setColumns] = useState(jsonData["headers"]);
    const [datas, setDatas] = useState(jsonData["bodys"]);
    
    return (
        <MaterialTable
            title="Simple Action Preview"
            columns={columns}
            data={datas}
            // actions={[
            //     {
            //         icon: 'save',
            //         tooltip: 'Save User',
            //         onClick: (event, rowData) => alert("You saved " + rowData.name)
            //     }
            // ]}

            cellEditable={{
                onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
                    return new Promise((resolve, reject) => {
                        console.log('newValue: ' + newValue);
                        setTimeout(resolve, 1000);
                    });
                }
            }}
        />
    )
}
