# 3jsPlayground

Bienvenido a **3jsPlayground**, un espacio experimental donde realizo pruebas y exploraciones con **Three.js**. Este proyecto incluye escenas interactivas con iluminación, animaciones, materiales y modelos 3D.

## 🚀 Características
- Escenas con luces ambientales, direccionales y focales.
- Modelos 3D importados mediante **GLTFLoader**.
- Materiales variados: **Lambert, Phong y Basic**.
- Interfaz gráfica con **lil-gui** para personalizar elementos.
- **OrbitControls** para navegación fluida en la escena.
- Suelo con textura de vídeo en tiempo real.

## 📂 Estructura del Proyecto
```
3jsPlayground/
│── lib/                   # Librerías externas (Three.js, loaders, controles, etc.)
│── models/                # Modelos 3D en formato GLTF
│── images/                # Texturas y cubemaps
│── videos/                # Videos para texturas dinámicas
│── js/                    # Código fuente
│   ├── EscenaIluminada.js # Script principal con luces y materiales
│── index.html             # Archivo base para ejecutar la escena
...
```

## 🎮 Controles y Personalización
La escena incluye una interfaz interactiva con **lil-gui**, donde puedes:
- Modificar el radio de la estructura en pentágono.
- Activar o desactivar el modo alambrico de los objetos.
- Controlar las animaciones del pentágono.
- Ajustar la iluminación y sombras en la escena.
- Cambiar colores de los materiales.

## 🔧 Instalación y Uso
1. Clona este repositorio:
   ```bash
   git clone https://github.com/brivaro/3jsPlayground.git
   ```
2. Abre `index.html` en tu navegador o usa un servidor local como **Live Server** en VSCode.

## 📌 Tecnologías Utilizadas
- [Three.js](https://threejs.org/) - Motor gráfico 3D.
- [GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader) - Para importar modelos 3D.
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls) - Para navegación en la escena.
- [lil-gui](https://lil-gui.georgealways.com/) - Interfaz gráfica interactiva.

## 🛠 Próximos Pasos
- Mejorar animaciones con **TWEEN.js**.
- Implementar física con **Cannon.js**.
- Optimización del rendimiento para escenas más complejas.

¡Explora, experimenta y diviértete con **Three.js** en **3jsPlayground**! 🚀


---


## Uso y alcance de este proyecto
### Este proyecto tiene exclusivamente fines docentes

El proyecto incluye material extraído del proyecto público [Three.js](http://threjs.org) *r140*, bibliotecas de utilidad del texto *"WebGL Programming Guide" de  Kouichi Matsuda y Rodger Lea* y código propio de *<rvivo@upv.es>*.  

Para más información sobre su uso y alcance consultar la [wiki](https://github.com/RobVivo/RobVivo.github.io/wiki/INSTRUCCIONES-B%C3%81SICAS)

Para comprobar el funcionamiento del navegador con WebGL
[cargue esta página](http://robvivo.github.io)
