/*
 * @Description: 
 * @Version: 2.0
 * @Autor: Trent
 * @Date: 2024-01-16 14:05:35
 * @LastEditors: Trent
 * @LastEditTime: 2024-01-17 10:00:59
 */
let dataA = {
    name: '流程A',
    nodeList: [
        {
            id: 'nodeA',
            name: '流程A-节点A',
            type: 'task',
            left: '26px',
            top: '161px',
            ico: 'Solid'
        },
        {
            id: 'nodeB',
            name: '流程A-节点B',
            type: 'task',
            left: '340px',
            top: '161px',
            ico: 'Goods'
        },
        {
            id: 'nodeC',
            name: '流程A-节点C',
            type: 'task',
            left: '739px',
            top: '161px',
            ico: 'Present'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB'
    }, {
        from: 'nodeB',
        to: 'nodeC'
    }]
}

export function getDataA () {
    return dataA
}
