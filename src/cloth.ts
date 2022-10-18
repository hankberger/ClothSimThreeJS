import {Spring} from './spring';
import {Node} from './node';
import * as THREE from 'three';
import { Vector3 } from 'three';

export class Cloth{
    private gravity = new THREE.Vector3(0, -1, 0);
    private springs: Spring[];
    private nodeList: Node[];

    constructor(){
        this.springs = [];
        this.nodeList = [];
    }

    updateSpringPosition(){
        for(let i of this.springs){
            i.updateSpringPosition();
        }
    }

    resetAcceleration(){
        for(let i of this.nodeList){
            i.setAcceleration(this.gravity);
        }
    }

    calculateSpringForce(){
        for(let i of this.springs){
            i.calculateForce();
        }
    }

    move(dt: number){
        for(let i = 0; i < this.nodeList.length; i++){
            if(i != 0){
                this.nodeList[i].move(dt);
            }
        }
    }

    createNodes(){
        for(let i = 0; i < 5; i++){
            const node = new Node(i*.1, -i/5, 0);
            node.obj.position.set(node.getPosition().x, node.getPosition().y, node.getPosition().z);
            this.nodeList.push(node);
        }
        return;
    }

    createSprings(){
        for(let i = 0; i < this.nodeList.length - 1; i++){
            const spring = new Spring(this.nodeList[i], this.nodeList[i+1]);
            this.springs.push(spring);
        }
    }

    getNodes(){
        return this.nodeList;
    }

    getSprings(){
        return this.springs;
    }

    setSprings(spring: Spring[]){
        this.springs = spring;
    }
}