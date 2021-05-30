import * as THREE from "three";

export default class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera) {
    if (this.pickedObject) {
      this.pickedObject.material.color.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }

    this.raycaster.setFromCamera(normalizedPosition, camera);

    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      this.pickedObject = intersectedObjects[0].object;

      this.pickedObjectSavedColor =
        this.pickedObject.material.color.getHex();

      this.pickedObject.material.color.setHex(0xff0000);
    }
  }
}
