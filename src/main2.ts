
import * as THREE from 'three';
import { Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './style.css';


//SCENE STUFF STARTS HERE:
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true} );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();

//Resize Handler
window.addEventListener('resize', function()
	{
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.setSize( width, height );
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	} );


let accelerations: THREE.Vector3[] = [];
let velocities: THREE.Vector3[] = [];
const gravity = new THREE.Vector3(0, -10, 0);
const k = 10; 
const kv = 10;
const restLen = 1;
const mass = 1; 
const fric = .1;

//Fun stuff starts here.
const nodes: THREE.Mesh[] = [];

const mat = new THREE.MeshBasicMaterial({color: 0x00ff00});
const geo = new THREE.SphereGeometry(.05);

for(let i = 0; i < 5; i++){
    const mesh = new THREE.Mesh(geo, mat);
    nodes.push(mesh);
    mesh.position.y = -i*.2;
    mesh.position.z = i*.2;
    scene.add(mesh);
}

for(let i in nodes){
    velocities.push(new Vector3(0,0,0));
}

//Render Loop
function animation( time: number ) {
    const dt = clock.getDelta();
    //Reset Acceleration
    for(let i = 0; i < nodes.length; i++){
        accelerations[i] = new Vector3(0,0,0);
        accelerations[i].add(gravity);
    }

    //Calculate Hooke's Law
    for(let i = 0; i < nodes.length -1; i++){
        const diff = new Vector3();
        diff.subVectors(nodes[i].position, nodes[i+1].position);
        const springf = -k * (diff.length() - restLen);

        const springDir = new Vector3();
        springDir.copy(diff);
        springDir.normalize();

        const projVbot = velocities[i].dot(springDir);
        const projVtop = velocities[i+1].dot(springDir);

        const dampf = -kv*(projVtop - projVbot);

        const force = new Vector3();
        force.copy(springDir);
        force.multiplyScalar(springf + dampf);
        
        const acc1 = new Vector3();
        acc1.copy(force);
        acc1.multiplyScalar(-1/mass);
        accelerations[i].add(acc1);

        const acc2 = new Vector3();
        acc2.copy(force);
        acc2.multiplyScalar(-1/mass);
        accelerations[i + 1].add(acc2);
    }

    //Euler Integration
    
    for(let i = 1; i < nodes.length; i++){
        
        const friction = new THREE.Vector3();
        friction.copy(velocities[i]);
        accelerations[i].add(friction.multiplyScalar(-fric))
        velocities[i].add(accelerations[i].multiplyScalar(dt));
        nodes[i].position.add(velocities[i].multiplyScalar(dt));
    }
    // console.log(accelerations )
  renderer.render( scene, camera );
}







const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.DoubleSide, wireframe: true} );
const mesh = new THREE.Mesh( geometry, material );

scene.add(mesh)