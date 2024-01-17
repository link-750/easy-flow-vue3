/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Trent
 * @Date: 2024-01-16 14:05:35
 * @LastEditors: Trent
 * @LastEditTime: 2024-01-16 19:40:18
 */
// 是否具有该线
export function hasLine(data, from, to) {
    for (let i = 0; i < data.lineList.length; i++) {
        let line = data.lineList[i]
        if (line.from === from && line.to === to) {
            return true
        }
    }
    return false
}

// 是否含有相反的线
export function hasOppositeLine(data, from, to) {
    return hasLine(data, to, from)
}

// 获取连线
export function getConnector(jsp, from, to) {
    let connection = jsp.getConnections({
        source: from,
        target: to
    })[0]
    return connection
}

// 获取唯一标识
export function uuid() {
    return Math.random().toString(36).substr(3, 10)
}
