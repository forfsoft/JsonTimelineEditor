import './../App.css';
import React, { useState, Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import jsonData from './../testDataDiffResult.json'
import jsonRevisionData from './../testDataRevisionAll.json'

import {TextField, Button, Chip, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'


export default function TimelineDataGrid() {

    const [columns, setColumns] = useState(jsonData["headers"]);
    const [datas, setDatas] = useState(jsonData["bodys"]);
    const [selectRevisionIndex, setSelectRevisionIndex] = useState("0");
    const [selectRevisionDate, setSelectRevisionDate] = useState(" ");
    const [selectRevisionDesc, setSelectRevisionDesc] = useState(" ");

    function onSaveFile() {
        alert("onSaveFile")
    }

    function onEditDesc(rowData) {
        alert("onEditDesc")
    }

    function getRowColor(rowData) {
        if (rowData.state === "add")
            return '#FF66AA'
        else if (rowData.state === "remove")
            return '#FF6666'
        else if (rowData.state === "modify")
            return '#FFAA66'
        return undefined
    }

    function onSelectedRow(rowData) {
        console.log("select row:",rowData)
        var revisionIndex = rowData["revision"]
        if (revisionIndex === undefined) {
            return;
        }
        console.log("select revision Index:",revisionIndex)
        var revisionData = jsonRevisionData["revision"][revisionIndex]
        //console.log(revisionData)
        setSelectRevisionIndex(revisionIndex)
        setSelectRevisionDate(revisionData["date"])
        setSelectRevisionDesc(revisionData["description"])
    }

    return (
        <div className="TimelineView">
            <div className="GridView">
                <MaterialTable
                    title={jsonData["extra"].title}
                    columns={columns}
                    data={datas}
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
                        grouping: true,
                        search: true,
                        columnsButton: true,
                        filtering: true,
                        paging: false,
                        maxBodyHeight: "calc(100vh - 167px)",
                        rowStyle: rowData => ({
                            backgroundColor: getRowColor(rowData)
                        })
                    }}

                    onRowClick={((evt, selectedRow) => onSelectedRow(selectedRow))}
                />
            </div>
            <div className="DetailView">
                <TextField id="filled-basic" className="DetailView-Revision" value={selectRevisionIndex}  size="small" label="revision" variant="filled" InputProps={{readOnly: true}} />
                <TextField id="filled-basic" className="DetailView-Date" value={selectRevisionDate} size="small" label="date" variant="filled" InputProps={{ readOnly: true }} />
                <TextField id="filled-basic" className="DetailView-Desc" value={selectRevisionDesc} size="small" label="desc" variant="filled" InputProps={{ readOnly: true }} />
            </div>
        </div>
    )
}
