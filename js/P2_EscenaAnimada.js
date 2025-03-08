/**
 * EscenaAnimada.js
 * 
 * Practica AGM #2. Escena basica con interfaz y animacion
 * Se trata de añadir un interfaz de usuario que permita 
 * disparar animaciones sobre los objetos de la escena con Tween
 * 
 * @author 
 * 
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";
import {OrbitControls} from "../lib/OrbitControls.module.js";
import {TWEEN} from "../lib/tween.module.min.js";
import {GUI} from "../lib/lil-gui.module.min.js";

// Variables estandar
let renderer, scene, camera;

// Otras globales
let cameraControls, effectController, pentagonoGroup, modeloImportado;
let geometries = [], meshes = [];
let angulo = 0;
let material, suelo, material2;

// Acciones
init();
loadScene();
loadGUI();
render();

function init()
{
    // Motor de render
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
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

    cameraControls = new OrbitControls( camera, renderer.domElement );
    cameraControls.target.set( 0, 0, 0 );
    cameraControls.enableDamping = true;
    cameraControls.dampingFactor = 0.05;
    cameraControls.screenSpacePanning = false;
    cameraControls.minDistance = 1;
    cameraControls.maxDistance = 20;

    window.addEventListener('resize', updateAspectRatio );
}

function loadScene()
{
    material = new THREE.MeshBasicMaterial( {wireframe:false} );
    material2 = new THREE.MeshPhongMaterial( {wireframe:false, color:"#4a5560"} );
    
    /*******************
    * TO DO: Construir un suelo en el plano XZ
    *******************/
    suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10,10), material);
    suelo.rotation.x = -Math.PI / 2;
    scene.add(suelo);

    /*******************
    * TO DO: Construir una escena con 5 figuras diferentes posicionadas
    * en los cinco vertices de un pentagono regular alredor del origen
    *******************/
    geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.5, 20, 20),
        new THREE.ConeGeometry(0.5, 1, 20),
        new THREE.TorusGeometry(0.5, 0.2, 16, 100),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 20)
    ];

    // Grupo para el pentágono
    pentagonoGroup = new THREE.Object3D();

    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(geometries[i], material2);
        const angle = (i * 2 * Math.PI) / 5;
        mesh.position.set(Math.cos(angle) * 3, 1, Math.sin(angle) * 3);
        pentagonoGroup.add(mesh);
        meshes.push(mesh);
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

}

function loadGUI()
{
    // Interfaz de usuario
    /*******************
    * TO DO: Crear la interfaz de usuario con la libreria lil-gui.js
    * - Funcion de disparo de animaciones. Las animaciones deben ir
    *   encadenadas
    * - Slider de control de radio del pentagono
    * - Checkbox para alambrico/solido
    *******************/
   // Definicion de los controles
    effectController = {
        mensaje: 'Eres el puto amo',
        disparo: 0.0,
        radio: 3,
        wireframe: false,
        animar: animarPentagono,
        colorsuelo: "rgb(255, 0, 0)"
    };
   
    // Creacion interfaz
    const gui = new GUI();
   
    // Construccion del menu
    gui.add(effectController, 'radio', 1, 5, 0.1).name('Radio Pentágono').onChange(updatePentagono);
    gui.add(effectController, 'wireframe').name('Modo Alambrico').onChange(() => {
        material.wireframe = effectController.wireframe;
    });
    gui.add(effectController, 'animar').name('Animar').onChange(animarPentagono);

    const h = gui.addFolder("Controller PRO");
    h.add(effectController, "mensaje").name("¿Quien eres?");
    h.addColor(effectController, "colorsuelo").name("Color alambres");
   
}

function updatePentagono()
{
    pentagonoGroup.clear();
    meshes = [];
    
    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(geometries[i], material2);
        const angle = (i * 2 * Math.PI) / 5;
        mesh.position.set(Math.cos(angle) * effectController.radio, 1, Math.sin(angle) * effectController.radio);
        pentagonoGroup.add(mesh);
        meshes.push(mesh);
    }
}

function animarPentagono()
{
    meshes.forEach((mesh, index) => {
        new TWEEN.Tween(mesh.position)
            .to({ y: 3 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out)
            .chain(
                new TWEEN.Tween(mesh.position)
                    .to({ y: 1 }, 1000)
                    .easing(TWEEN.Easing.Bounce.Out)
            )
            .start();
    });
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
    TWEEN.update();
    angulo += 0.01;
    pentagonoGroup.rotation.y = angulo;
    if (modeloImportado) {
        modeloImportado.rotation.y = -angulo;
    }
    suelo.material.color.set(effectController.colorsuelo);
}

function render(delta)
{
    requestAnimationFrame( render );
    update(delta);
    renderer.render( scene, camera );
}