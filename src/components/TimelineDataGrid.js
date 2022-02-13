import './../App.css';
import React, { useState, useEffect, Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
import jsonData1 from './../testData#1.json'
import jsonData2 from './../testData#2.json'
import jsonData3 from './../testData#3.json'
//import jsonData from './../testDataDiffResult.json'
//import jsonRevisionData from './../testDataRevisionAll.json'
import {JsonCompare} from './DataCompare'
import {TextField, Button, Chip, FormControl, InputLabel, Select, MenuItem} from '@material-ui/core'


export default function TimelineDataGrid() {

    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    const [revisionData, setRevisionData] = useState({});
    const [selectRevisionIndex, setSelectRevisionIndex] = useState("0");
    const [selectRevisionDate, setSelectRevisionDate] = useState(" ");
    const [selectRevisionDesc, setSelectRevisionDesc] = useState(" ");
    const [titleName, setTitleName] = useState("Data Timeline Compare");

    useEffect(()=>{
        var dataList = []
        dataList.push(jsonData1);
        dataList.push(jsonData2);
        var compareResult = JsonCompare(dataList, "alias");
        setColumns(compareResult["headers"]);
        setDatas(compareResult["bodys"]);
        setRevisionData(compareResult["revision"]);

        var lastRevisionData = dataList[dataList.length-1];
        if (undefined != lastRevisionData["extra"]) {
            var title = lastRevisionData["extra"].title;
            if (undefined != title) {
                setTitleName(title);
            }
            var revision = lastRevisionData["extra"].revision;
            if (undefined != revision) {
                selectRevision(revision);
            }
        }

      },[])

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
        selectRevision(revisionIndex);
    }

    function selectRevision(revisionIndex) {
        if (revisionIndex === undefined) {
            return;
        }
        setSelectRevisionIndex(revisionIndex)

        if (revisionData === undefined || revisionData.length == 0) {
            return;
        }
        var targetRevisionData = revisionData[revisionIndex]
        if (targetRevisionData === undefined) {
            return;
        }
        console.log(targetRevisionData)
        setSelectRevisionDate(targetRevisionData["date"])
        setSelectRevisionDesc(targetRevisionData["description"])
    }

    return (
        <div className="TimelineView">
            <div className="GridView">
                <MaterialTable
                    title={titleName}
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
