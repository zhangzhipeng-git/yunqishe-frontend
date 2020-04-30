export class A{
    a: any;
    constructor() {
        this.a = 1;
    }
}

class B extends A {
    b: any
    constructor() {
        super();
        this.b = 2;
    }
}
console.log(JSON.stringify(new B()));