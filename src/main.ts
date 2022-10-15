
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
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

const renderer = new THREE.WebGLRenderer( { antialias: true } );
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

const cloth = new Cloth();

//Render Loop
function animation( time: number ) {
  cloth.resetAcceleration();
	renderer.render( scene, camera );
}

//CREATE THE CLOTH:
const nodeList: Node[] = [];

for(let i = 0; i < 5; i++){
  const node = new Node(0, -i/5, 0);
  nodeList.push(node);
}

const nodeMaterial = new THREE.MeshNormalMaterial();
const nodeGeo = new THREE.SphereGeometry(.1);

for(let i of nodeList){
  const mesh = new THREE.Mesh(nodeGeo, nodeMaterial);
  mesh.position.set(i.getPosition().x, i.getPosition().y, i.getPosition().z);
  
  scene.add(mesh);
}