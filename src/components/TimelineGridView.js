import './../App.css';
import React, { useState, useEffect, Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
//import CompareArrowsIcon from '@material-ui/icon/search';
//import Delete from '@material-ui/icons/Delete';
import CompareArrows from '@material-ui/icons/CompareArrows';

//import Save from '@material-ui/icons/Save';

export function TimelineGridView({titleName, compareResult, onSelectedRow}) {
    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);
    //const [titleName, setTitleName] = useState("Data Timeline Compare");

    // useEffect(() => {
    //     var lastRevisionData = dataList[dataList.length - 1];
    //     if (undefined != lastRevisionData && undefined != lastRevisionData["extra"]) {
    //         var title = lastRevisionData["extra"].title;
    //         if (undefined != title) {
    //             setTitleName(title);
    //         }
    //     }
    // }, [dataList]);

    useEffect(() => {
        var headers = restoreColumnOption(compareResult["headers"]);
        setColumns(headers);
        //setColumns(compareResult["headers"]);
        setDatas(compareResult["datas"]);
    }, [compareResult]);

    useEffect(() => {
        restoreColumnOption();
        
    }, [columns]);

    // function backupColumnOption() {
    //     var saveOption = {}
    //     for (var columnKey in columns) {
    //         var column = columns[columnKey];
    //         if (undefined != column.tableData) {
    //             if (undefined != column.tableData.filterValue) {
    //                 saveOption[columnKey] = column.tableData.filterValue;
    //             }
    //         }
    //     }
    //     console.log(saveOption);
    //     setColumnOption(saveOption)
    // }

    function restoreColumnOption(newColumn) {
        // var saveOption = {}
        // for (var columnKey in columns) {
        //     var column = columns[columnKey];
        //     if (undefined != column.tableData) {
        //         if (undefined != column.tableData.filterValue) {
        //             saveOption[columnKey] = column.tableData.filterValue;
        //         }
        //     }
        // }

        // for (var columnKey in columnOption) {
        //     var column = columnOption[columnKey];
        // }
        return newColumn
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

    function onRowClick(event, rowData) {
        //console.log(columns)
        onSelectedRow(rowData);
    }

    return (
            <div className="GridView">
                <MaterialTable
                    title={titleName}
                    columns={columns}
                    data={datas}
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
                    // actions={[
                    //     {
                    //       icon: CompareArrows,
                    //       tooltip: 'Toggle Compare Value',
                    //       isFreeAction: true,
                    //       onClick: (event) => onToggleCompareCellValue()
                    //     }
                    //   ]}
                    onRowClick={onRowClick}
                />
            </div>
    )
}

export default React.memo(TimelineGridView);