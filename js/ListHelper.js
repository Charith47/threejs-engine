import { v4 as uuidv4 } from 'uuid';

class Instance {
    constructor(objectRef, oid, name, visibility) {
        this.obj = objectRef
        this.oid = oid;
        this.name = name;
        this.isVisible = visibility;
    }
}


export default class ListHelper {
  constructor() {
    this.instanceList = new Array()
  }

  add(objectRef, objectName) {
    this.instanceList.push(new Instance(objectRef,uuidv4(),objectName,true));
  }

  toString(){
    this.instanceList.map((x)=>{console.log(x)})
  }
}
