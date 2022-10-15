import {Node} from './node';

export class Spring{
    private connections: number[][];
    private nodeList: Node[];

    constructor(){
        this.connections = [];
        this.nodeList = [];
    }

    getNodes(){
        return this.nodeList;
    }

    setNodes(nodes: Node[]){
        this.nodeList = nodes;
    }

    
}