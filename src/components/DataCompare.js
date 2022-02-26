function createCompareHeader(dataList){
    if (undefined === dataList) {
        return;
    }

    var headers = []
    var headerStateElement = {"title": "state",  "field": "state", "editable": "never", "lookup": { "none": "None", "add": "Add", "remove": "Remove", "modify": "Modify" }}
    var headerRevisionElement = {"title": "revision", "field": "revision", "editable": "never"}
    headers.push(headerStateElement);
    headers.push(headerRevisionElement);

    //console.log(dataList)
    const columns = new Set()
    for (var data of dataList) {
        var bodys = data["bodys"];
        for (var body of bodys) {
            for (var element in body) {
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

function findBodyIndex(bodys, keyColumnName, findKey) {
    if (bodys === undefined) {
        console.log("bodys undefined");
        return -1;
    }

    for (var i = 0; i < bodys.length; i++) {
        var body = bodys[i];
        var keyName = body[keyColumnName];
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

function bodyCompare(dataList, keyColumnName, comapreCellValue) {
    if (dataList.length < 2) {
        console.log("data file length error");
        return;
    }

    var lastIndex = dataList.length - 1;
    var previousIndex = dataList.length - 2;

    var outputBodys = []
    var currentBodys = dataList[lastIndex]["bodys"];
    var currentRevision = dataList[lastIndex]["extra"]["revision"];
    
    // None, Modify, Add State 
    var previousMap = dataList[previousIndex]["map"];
    for (var body of currentBodys) {
        var compareState = "none";
        var keyName = body[keyColumnName];
        var previousBody = previousMap[keyName];
        if (previousBody === undefined) {
            compareState = "add";
        } else {
            if (false === deepCompareMaps(previousBody, body)) {
                compareState = "modify";
            }
        }
        outputBodys.push(createCompareBody(currentRevision, compareState, body, (comapreCellValue) ? previousBody : undefined));
    }

    // Remove State
    var currentMap = dataList[lastIndex]["map"];
    var previousBodys = dataList[previousIndex]["bodys"];
    var previousRevision = dataList[previousIndex]["extra"]["revision"];
    var insertRemoveBodys = [];
    var matchAliasName = "";
    for (var body of previousBodys) {
        var keyName = body[keyColumnName];
        var currentBody = currentMap[keyName];
        if (currentBody === undefined) {
            insertRemoveBodys.push(createCompareBody(currentRevision, "remove", body, undefined))
        } else {
            if (insertRemoveBodys.length > 0) {
                // remove 정보를 한번에 push
                var insertIndex = 0;
                if (matchAliasName == "") {

                } else {
                    insertIndex = findBodyIndex(outputBodys, keyColumnName, matchAliasName);
                    // 못찾으면 제일 상단에 추가
                    if (-1 === insertIndex) {
                        insertIndex = 0;
                    }
                }
                Array.prototype.splice.apply(outputBodys, [insertIndex, 0].concat(insertRemoveBodys));
                insertRemoveBodys.length = 0;
            }
            matchAliasName = keyName;
        }
    }
    // 남은건 제일 하단에 추가
    if (insertRemoveBodys.length > 0) {
        Array.prototype.push.apply(outputBodys,insertRemoveBodys);
    }

    // revision update
    for (var body of outputBodys) {
        var keyName = body[keyColumnName];
        if (body["state"] == "none") {
            var currentBody = currentMap[keyName];
            for (var i = previousIndex; i >= 0; i--) {
                var compareMap = dataList[i]["map"];
                if (undefined == compareMap) {
                    break;
                }
                var compareBody = compareMap[keyName];
                if (undefined == compareBody) {        
                    break;
                }
                if (false === deepCompareMaps(currentBody, compareBody)) {
                    break;
                }
                body["revision"] = dataList[i]["extra"]["revision"];
            }
        }
    }
    return outputBodys
}

function createAliasMap(dataList, keyColumnName) {
    for (var data of dataList) {
        var aliasMap = {}
        var bodys = data["bodys"];
        for (var body of bodys) {
            var keyName = body[keyColumnName];
            if (keyName != undefined) {
                aliasMap[keyName] = body;
            } else {
                console.log("key column not found.", body)
            }
        }
        data["map"] = aliasMap;
    }
}

function createRevisionMap(dataList) {
    var revisionMap = {}
    for (var data of dataList) {
        var extra = data["extra"];
        var revisionKey = extra["revision"];
        if (revisionKey != undefined) {
            revisionMap[revisionKey] = extra;
        }
    }
    return revisionMap;
}

function createCompareBody(revisionKey, compareState, orgBody, previousBody) {
    var newBody = {}
    newBody = JSON.parse(JSON.stringify(orgBody));

    if (undefined != previousBody) {
        for (var key in newBody) {
            var map1Value = newBody[key];
            var map2Value = previousBody[key];
            if (map1Value != map2Value) {
                newBody[key] += "\n[" + map2Value + "]";
            }
        }
    }

    newBody["revision"] = revisionKey;
    newBody["state"] = compareState;
    //newBody["desc"] = "aasdasdf<p>as\nfasd<br/>asfd";
    //console.log(newBody)
    return newBody;
    // newBody["revision"] = revisionKey;
    // newBody["state"] = compareState;
    // 
    // console.log(newBody)
    // return Object.assign(newBody, orgBody);
}

export function InitJsonCompare(dataList, keyColumnName){
    if (dataList === undefined) {
        console.log("data file not found");
        return;
    }
    if (dataList.length < 2) {
        console.log("data file length error");
        return;
    }
    createAliasMap(dataList, keyColumnName)
    var revisionMap = createRevisionMap(dataList)
    //console.log(dataList, revisionMap)
    //console.log(dataList)    
    return revisionMap;
}

export function JsonCompareBody(dataList, keyColumnName, comapreCellValue){
    if (dataList === undefined) {
        console.log("data file not found");
        return;
    }

    if (dataList.length == 0) {
        console.log("data file length error");
        return;
    }

    var headers = createCompareHeader(dataList);
    var bodys = []
    if (dataList.length == 1) {
        var currentBodys = dataList[0]["bodys"];
        var currentRevision = dataList[0]["extra"]["revision"];
        for (var body of currentBodys) {
            bodys.push(createCompareBody(currentRevision, "none", body, undefined));
        }
    } else {
        bodys = bodyCompare(dataList, keyColumnName, comapreCellValue)
    }

    var output = {}
    output["headers"] = headers;
    output["bodys"] = bodys;
    return output;
}