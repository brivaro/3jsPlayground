/**
 * EscenaIluminada.js
 * 
 * Practica AGM #3. Escena basica con interfaz, animacion e iluminacion
 * Se trata de añadir luces a la escena y diferentes materiales
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

// Variables de consenso
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
    // Instanciar el motor de render
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth,window.innerHeight);
        document.getElementById('container').appendChild( renderer.domElement );
        renderer.antialias = true;
        renderer.shadowMap.enabled = true;
    
        // Instanciar el nodo raiz de la escena
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0.5,0.5,0.5);
    
        // Instanciar la camara
        camera= new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,100);
        camera.position.set(0.5,2,7);
        camera.lookAt(0,1,0);
        cameraControls = new OrbitControls( camera, renderer.domElement );
        cameraControls.target.set( 0, 0, 0 );
        cameraControls.enableDamping = true;
        cameraControls.dampingFactor = 0.05;
        cameraControls.screenSpacePanning = false;
        cameraControls.minDistance = 1;
        cameraControls.maxDistance = 20;
    
        window.addEventListener('resize', updateAspectRatio );
    
        // Luces
    /*******************
     * TO DO: Añadir luces y habilitar sombras
     * - Una ambiental
     * - Una direccional
     * - Una focal
     *******************/
        const ambiental = new THREE.AmbientLight(0x222222);
        scene.add(ambiental);

        const direccional = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        direccional.position.set(-1, 1, -1);
        direccional.castShadow = true;
        scene.add(direccional);

        const puntual = new THREE.PointLight(0xFFFFFF, 0.5);
        puntual.position.set(2, 7, -4);
        scene.add(puntual);

        const focal = new THREE.SpotLight(0xFFFFFF, 0.3);
        focal.position.set(-2, 7, 4);
        focal.target.position.set(0, 0, 0);
        focal.angle = Math.PI / 7;
        focal.penumbra = 0.3;
        focal.castShadow = true;
        focal.shadow.camera.far = 20;
        focal.shadow.camera.fov = 80;
        scene.add(focal);
        scene.add(new THREE.CameraHelper(focal.shadow.camera));
}

function loadScene()
{

   // --------------------------------------------------
    // Texturas
    // --------------------------------------------------
    // TO DO: Cargar texturas
    // - De superposición
    // - De entorno
    const textureLoader = new THREE.TextureLoader();

    // Textura de entorno (skybox / cubemap)
    const path ="./images/";
    const format = ".jpg";

    // Ejemplo de textura de superposición (overlay)
    const overlayTexture = textureLoader.load(path+"r_256"+format);
    
    const envMap = new THREE.CubeTextureLoader().setPath(path).load([
      'posx' + format, 'negx' + format,
      'posy' + format, 'negy' + format,
      'posz' + format, 'negz' + format
    ]);
    // Asignamos el cubemap como fondo de la escena
    scene.background = envMap;

    // --------------------------------------------------
    // Materiales
    // --------------------------------------------------
    // TO DO: Crear materiales y aplicar texturas
    // - Uno basado en Lambert
    // - Uno basado en Phong
    // - Uno basado en Basic

    // Lambert: reacciona a la luz de forma difusa
    const matLambert = new THREE.MeshLambertMaterial({
      map: overlayTexture,
      color: 0xffffff
    });

    // Phong: permite brillo especular y más configuración
    const matPhong = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      shininess: 80
    });

    // Basic: sin influencia de luces
    const matBasic = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });

    // --------------------------------------------------
    // Para tu ejemplo, mantengo material y material2:
    // material = Basic, material2 = Phong, por ejemplo
    // (puedes cambiarlos según prefieras)
    material = matBasic;
    material2 = new THREE.MeshPhongMaterial({ wireframe: false, color: "#4a5560", shininess: 50 });

    // --------------------------------------------------
    // Misma escena que en la practica anterior
    // cambiando los materiales y activando las sombras
    // --------------------------------------------------
    // Cada Mesh debe tener castShadow = true y receiveShadow = true
    // para que se vean las sombras

    // --------------------------------------------------
    // Crear una habitacion de entorno
    // --------------------------------------------------
    // TO DO: Crear una habitación (caja invertida)
    //const habitacionGeo = new THREE.BoxGeometry(20, 20, 20);
    //const habitacionMat = new THREE.MeshPhongMaterial({
    //  color: 0xffffff,
    //  side: THREE.BackSide
    //});
    //const habitacion = new THREE.Mesh(habitacionGeo, habitacionMat);
    //habitacion.receiveShadow = true;
    //scene.add(habitacion);

    // --------------------------------------------------
    // Asociar una textura de vídeo al suelo
    // --------------------------------------------------
    // TO DO: Reemplazamos el suelo por un plane con video
    const video = document.createElement("video");
    video.src = "videos/Pixar.mp4";  // Ajusta la ruta a tu archivo de video
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    const floorMaterial = new THREE.MeshLambertMaterial({ map: videoTexture });

    suelo = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 10, 10), floorMaterial);
    suelo.rotation.x = -Math.PI / 2;
    suelo.receiveShadow = true;
    scene.add(suelo);

    // --------------------------------------------------
    // Grupo Pentágono (5 figuras)
    // --------------------------------------------------
    geometries = [
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.SphereGeometry(0.5, 20, 20),
      new THREE.ConeGeometry(0.5, 1, 20),
      new THREE.TorusGeometry(0.5, 0.2, 16, 100),
      new THREE.CylinderGeometry(0.5, 0.5, 1, 20)
    ];

    pentagonoGroup = new THREE.Object3D();
    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(geometries[i], material2);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const angle = (i * 2 * Math.PI) / 5;
        mesh.position.set(Math.cos(angle) * 3, 1, Math.sin(angle) * 3);
        pentagonoGroup.add(mesh);
        meshes.push(mesh);
    }
    scene.add(pentagonoGroup);

    // --------------------------------------------------
    // Modelo importado (centro del pentágono)
    // --------------------------------------------------
    const loader = new GLTFLoader();
    loader.load('models/robota/scene.gltf', function (gltf) {
        modeloImportado = gltf.scene;
        modeloImportado.position.set(0, 0, 0);
        modeloImportado.scale.set(0.5, 0.5, 0.5);

        // Activamos sombras en el modelo
        modeloImportado.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

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
    * - Checkbox de sombras
    * - Selector de color para cambio de algun material
    * - Boton de play/pause y checkbox de mute
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

