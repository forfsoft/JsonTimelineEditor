import './../App.css';
import React, { useState, useEffect, useCallback } from 'react';
import TimelineDetailView from './TimelineDetailView'
import TimelineGridView from './TimelineGridView'
import jsonData1 from './../testData#1.json'
import jsonData2 from './../testData#2.json'
import jsonData3 from './../testData#3.json'
import { InitJsonCompare, JsonCompareBody } from './DataCompare'
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
        var revisions = InitJsonCompare(compareFiles, "alias");
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
        var compare = JsonCompareBody(compareList, "alias", comapreCellValue);
        if (undefined != compare) {
            setCompareResult(compare);
            //console.log(compare)
        }
    }, [dataList, revisionMaxCount, selectRevisionIndex, comapreCellValue])

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

    const onToggleCompareCellValue = () => {
        //window.location.reload();
        setComapreCellValue(!comapreCellValue);
    }

    return (
        <div className="TimelineView">
            <TimelineGridView dataList={dataList} compareResult={compareResult} onSelectedRow={onSelectedRow} onToggleCompareCellValue={onToggleCompareCellValue}/>
            <Slider 
                value={selectRevisionIndex}
                valueLabelDisplay="auto"
                step={1} marks min={0} max={revisionMaxCount} onChange={onRevisionChange} />
            <TimelineDetailView dataList={dataList} revisionMap={revisionMap} selectRevisionKey={selectRevisionDescKey} />
        </div>
    )
}
export default TimelineDataGrid;