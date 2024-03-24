// import * as SPLAT from 'https://cdn.jsdelivr.net/npm/gsplat@latest';
// import 'https://cdn.jsdelivr.net/npm/gsplat/+esm';
// import 'https://cdn.jsdelivr.net/npm/gsplat@1.2.0/dist/index.js';
// import 'https://cdn.jsdelivr.net/npm/gsplat@latest';

import * as SPLAT from "gsplat";
import {Quaternion} from "gsplat";

const DEG2RAD = Math.PI / 180;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

async function main() {
    const url = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2.splat";
    await SPLAT.Loader.LoadAsync(url, scene, (progress) => (progressIndicator.value = progress * 100));
    progressDialog.close();

    const handleResize = () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);
        camera.position = new SPLAT.Vector3(-1.13, -0.3, -5.5); // + to right, height, deep from door
        camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(-0.2397, 0.23971, 15.0612), DEG2RAD * 15); // rig-but, up, right, top-rig
    };

    const frame = () => {
        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(frame);
    };

    const onKeyDown = (event: KeyboardEvent) => {
        // Use i, j, k, l to move the camera around
        let translation = new SPLAT.Vector3();
        if (event.key === "j") {
            translation = translation.add(new SPLAT.Vector3(-1, 0, 0));
        }
        if (event.key === "l") {
            translation = translation.add(new SPLAT.Vector3(1, 0, 0));
        }
        if (event.key === "i") {
            translation = translation.add(new SPLAT.Vector3(0, 0, 1));
        }
        if (event.key === "k") {
            translation = translation.add(new SPLAT.Vector3(0, 0, -1));
        }
        if (event.key === "m") { // decrease the height
            translation = translation.add(new SPLAT.Vector3(0, 1, 0));
        }
        camera.position = camera.position.add(translation);

        // Use u to set a random look target near the origin
        if (event.key === "u") {
            // const target = new SPLAT.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            const target = new SPLAT.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5); // random (x,y)
            controls.setCameraTarget(target);
        }

        // Use space to reset the camera
        if (event.key === " ") {
            camera.position = new SPLAT.Vector3();
            camera.rotation = new SPLAT.Quaternion();
        }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(frame);
}

main();

