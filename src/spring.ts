import {Node} from './node';
import * as THREE from 'three';
import { Vector3 } from 'three';

export class Spring{
    private nodes: Node[];

    //Forces
    private restLen: number;
    private k: number; // Spring constant
    private kv: number //Dampening constant

    public line: THREE.Line;
    private positions: ArrayLike<number>;

    constructor(connection1: Node, connection2: Node){
        if(connection1 == null || connection2 == null){
            throw 'Spring must have valid connections!';
        }
        this.nodes = [connection1, connection2];
        this.restLen = 1;
        this.k = 1;
        this.kv = 10;
        const points = [];
        points.push(this.nodes[0].getPosition());
        points.push(this.nodes[1].getPosition());
        console.log("points", points);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        
        var material = new THREE.LineBasicMaterial({ color: 0xff00ff });
        const mesh = new THREE.Line( geo, material);
        this.line = mesh;
        
        
        this.positions = this.line.geometry.attributes.position.array;
    }

    calculateForce(){
        const diff = new Vector3();
        diff.subVectors(this.nodes[0].getPosition(), this.nodes[1].getPosition());
        const springF = -this.k*(diff.length() - this.restLen);
        const springDir = diff.normalize();
        const projVbot = this.nodes[0].velocity.dot(springDir);
        const projVtop = this.nodes[1].velocity.dot(springDir);
        const dampF = -this.kv*(projVtop - projVbot);

        const force = springDir.multiplyScalar(springF + dampF);

        const calcAcc1 = new THREE.Vector3();
        const firstForce = new THREE.Vector3;
        firstForce.copy(force);
        firstForce.multiplyScalar(-1/this.nodes[0].mass)
        calcAcc1.addVectors(this.nodes[0].getAcceleration(), firstForce)
        this.nodes[0].setAcceleration(calcAcc1);

        const calcAcc2 = new THREE.Vector3();
        const secondForce = new THREE.Vector3;
        secondForce.copy(force);
        secondForce.multiplyScalar(-1/this.nodes[1].mass)
        calcAcc2.addVectors(this.nodes[1].getAcceleration(), secondForce)
        this.nodes[1].setAcceleration(calcAcc2);

        // this.nodes[0].setAcceleration(THREE.Vector3.addVectors(this.nodes[0].getAcceleration().add(force.multiplyScalar()));
        // this.nodes[1].setAcceleration(this.nodes[1].getAcceleration().add(force.multiplyScalar(1/this.nodes[1].mass)));
    }

    updateSpringPosition(){
        const node1 = this.nodes[0].getPosition();
        const node2 = this.nodes[1].getPosition();
        // const vertices = new Float32Array( [
        //     node1.x, node1.y,  node1.z,
        //      node2.x, node2.y,  node2.z,
        // ] );

        // console.log(this.line)
        // const pos1 = this.nodes[0].getPosition();
        // const pos2 = this.nodes[0].getPosition();
        // const newVertex = [pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z];

        // this.positions[0] = pos1.x;
        // this.line.geometry.attributes.position.array = newVertex;
        // this.line.geometry.attributes.position.needsUpdate = true;

        const points = [];
        points.push( new THREE.Vector3( node1.x, node1.y, node1.z ) );
        points.push( new THREE.Vector3( node2.x, node2.y, node2.z ) );

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        var material = new THREE.LineBasicMaterial({ color: 0xff00ff });
        const mesh = new THREE.Line( geometry, material);
        this.line = mesh;
    }

    getNodes(){
        return this.nodes;
    }

    setNodes(nodes: Node[]){
        this.nodes = nodes;
    }

    
}