import {Node} from './node';
import * as THREE from 'three';
import { Vector3 } from 'three';

export class Spring{
    private nodes: Node[];

    //Forces
    private restLen: number;
    private k: number; // Spring constant
    private kv: number //Dampening constant

    public line: THREE.Mesh;

    constructor(connection1: Node, connection2: Node){
        if(connection1 == null || connection2 == null){
            throw 'Spring must have valid connections!';
        }
        this.nodes = [connection1, connection2];
        this.restLen = 1;
        this.k = 1;
        this.kv = 10;
        const points = [];
        points.push(this.nodes[0].getPosition(), this.nodes[1].getPosition());
        const linemat = new THREE.LineBasicMaterial();
        const geo = new THREE.BufferGeometry().setFromPoints(points);
	   
        
    
        const material = new THREE.MeshBasicMaterial( { color: 0xfffffff } );
        const mesh = new THREE.Mesh( geo, linemat );
        this.line = mesh;
        console.log(this.line);
        mesh.geometry.attributes.position.needsUpdate = true;
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
        const vertices = new Float32Array( [
            node1.x, node1.y,  node1.z,
             node2.x, node2.y,  node2.z,
        ] );

        this.line.geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    }

    getNodes(){
        return this.nodes;
    }

    setNodes(nodes: Node[]){
        this.nodes = nodes;
    }

    
}