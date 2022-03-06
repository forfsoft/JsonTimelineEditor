import './../App.css';
import React, { useState, useEffect, useCallback } from 'react';
import TimelineDetailView from './TimelineDetailView'
import TimelineGridView from './TimelineGridView'
import CompareConfig from './../config.json'
import jsonData1 from './../testData#1.json'
import jsonData2 from './../testData#2.json'
import jsonData3 from './../testData#3.json'
import { InitCompare, ExecuteCompare } from './DataCompare'
import { TextField, Slider } from '@material-ui/core'

const TimelineDataGrid = () => {
    const [comapreCellValue, setComapreCellValue] = useState(false);
    const [compareResult, setCompareResult] = useState({});
    const [revisionMap, setRevisionMap] = useState({});
    const [dataList, setDataList] = useState([]);
    const [selectRevisionDescKey, setSelectRevisionDescKey] = useState(undefined);
    const [revisionMaxCount, setRevisionMaxCount] = useState(1);
    const [selectRevisionIndex, setSelectRevisionIndex] = useState(0);

    useEffect(() => {
        var compareFiles = []
        compareFiles.push(jsonData1);
        compareFiles.push(jsonData2);
        compareFiles.push(jsonData3);
        setDataList(compareFiles);
        var revisions = InitCompare(compareFiles, CompareConfig["KeyColumnName"]);
        setRevisionMap(revisions);

        setSelectRevisionIndex(compareFiles.length-1);
    }, [])

    useEffect(() => {
        var maxCount = Object.keys(revisionMap).length - 1;
        
        if (maxCount > 0) {
            setRevisionMaxCount(maxCount);
            // 마지막 리비젼 선택
            setSelectRevisionIndex(maxCount);
        }
    }, [revisionMap])

    useEffect(() => {
        if (dataList.length == 0) {
            return;
        }
        if (selectRevisionIndex == undefined || selectRevisionIndex < 0) {
            return;
        }

        var compareList = []
        for (var i = 0; i <= selectRevisionIndex; i++) {
            compareList.push(dataList[i]);
        }
        //console.log(selectRevisionIndex, compareList)
        var compare = ExecuteCompare(compareList, CompareConfig["KeyColumnName"], CompareConfig["ViewComapreCellValue"]);
        if (undefined != compare) {
            setCompareResult(compare);
            //console.log(compare)
        }
    }, [dataList, revisionMaxCount, selectRevisionIndex])

    function onRevisionChange(event, value) {
        //console.log(value)
        setSelectRevisionIndex(value)
    } 

    const onSelectedRow = useCallback(rowData => {
        var revisionKey = rowData["revision"]
        if (revisionKey === undefined) {
            return;
        }
        setSelectRevisionDescKey(revisionKey);
    }, []);

    return (
        <div className="TimelineView">
            <TimelineGridView titleName={CompareConfig["Title"]} compareResult={compareResult} onSelectedRow={onSelectedRow} />
            <div className="TimelineSlider">
                <Slider
                    value={selectRevisionIndex}
                    valueLabelDisplay="auto"
                    step={1} marks min={0} max={revisionMaxCount} onChange={onRevisionChange} />
            </div>
            <TimelineDetailView dataList={dataList} revisionMap={revisionMap} selectRevisionKey={selectRevisionDescKey} />
        </div>
    )
}
export default TimelineDataGrid;