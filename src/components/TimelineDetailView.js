import './../App.css';
import React, { useState, useEffect, Component } from 'react';
import { TextField, Slider } from '@material-ui/core'

const TimelineDetailView = ({revisionMap, selectRevisionKey}) => {
    const [selectRevisionWho, setSelectRevisionWho] = useState(" ");
    const [selectRevisionDate, setSelectRevisionDate] = useState(" ");
    const [selectRevisionDesc, setSelectRevisionDesc] = useState(" ");

    useEffect(() => {
        if (selectRevisionKey === undefined) {
            return;
        }
        if (revisionMap === undefined) {
            return;
        }
        var targetRevisionData = revisionMap[selectRevisionKey]
        if (targetRevisionData === undefined) {
            return;
        }
        //console.log(targetRevisionData)
        setSelectRevisionWho(targetRevisionData["who"])
        setSelectRevisionDate(targetRevisionData["date"])
        setSelectRevisionDesc(targetRevisionData["description"])
    }, [selectRevisionKey])

    return (
        <div className="DetailView">
            <TextField value={selectRevisionKey} style = {{width: "10%"}} defaultValue=" " size="small" label="revision" variant="filled" InputProps={{ readOnly: true }} />
            <TextField value={selectRevisionWho} style = {{width: "10%"}} size="small" label="who" variant="filled" InputProps={{ readOnly: true }} />
            <TextField value={selectRevisionDate} style = {{width: "20%"}} size="small" label="date" variant="filled" InputProps={{ readOnly: true }} />
            <TextField value={selectRevisionDesc} style = {{width: "60%"}} size="small" label="desc" variant="filled" InputProps={{ readOnly: true }} />
        </div>
    )
}
export default TimelineDetailView;