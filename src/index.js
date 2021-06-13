import './styles/index.scss';
import './assets/fonts/Roboto-Regular.ttf';
import './component.js';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

var canvas = document.getElementById("babylon");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};
var createScene = function() {
  let scene = new BABYLON.Scene(engine);
  let camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-10.775411736218903,  -3.2971441037527995,130.06636375218753), scene);
  camera.rotation.set( 0.39678897402998636,1.09099821817894,0 );
  camera.attachControl(canvas, true);
  let light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  // Our built-in 'sphere' shape.
const pinHeight = 0.4;
const pinDiameter = 0.07;
let names = ["build_1.glb","build_2.glb","build_3.glb","build_4.glb","build_5.glb","build_6.glb","build_7.glb","build_8.glb","build_9.glb"]
let nameNum=0;
printCoords();
function printCoords(){
  BABYLON.SceneLoader.AppendAsync("", names[nameNum],scene).then(()=>{
    console.log("[");

    scene.meshes.forEach((item, i) => {
      if(item.name.search("build")>-1){
        item.visibility=.5;
        let pin = BABYLON.MeshBuilder.CreateBox("pin", {width: pinDiameter, height:pinHeight,depth:pinDiameter}, scene);
        pin.position = new BABYLON.Vector3(-item.position.x,item.position.y,item.position.z);
        let angle = item.rotationQuaternion.toEulerAngles();
        pin.rotation.set(-angle.x,-angle.y,-angle.z);
        console.log("{pos:["+parseFloat(pin.position.x.toFixed(3))+","+parseFloat(pin.position.y.toFixed(3))+","+parseFloat(pin.position.z.toFixed(3))+"],rot:["+parseFloat(pin.rotation.x.toFixed(3))+","+parseFloat(pin.rotation.y.toFixed(3))+","+parseFloat(pin.rotation.z.toFixed(3))+"]},");
      }
      if(i == (scene.meshes.length/2)-1 && nameNum < names.length-1){
        let i = scene.meshes.length-1;
        console.log("],");
        nameNum++;
        do{
          scene.meshes[i].dispose();
          if(i==0){
            printCoords();
            return;
          }
          i--;
        }while (i >= 0);
      }
    });
  })
}


  return scene;
};

var asyncEngineCreation = async function() {
  console.log(createDefaultEngine())
  try {
    return createDefaultEngine();
  } catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    return createDefaultEngine();
  }
}
window.initFunction = async function() {

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  scene = createScene();
  window.scene = scene;
};
window.initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});
