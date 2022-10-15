import * as THREE from 'three';

export class Node {
    private position: THREE.Vector3; 
    private acceleration: THREE.Vector3;

    constructor(x:number, y:number, z:number){
        this.position = new THREE.Vector3(x,y,z);
        this.acceleration = new THREE.Vector3(0,0,0);
    }
    
    setAcceleration(acc: THREE.Vector3){
        this.acceleration = acc;
        return;
    }

    getAcceleration(){
        return this.acceleration;
    }

    setPosition(pos: THREE.Vector3){
        this.position = pos;
    }

    getPosition(){
        return this.position;
    }
}