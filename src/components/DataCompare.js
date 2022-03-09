function createCompareHeader(compareObjects){
    if (undefined === compareObjects) {
        return;
    }

    var headers = []
    var headerStateElement = {"title": "state",  "field": "state", "editable": "never", "lookup": { "none": "None", "add": "Add", "remove": "Remove", "modify": "Modify" }}
    var headerRevisionElement = {"title": "revision", "field": "revision", "editable": "never"}
    headers.push(headerStateElement);
    headers.push(headerRevisionElement);

    //console.log(compareObjects)
    const columns = new Set()
    for (var object of compareObjects) {
        var datas = object["datas"];
        for (var data of datas) {
            for (var element in data) {
                columns.add(element)
            };
        };
    };

    for (var column of columns) {
        var headerElement = {}
        headerElement["title"] = column;
        headerElement["field"] = column;
        headerElement["editable"] = "never";
        headers.push(headerElement);
    }
    return headers;
}

function findDataIndex(datas, keyColumnName, findKey) {
    if (datas === undefined) {
        console.log("datas undefined");
        return -1;
    }

    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        var keyName = data[keyColumnName];
        if (findKey === keyName) {
            return i+1;
        }
    }
    return -1;
}

function deepCompareMaps(map1, map2) {
    if (map1.size !== map2.size) {
        return false;
    }
    for (var key in map1) {
        var map1Value = map1[key];
        var map2Value = map2[key];
        if (map1Value != map2Value) {
            return false;
        }
    }
    return true;
}

function dataCompare(compareObjects, keyColumnName, comapreCellValue) {
    if (compareObjects.length < 2) {
        console.log("data file length error");
        return;
    }

    var lastIndex = compareObjects.length - 1;
    var previousIndex = compareObjects.length - 2;

    var outputDatas = []
    var currentDatas = compareObjects[lastIndex]["datas"];
    var currentRevision = compareObjects[lastIndex]["extra"]["revision"];
    
    // None, Modify, Add State 
    var previousMap = compareObjects[previousIndex]["map"];
    for (var data of currentDatas) {
        var compareState = "none";
        var keyName = data[keyColumnName];
        var previousData = previousMap[keyName];
        if (previousData === undefined) {
            compareState = "add";
        } else {
            if (false === deepCompareMaps(previousData, data)) {
                compareState = "modify";
            }
        }
        outputDatas.push(createCompareData(currentRevision, compareState, data, (comapreCellValue) ? previousData : undefined));
    }

    // Remove State
    var currentMap = compareObjects[lastIndex]["map"];
    var previousDatas = compareObjects[previousIndex]["datas"];
    var previousRevision = compareObjects[previousIndex]["extra"]["revision"];
    var insertRemoveDatas = [];
    var matchAliasName = "";
    for (var data of previousDatas) {
        var keyName = data[keyColumnName];
        var currentData = currentMap[keyName];
        if (currentData === undefined) {
            insertRemoveDatas.push(createCompareData(currentRevision, "remove", data, undefined))
        } else {
            if (insertRemoveDatas.length > 0) {
                // remove 정보를 한번에 push
                var insertIndex = 0;
                if (matchAliasName == "") {

                } else {
                    insertIndex = findDataIndex(outputDatas, keyColumnName, matchAliasName);
                    // 못찾으면 제일 상단에 추가
                    if (-1 === insertIndex) {
                        insertIndex = 0;
                    }
                }
                Array.prototype.splice.apply(outputDatas, [insertIndex, 0].concat(insertRemoveDatas));
                insertRemoveDatas.length = 0;
            }
            matchAliasName = keyName;
        }
    }
    // 남은건 제일 하단에 추가
    if (insertRemoveDatas.length > 0) {
        Array.prototype.push.apply(outputDatas,insertRemoveDatas);
    }

    // revision update
    for (var data of outputDatas) {
        var keyName = data[keyColumnName];
        if (data["state"] == "none") {
            var currentData = currentMap[keyName];
            for (var i = previousIndex; i >= 0; i--) {
                var compareMap = compareObjects[i]["map"];
                if (undefined == compareMap) {
                    break;
                }
                var compareData = compareMap[keyName];
                if (undefined == compareData) {        
                    break;
                }
                if (false === deepCompareMaps(currentData, compareData)) {
                    break;
                }
                data["revision"] = compareObjects[i]["extra"]["revision"];
            }
        }
    }
    return outputDatas
}

function createAliasMap(compareObjects, keyColumnName) {
    for (var object of compareObjects) {
        var aliasMap = {}
        var datas = object["datas"];
        for (var data of datas) {
            var keyName = data[keyColumnName];
            if (keyName != undefined) {
                aliasMap[keyName] = data;
            } else {
                console.log("key column not found.", data)
            }
        }
        object["map"] = aliasMap;
    }
}

function createRevisionMap(compareObjects) {
    var revisionMap = {}
    for (var data of compareObjects) {
        var extra = data["extra"];
        var revisionKey = extra["revision"];
        if (revisionKey != undefined) {
            revisionMap[revisionKey] = extra;
        }
    }
    return revisionMap;
}

function createCompareData(revisionKey, compareState, orgData, previousData) {
    var newData = {}
    newData = JSON.parse(JSON.stringify(orgData));

    if (undefined != previousData) {
        for (var key in newData) {
            var map1Value = newData[key];
            var map2Value = previousData[key];
            if (map1Value != map2Value) {
                newData[key] += "\n[" + map2Value + "]";
            }
        }
    }

    newData["revision"] = revisionKey;
    newData["state"] = compareState;
    return newData;
}

export function InitCompare(compareObjects, keyColumnName){
    if (compareObjects === undefined) {
        console.log("data file not found");
        return;
    }
    if (compareObjects.length < 2) {
        console.log("data file length error");
        return;
    }
    createAliasMap(compareObjects, keyColumnName)
    var revisionMap = createRevisionMap(compareObjects) 
    return revisionMap;
}

export function ExecuteCompare(compareObjects, keyColumnName, comapreCellValue){
    if (compareObjects === undefined) {
        console.log("data file not found");
        return;
    }

    if (compareObjects.length == 0) {
        console.log("data file length error");
        return;
    }

    var headers = createCompareHeader(compareObjects);
    var bodys = []
    if (compareObjects.length == 1) {
        var currentBodys = compareObjects[0]["datas"];
        var currentRevision = compareObjects[0]["extra"]["revision"];
        for (var body of currentBodys) {
            bodys.push(createCompareData(currentRevision, "none", body, undefined));
        }
    } else {
        bodys = dataCompare(compareObjects, keyColumnName, comapreCellValue)
    }

    var output = {}
    output["headers"] = headers;
    output["datas"] = bodys;
    return output;
}