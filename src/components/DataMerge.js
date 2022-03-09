export function ExecuteMerge(sourceDatas, keyColumnName, mergeDatas){

    // var output = {}
    // output["headers"] = headers;
    // output["datas"] = bodys;

    if (sourceDatas === undefined) {
        console.log("source data not found");
        return;
    }

    if (mergeDatas === undefined) {
        console.log("merge data not found");
        return;
    }

    if (mergeDatas === undefined || mergeDatas.length == 0) {
        console.log("merge data length error");
        return;
    }

    // add header 
    var sourceHeaders = sourceDatas["headers"]
    if (sourceHeaders === undefined) {
        console.log("source column not found");
        return;
    }
    const columns = new Set()
    for (var key in mergeDatas) {
        for (var element in mergeDatas[key]) {
            var addColumn = true;
            for (var header of sourceHeaders) {
                if (header["field"] === element) {
                    addColumn = false;
                    break;
                }
            }
            if (addColumn === true ) {
                //console.log("Add", element)
                columns.add(element)
            }
        };
    };

    for (var column of columns) {
        var headerElement = {}
        headerElement["title"] = column;
        headerElement["field"] = column;
        headerElement["editable"] = "never";
        sourceHeaders.push(headerElement);
    }


    // add data
    var sourceDatas = sourceDatas["datas"]
    if (sourceDatas === undefined) {
        console.log("source datas not found");
        return;
    }

    for (var key in mergeDatas) {
        var mergeData = mergeDatas[key]
        for (var sourceData of sourceDatas) {
            // 기존 데이터에 키 값이 동일하면 데이터 merge
            if (sourceData[keyColumnName] == key) {
                for (var mergeElement in mergeData) {
                    sourceData[mergeElement] = mergeData[mergeElement]
                }
            }
        }
    }
}