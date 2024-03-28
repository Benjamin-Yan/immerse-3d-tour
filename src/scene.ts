import * as SPLAT from "gsplat";
import {Quaternion} from "gsplat";

const DEG2RAD = Math.PI / 180;

const canvas = document.getElementsByClassName("canvas")[0] as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

const url0 = "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat";
const url1 = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.splat";
const url2 = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2_1_50000.splat";
const url3 = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Arts_exhibition_A103_03_21_6_local_1_50000.splat";

// import { Engine } from "./Engine";
// const engine = new Engine(canvas);

// async function main() {
//     let url = url0;
//     if (canvas.id === "scene1") url = url1;
//     else if (canvas.id === "scene2") url = url2;
//     else if (canvas.id === "scene3") url = url3;
//     await SPLAT.Loader.LoadAsync(url, engine.scene, (progress) => (progressIndicator.value = progress * 100));
//     progressDialog.close();
//     engine.renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);

//     const handleResize = () => {
//         engine.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
//         // camera.position = new SPLAT.Vector3(-1.13, -0.3, -5.5); // + to right, height, deep from door
//         // camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(-0.2397, 0.23971, 15.0612), DEG2RAD * 15); // rig-but, up, right, top-rig
//     };

//     const frame = () => {
//         engine.update();
//         controls.update();
//         renderer.render(scene, camera);

//         requestAnimationFrame(frame);
//     };

//     const onKeyDown = (event: KeyboardEvent) => {
//         // Use i, j, k, l to move the camera around
//         let translation = new SPLAT.Vector3();
//         if (event.key === "a") {
//             translation = translation.add(new SPLAT.Vector3(-1, 0, 0));
//         }
//         if (event.key === "d") {
//             translation = translation.add(new SPLAT.Vector3(1, 0, 0));
//         }
//         if (event.key === "w") {
//             translation = translation.add(new SPLAT.Vector3(0, 0, 1));
//         }
//         if (event.key === "s") {
//             translation = translation.add(new SPLAT.Vector3(0, 0, -1));
//         }
//         if (event.key === "q") { // decrease the height
//             translation = translation.add(new SPLAT.Vector3(0, 1, 0));
//         }
//         if (event.key === "e") {
//             translation = translation.add(new SPLAT.Vector3(0, -1, 0));
//         }
//         camera.position = camera.position.add(translation);

//         // Use u to set a random look target near the origin
//         if (event.key === "u") {
//             // const target = new SPLAT.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
//             // const target = new SPLAT.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5); // random (x,y)
//             const camview: [number, number, number][] = [
//                 [-1, 0, 0],
//                 [3, 0, 0],
//                 [7, 0, 0],
//                 [11, 0, 0]
//             ];
//             const randidx = Math.floor(Math.random() * camview.length);
//             const target = new SPLAT.Vector3(camview[randidx][0], camview[randidx][1], camview[randidx][2]);
//             controls.setCameraTarget(target);
//         }

//         // Use space to reset the camera to (0,0,0)
//         if (event.key === " ") {
//             camera.position = new SPLAT.Vector3();
//             camera.rotation = new SPLAT.Quaternion();
//         }
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     window.addEventListener("keydown", onKeyDown);

//     requestAnimationFrame(frame);
// }

// main();
////////////////////
async function main() {
    let url = url0;
    if (canvas.id === "scene1") url = url1;
    else if (canvas.id === "scene2") url = url2;
    else if (canvas.id === "scene3") url = url3;
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
        if (event.key === "a") {
            translation = translation.add(new SPLAT.Vector3(-1, 0, 0));
        }
        if (event.key === "d") {
            translation = translation.add(new SPLAT.Vector3(1, 0, 0));
        }
        if (event.key === "w") {
            translation = translation.add(new SPLAT.Vector3(0, 0, 1));
        }
        if (event.key === "s") {
            translation = translation.add(new SPLAT.Vector3(0, 0, -1));
        }
        if (event.key === "q") { // decrease the height
            translation = translation.add(new SPLAT.Vector3(0, 1, 0));
        }
        if (event.key === "e") {
            translation = translation.add(new SPLAT.Vector3(0, -1, 0));
        }
        camera.position = camera.position.add(translation);

        // Use u to set a random look target near the origin
        if (event.key === "u") {
            // const target = new SPLAT.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            // const target = new SPLAT.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5); // random (x,y)
            const camview: [number, number, number][] = [
                [-1, 0, 0],
                [3, 0, 0],
                [7, 0, 0],
                [11, 0, 0]
            ];
            const randidx = Math.floor(Math.random() * camview.length);
            const target = new SPLAT.Vector3(camview[randidx][0], camview[randidx][1], camview[randidx][2]);
            controls.setCameraTarget(target);
        }

        // Use space to reset the camera to (0,0,0)
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

