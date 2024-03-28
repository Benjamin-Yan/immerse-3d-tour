import * as SPLAT from "gsplat";
import { OrbitControls } from "./OrbitControls";
import { GridProgram } from "./GridProgram";
import { AxisProgram } from "./AxisProgram";

class Engine {
    private _scene: SPLAT.Scene;
    private _camera: SPLAT.Camera;
    private _renderer: SPLAT.WebGLRenderer;
    private _orbitControls: OrbitControls;
    private _intersectionTester: SPLAT.IntersectionTester;

    constructor(canvas: HTMLCanvasElement) {
        this._scene = new SPLAT.Scene();
        this._camera = new SPLAT.Camera();
        this._camera.data.setSize(canvas.clientWidth, canvas.clientHeight);

        this._renderer = new SPLAT.WebGLRenderer(canvas);
        this._renderer.addProgram(new AxisProgram(this._renderer, []));
        this._renderer.addProgram(new GridProgram(this._renderer, []));
        this._orbitControls = new OrbitControls(this._camera, canvas);
        this._intersectionTester = new SPLAT.IntersectionTester(this._renderer.renderProgram);
    }

    update() {
        this._orbitControls.update();
        this._renderer.render(this._scene, this._camera);
    }

    get scene(): SPLAT.Scene {
        return this._scene;
    }

    get camera(): SPLAT.Camera {
        return this._camera;
    }

    get renderer(): SPLAT.WebGLRenderer {
        return this._renderer;
    }

    get orbitControls(): OrbitControls {
        return this._orbitControls;
    }

    get intersectionTester(): SPLAT.IntersectionTester {
        return this._intersectionTester;
    }

}

export { Engine };
