import {Spring} from './spring';
import {Node} from './node';
import { Vector3 } from 'three';

export class Cloth{
    private gravity = new Vector3(0, -1, 0);
    private springs: Spring[];
    private nodeList: Node[];

    constructor(){
        this.springs = [];
        this.nodeList = [];
    }

    resetAcceleration(){
        for(let i of this.nodeList){
            i.setAcceleration(this.gravity);
        }
    }

    getSprings(){
        return this.springs;
    }

    setSprings(spring: Spring[]){
        this.springs = spring;
    }
}