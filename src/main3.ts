
import * as THREE from 'three';
import { LineSegments, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';


//SCENE STUFF STARTS HERE:
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
camera.position.z = 1;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( render );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

//Resize Handler
window.addEventListener('resize', function()
	{
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	} );


const clock = new THREE.Clock();
function render(){
    const dt = clock.getDelta();
    for(let i = 0; i < 10; i++){
        update(dt/10);
    }
    
    renderer.render(scene, camera);
}

const geometry = new THREE.SphereGeometry( .5, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
const sphere = new THREE.Mesh( geometry, material );
sphere.position.set(-1, -2, 0);
scene.add( sphere );

let sphereForce = new Vector3();

document.addEventListener('keydown', (e)=>{
    if(sphereForce.length() <= .75){
        if(e.key == 'd'){
            sphereForce.add(new Vector3(.1,0, 0))
        } else if(e.key == 'a'){
            sphereForce.add(new Vector3(-.1,0, 0))
        } else if(e.key == 'w'){
            sphereForce.add(new Vector3(0, 0, .1))
        } else if(e.key == 's'){
            sphereForce.add(new Vector3(0, 0, -.1))
        } else if(e.key == ' '){
            sphereForce.add(new Vector3(0, .1, 0))
        } else if(e.shiftKey){
            sphereForce.add(new Vector3(0, -.1, 0))
        }
    } else {
        sphereForce.normalize();
        sphereForce.multiplyScalar(.75);
    }
    
});

const nodes: THREE.Mesh[] = [];
const springs: THREE.Line[] = [];
const positions: THREE.Vector3[] = [];
const velocities: THREE.Vector3[] = [];
const accelerations: THREE.Vector3[] = [];
const numNodes = 25;
const numRopes = 5;

//Parameters
const grav = new Vector3(0,-2, 0);
const restlen = .5;
const mass = 1;
const k = 20; 
const kv = 1;
const friction = .1;

function update(dt: number){
    //Reset accelerations
    for(let i = 0; i < nodes.length; i++){
        accelerations[i] = new Vector3();
        accelerations[i].add(grav);
    }
    
    //Calculate Spring Forces
    let skip = 1;
    for(let i = 0; i < numNodes - 1; i++){
        if(skip % 5 == 0) {
            skip++
            continue;
        }
        const diff = new Vector3();
        diff.subVectors(nodes[i+1].position, nodes[i].position);
        
        const stringf = -k*(diff.length() - restlen);
        const stringDir = new Vector3();
        stringDir.copy(diff);
        stringDir.normalize();

        const projVbot = velocities[i].dot(stringDir);
        const projVtop = velocities[i + 1].dot(stringDir);
        
        const dampf = -kv*(projVtop - projVbot);

        const force = new Vector3();
        force.copy(stringDir);
        force.multiplyScalar(stringf+dampf);
        const thisForce = new Vector3();
        thisForce.copy(force);
        thisForce.multiplyScalar(-1/mass);

        const nextForce = new Vector3();
        nextForce.copy(force);
        nextForce.multiplyScalar(1/mass);
        
        accelerations[i].add(thisForce);
        accelerations[i+1].add(nextForce);
        skip++;
    }

    for(let i = 0; i < nodes.length; i++){
        if(i%5 == 0){
            continue;
        }
        const fricForce = new Vector3();
        fricForce.copy(velocities[i]);
        fricForce.multiplyScalar(-1*friction);
        accelerations[i].add(fricForce);
        
        const accForce = new Vector3();
        accForce.copy(accelerations[i]);
        accForce.multiplyScalar(dt);
        velocities[i].add(accForce);

        const posChange = new Vector3();
        posChange.copy(velocities[i]);
        posChange.multiplyScalar(dt);
        positions[i].add(posChange);
    }

    for(let i = 0; i < nodes.length; i++){
        const collision = new Vector3();
        collision.copy(sphere.position);
        collision.sub(nodes[i].position);

        const dir = new Vector3();
        dir.copy(collision);
        dir.multiplyScalar(.05);

        if(collision.length() < .58){
            velocities[i].multiplyScalar(0);
            positions[i].sub(dir);
            console.log("COLLISION!")
        }
    }

    const sphereVel = new Vector3();
    sphereVel.copy(sphereForce);
    sphereVel.multiplyScalar(dt);
    sphere.position.add(sphereVel);
    updateNodes();
    drawLines();

}

function initScene(){
    const geometry = new THREE.SphereGeometry( .1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    
    for(let j = 0; j < numRopes; j++){
        for(let i = 0; i < 5; i++){
            const sphere = new THREE.Mesh( geometry, material );
            sphere.position.set(j*2, -i*.8, i*.1);
            positions.push(new Vector3(j*2,-i*.8,i*.2));
            velocities.push(new Vector3(0,0,0));
            accelerations.push(new Vector3(0,0,0));
            nodes.push(sphere);
            scene.add( sphere );
        }
    }
}

initScene();

function updateNodes(){
    for(let i = 0; i < nodes.length; i++){
        if(i % 5 != 0){
            const newPos = positions[i];
            nodes[i].position.set(newPos.x, newPos.y, newPos.z);
        }
        
    }
}

function drawLines(){
    for(let i = 0; i < springs.length; i++){
        scene.remove(springs[i]);
    }

    const material = new THREE.LineBasicMaterial({color: 0x0000ff});
    let skips = 1;
    for(let i = 0; i < nodes.length - 1; i++){
        const points = [];
        points.push(nodes[i].position);
        points.push(nodes[i+1].position);

        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const line = new THREE.Line( geometry, material );
        springs.push(line);
        if(i== 0 || skips % 5 != 0 ){
            scene.add( line );
        } 
        skips++
    }
}



