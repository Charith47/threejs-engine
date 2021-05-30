import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import ListHelper from "./ListHelper";

let _GLTFLoader = new GLTFLoader();
let _OBJLoader = new OBJLoader();
let _listHelper = new ListHelper();

export default class LoadHelper {
  constructor(event, scene) {
    this.scene = scene;
    this.fileList = event.target.files;
    this.file = this.fileList.item(0);
    this.fileDetails = this.file.name.split(".");
    this.fileType = this.fileDetails[this.fileDetails.length - 1];
    this.reader = new FileReader();
  }

  toString = () => {
    console.log(
      `File = ${this.file} \nFile Details = ${this.fileDetails} \nFile Type = .${this.fileType}`
    );
  };

  load() {
    this.reader.readAsArrayBuffer(this.file);
    this.reader.onload = () => {
      switch (this.fileType) {
        case "obj":
          this.loadOBJ(this.reader.result);
          break;
        case "gltf":
        case "glb":
          this.loadGLTF(this.reader.result);
          break;
      }
    };
    
  }

  loadGLTF() {
    this.reader.readAsArrayBuffer(this.file);
    this.reader.onload = () => {
        _listHelper.add(this.reader.result,this.file.name);
        _listHelper.toString();
      _GLTFLoader.parse(
        this.reader.result,
        "",
        (gltf) => {
            this.scene.add(gltf.scene)
        },
        (error) => {
          console.log(`Loader Failed, Error: ${error}`);
        }
      );
    };
  }

  loadOBJ() {
      this.reader.readAsText(this.file);
      this.reader.onload = () =>{
        _listHelper.add(this.reader.result,this.file.name);
        _listHelper.toString();
        this.scene.add(_OBJLoader.parse(this.reader.result));
      }
  }
}
