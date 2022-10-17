
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {ParametricGeometry} from 'three/examples/jsm/geometries/ParametricGeometry.js';
import {Spring} from './spring';
import {Node} from './node';
import {Cloth} from './cloth';
import './style.css';


//SCENE STUFF STARTS HERE:
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
camera.position.z = 1;

const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true} );
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

//Render Loop
function animation( time: number ) {
  cloth.resetAcceleration();
  cloth.calculateSpringForce();
  cloth.move(clock.getDelta());
  renderer.render( scene, camera );
}

//CREATE THE CLOTH:
const cloth = new Cloth();
cloth.createNodes();
cloth.createSprings();

//Render Nodes

for(let i of cloth.getNodes()){
	console.log(i);
	scene.add(i.obj);
}

//Render Springs
const linemat = new THREE.LineBasicMaterial();
for(let i of cloth.getSprings()){
	console.log(i);
	const points = [];
	const nodes = i.getNodes();
	// console.log(nodes);
	points.push(nodes[0].getPosition());
	points.push(nodes[1].getPosition());

	const geo = new THREE.BufferGeometry().setFromPoints(points);
	const line = new THREE.Line(geo, linemat);
	scene.add(i.line);
}

//Try 2:
// const clothGeo = new ParametricGeometry();

// const clothMat = new THREE.MeshLambertMaterial({
// 	side: THREE.DoubleSide,
// 	wireframe: true,
// });

// const clothMesh = new THREE.Mesh(clothGeo, clothMat);
// scene.add(clothMesh)

// const light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

// //Subdivision:
// const nx = 10; 
// const ny = 10;
// const mass = 1;
// const clothSize = 1;
// const dist = clothSize / nx;

// const nodes = [];
// const accelerations = [];
// const velocity = [];



