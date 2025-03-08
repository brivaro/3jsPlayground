/**
 * Escena.js
 * 
 * Practica AGM #1. Escena basica en three.js
 * Seis objetos organizados en un grafo de escena con
 * transformaciones, animacion basica y modelos importados
 * 
 * @author 
 * 
 */

/*******************
 * TO DO: Cargar los modulos necesarios
 *******************/
import { GLTFLoader } from "../lib/GLTFLoader.module.js";

// Variables de consenso
let renderer, scene, camera;
var cameraControls;

// Otras globales
/*******************
 * TO DO: Variables globales de la aplicacion
 *******************/
let pentagonoGroup, modeloImportado;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function init() {
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    /*******************
    * TO DO: Completar el motor de render y el canvas
    *******************/
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0xFFFFFF) );
    document.getElementById('container').appendChild(renderer.domElement);

    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);
    
    // Camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(new THREE.Vector3(0, 1, 0));

    cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.05;
    cameraControls.screenSpacePanning = false;
    cameraControls.minDistance = 1;
    cameraControls.maxDistance = 20;

    window.addEventListener('resize', updateAspectRatio );
}

function loadScene() {
    const material = new THREE.MeshNormalMaterial();

    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    const suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10,10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.5, 20, 20),
        new THREE.ConeGeometry(0.5, 1, 20),
        new THREE.TorusGeometry(0.5, 0.2, 16, 100),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 20)
    ];

    // Grupo para el pentágono
    pentagonoGroup = new THREE.Group();

    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(geometries[i], material);
        const angle = (i * 2 * Math.PI) / 5;
        mesh.position.set(Math.cos(angle) * 3, 1, Math.sin(angle) * 3);
        pentagonoGroup.add(mesh);
    }

    scene.add(pentagonoGroup);

    /*******************
    * TO DO: Añadir a la escena un modelo importado en el centro del pentagono
    *******************/
    const loader = new GLTFLoader();
    loader.load('models/robota/scene.gltf', function (gltf) {
        modeloImportado = gltf.scene;
        modeloImportado.position.set(0, 0, 0);
        modeloImportado.scale.set(0.5, 0.5, 0.5);
        scene.add(modeloImportado);
    });

    /*******************
    * TO DO: Añadir a la escena unos ejes
    *******************/
    scene.add(new THREE.AxesHelper(3));
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
    // Cambios para actualizar la camara segun mvto del raton
    cameraControls.update();
    angulo += 0.01;
    pentagonoGroup.rotation.y = angulo;
    if (modeloImportado) {
        modeloImportado.rotation.y = -angulo;
    }
}

function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
