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

function bodyCompare(dataList, keyColumnName) {
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
        var newBody = {}
        newBody["revision"] = currentRevision;
        var keyName = body[keyColumnName];
        var previousBody = previousMap[keyName];
        if (previousBody === undefined) {
            newBody["state"] = "add";
        } else {
            if (false === deepCompareMaps(previousBody, body)) {
                newBody["state"] = "modify";
            } else {
                newBody["state"] = "none";
            }
        }
        outputBodys.push(Object.assign(newBody, body));
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
            var newBody = {}
            newBody["revision"] = previousRevision;
            newBody["state"] = "remove";
            insertRemoveBodys.push(Object.assign(newBody, body))
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
    if (insertRemoveBodys.length > 0) {
        Array.prototype.push.apply(outputBodys,insertRemoveBodys);
    }

    // old data revision update
    // var previousMap = previousData["map"];
    // for (var current of currentMap) {
    //     console.log(current)
    //     // var keyName = currentBody[keyColumnName];
    //     // if (keyName != undefined) {
    //     // }
    // }

    for (var i = lastIndex; i >= 0; i--) {
        var data = dataList[i];
        //console.log(data)
    }

    //console.log(outputBodys)
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

export function JsonCompare(dataList, keyColumnName){
    if (dataList === undefined) {
        console.log("data file not found");
        return;
    }
    if (dataList.length < 2) {
        console.log("data file length error");
        return;
    }
    //console.log("JsonCompare start")
    createAliasMap(dataList, keyColumnName)
    var revisionMap = createRevisionMap(dataList)
    console.log(dataList, revisionMap)

    // extra 정보에 revision이 있으면 header 정보에 revision column 정보 추가
    var headers = createCompareHeader(dataList);
    var bodys = bodyCompare(dataList, keyColumnName)
    
    
    //  for (var i = len; i >= 0; i--) {
    //     var data = dataList[i];
    //     console.log(data)
    // }

    //var bodys = 

    // 최신 데이터 기준으로 이전 리비전과 compare 정보 생성
    // 모든 데이터 순회하며 revision 숫자 기입

    // 사용자 지정 주석 데이터 Merge




    // arr.slice().reverse().forEach(x => console.log(x))
    // var prevBodys = prevData["bodys"];
    // var prevBodys = prevData["extra"];
    // var nextBodys = nextData["bodys"];
    // var nextBodys = nextData["extra"];

    // var output

    var output = {}
    output["headers"] = headers;
    output["bodys"] = bodys;
    output["revision"] = revisionMap;
    console.log(output)    
    return output;
}