import React, { useState, Component } from 'react';
import MaterialTable from 'material-table';
import jsonData from './../testDataDiffResult.json'

export default function TimelineDataGrid() {

    const [columns, setColumns] = useState(jsonData["headers"]);
    const [datas, setDatas] = useState(jsonData["bodys"]);
    
    function getRowColor(rowData) {
        if (rowData.state === "add")
            return '#FF66AA'
        else if (rowData.state === "remove")
            return '#FF6666'
        else if (rowData.state === "modify")
            return '#FFAA66'
        return undefined
    }

    return (
        <MaterialTable
            title={jsonData["extra"].title}
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
                        for (var i = 0; i < datas.length; i++) {
                            if (datas[i] == rowData) {
                                console.log("modify", columnDef.field, datas[i][columnDef.field])
                                datas[i][columnDef.field] = newValue;
                                //DB에 값 전송
                                setTimeout(resolve, 1);
                                break;
                            }
                        }
                    });
                }
            }}

            options={{
                rowStyle: rowData => ({
                    backgroundColor: getRowColor(rowData)
                })
            }}
        />
    )
}
