import './../App.css';
import React, { useState, useEffect, Component } from 'react';
import MaterialTable, { MTableToolbar } from 'material-table';
//import CompareArrowsIcon from '@material-ui/icon/search';
//import Delete from '@material-ui/icons/Delete';
import CompareArrows from '@material-ui/icons/CompareArrows';

//import Save from '@material-ui/icons/Save';

export function TimelineGridView({config, compareResult, onSelectedRow}) {
    const [columns, setColumns] = useState([]);
    const [datas, setDatas] = useState([]);

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
            return config["AddRowColor"]
        else if (rowData.state === "remove")
            return config["RemoveRowColor"]
        else if (rowData.state === "modify")
            return config["ModifyRowColor"]
        return undefined
    }

    function onRowClick(event, rowData) {
        //console.log(columns)
        onSelectedRow(rowData);
    }

    function getMaxBodyHeight() {
        if (config["Grouping"] === true) {
            return "calc(100vh - 213px)"
        }
        return "calc(100vh - 160px)"
    }

    return (
            <div className="GridView">
                <MaterialTable
                    title={config["Title"]}
                    columns={columns}
                    data={datas}
                    options={{
                        grouping: config["Grouping"],
                        search: true,
                        columnsButton: true,
                        filtering: config["Filtering"],
                        paging: false,
                        maxBodyHeight: getMaxBodyHeight(),
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