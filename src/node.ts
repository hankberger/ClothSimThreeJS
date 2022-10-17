import * as THREE from 'three';

export class Node {
    public mass: number;
    private position: THREE.Vector3; 
    private acceleration: THREE.Vector3;
    public velocity: THREE.Vector3;
    public obj: THREE.Mesh;
    private fric: number;

    constructor(x:number, y:number, z:number){
        const nodeMaterial = new THREE.MeshNormalMaterial();
        const nodeGeo = new THREE.SphereGeometry(.01);
        this.mass = 1;
        this.position = new THREE.Vector3(x,y,z);
        this.acceleration = new THREE.Vector3(0,0,0);
        this.velocity = new THREE.Vector3(0,0,0);
        this.obj = new THREE.Mesh(nodeGeo, nodeMaterial);
        this.fric = .1;
    }

    move(dt: number){
        this.acceleration.add(this.velocity.multiplyScalar(-1 * this.fric));
        this.velocity.add(this.acceleration.multiplyScalar(dt));
        this.obj.position.add(this.velocity.multiplyScalar(dt));
        // this.obj.position.add(new THREE.Vector3(0,.01, 0));
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