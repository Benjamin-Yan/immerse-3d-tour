import * as SPLAT from "gsplat";
import {Quaternion} from "gsplat";
import { AxisProgram } from "./AxisProgram";
import { GridProgram } from "./GridProgram";

const DEG2RAD = Math.PI / 180; // pi/180 *theta = y (對應的弧度) -> 四元數中填上{角度*DEG2RAD}即可

const canvas = document.getElementsByClassName("canvas")[0] as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

const lviewBut = document.getElementById("lview") as HTMLSpanElement;
const sviewtxt = document.getElementById("sview") as HTMLSpanElement;
const rviewBut = document.getElementById("rview") as HTMLSpanElement;

const direpen = document.getElementById("stewhe") as HTMLDivElement;

const infoicon = document.getElementById("infoicon") as HTMLDivElement;

const renderer = new SPLAT.WebGLRenderer(canvas);
const scene = new SPLAT.Scene();
const camera = new SPLAT.Camera();
const controls = new SPLAT.OrbitControls(camera, canvas);

//////////////////// Initial scene by scene id ////////////////////
const splaturl: string[] = [
    "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Library_03_09_1.splat",
    "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.splat",
    "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2_1_50000.splat",
    "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Arts_exhibition_A103_03_21_6_local_1_50000.splat",
    "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/113_exhibition_C103_03_28_3_30000.splat"
]; // https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat, Library_05_04_1_30000.splat

let url = splaturl[+canvas.id.slice(-1)];

//////////////////// Define camera view of specific position. ////////////////////
/* 
 - [Position(x, y, z), Rotation(counterclockwise, clockwise)]
 - `1` for original rotation
 - `0` for don't change current direction
 - rotation use `from axis angle`: absolute 的旋轉，所以寫 90 一定會是朝向初始位置的右側。
*/
let posidx = -1;
let isFirstPos:boolean = true;

const camviewTuring: [number, number, number, number, number][] = [
    [-2.6422373, -0.0385681, -3.9284603, 90, 90],
    [1.0816124, -0.25, -4.4852240, 1, 360],
    [1.0816124, -0.25, 4.8699587, 180, 180],
    [1.0816124, -0.25, -0.9542135, 1, 0],
    [0.3800690, -0.25, 1.0457503, 1, 0],
    [-1.1190396, -0.25, 1.0457503, 1, 360],
    [1.9658702, -0.25, 4.0782768, -90, 0],
    [0.7610420, -0.25, -0.0008356, 0, 0],
    [1.6628045, -0.0085681, -3.3584766, 0, -90],
    [-1.4787547, -0.0385681, 0.2981167, 180, 0],
    [-0.002, -0.25, 4.8203525, 0, 180],
    [-0.002, -0.25, -5.5, 1, 360]
];
const camviewPoster: [number, number, number, number, number][] = [/////////////////////////////
    [1.9699041, -0.0385681, -3.2842760, 180, 180],
    [-1.0, -0.25, -5.5, 1, 360]
];
/////////////////////////////



const camviewArt: [number, number, number, number, number][] = [
    [1.9699041, -0.0385681, -3.2842760, 180, 180],
    [0.9182661, -0.0385681, -2.5258824, 90, 90],
    [1.5626212, -0.0385681, 0.5561651, 90, 0], // idk why cant 0
    [1.7296781, -0.0385681, 3.2851041, 0, 0],
    [2.0289216, -0.0385681, 5.3773355, 0, 90],
    [1.9789265, -0.0385681, 4.2433677, 1, 0], // idk why cant 90
    [-0.9077026, -0.0385681, 0.1154013, 0, 0],
    [-2.7551839, -0.0385681, 0.4091252, 0, 360],
    [-2.9570477, -0.0385681, 0.6396425, -90, 0],
    [-2.8570477, -0.0385681, -0.7003575, 0, 0],
    [-2.7448718, -0.0385681, -2.1240698, 0, 0],
    [-2.6448718, -0.0385681, -3.1240698, 0, -90],
    [-2.8787547, -0.0385681, -3.2981167, 180, 180],
    [0.7936609, -0.0385681, 0.7874434, 0, -180],
    [2.8936609, -0.0385681, -1.4874434, -90, -90],
    [0.7336609, -0.0385681, -4.0874434, 1, 360], // idk...
    [-2.5936609, -0.0385681, -1.4874434, 90, 90],
    [-1, -0.25, -4, 1, 360]
];
// const camview113: [number, number, number, number, number][] = [
//     [-1, -0.25, -4, 1, 360]
// ];

let camview = camviewArt;
if (canvas.id === "scene1") camview = camviewTuring;
else if (canvas.id === "scene2") camview = camviewPoster;
else if (canvas.id === "scene3") camview = camviewArt;
// else if (canvas.id === "scene4") camview = camview113;

//////////////////// Define rotation quaternion ////////////////////
// let rotidx = 0;
// const rotqua: [number, number, number, number][] = [ //rotate [30, 60, 90, 120, ...]
//     [ 0, 0.258819, 0, 0.9659258 ],
//     [ 0, 0.5, 0, 0.8660254 ],
//     [ 0, 0.7071068, 0, -0.7071068 ],
//     [ 0, 0.8660254, 0, -0.5 ],
//     [ 0, 0.9659258, 0, -0.258819 ],
//     [ 0, 1, 0, 0 ], //180
//     [ 0, 0.9659258, 0, 0.258819 ],
//     [ 0, 0.8660254, 0, 0.5 ],
//     [ 0, 0.7071068, 0, 0.7071068 ],
//     [ 0, 0.5, 0, -0.8660254 ],
//     [ 0, 0.258819, 0, -0.9659258 ],
//     [ 0, 0, 0, 1 ]
//     // [ 0, 1, 0, 0 ], //180
//     // [ 0, 0.7071068, 0, -0.7071068 ],
//     // [ 0, 0.7071068, 0, 0.7071068 ],
//     // [ 0, 0, 0, 1 ]
// ];

//////////////////// Record the initial position ////////////////////
let inipos = new SPLAT.Vector3();

//////////////////// Start the main function ////////////////////
async function main() {
    if (canvas.id !== "scene0") { // Remain disabled until the scene has finished loading.
        direpen.style.setProperty("pointer-events", "none");
        lviewBut.style.setProperty("pointer-events", "none");
        rviewBut.style.setProperty("pointer-events", "none");
    }
    if (canvas.id === "scene0") { // Show the scene menu first
        infoicon.classList.toggle('active');
    }
    await SPLAT.Loader.LoadAsync(url, scene, (progress) => (progressIndicator.value = progress * 100));
    if (canvas.id !== "scene0") {
        direpen.style.removeProperty("pointer-events");
        lviewBut.style.removeProperty("pointer-events");
        rviewBut.style.removeProperty("pointer-events");
    }
    progressDialog.close();

    //////////////////// Define all functions ////////////////////
    const secneInitial = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);
        // Add debug axis and grid
        renderer.addProgram(new AxisProgram(renderer, []));
        renderer.addProgram(new GridProgram(renderer, []));

        // Add adjustment to scenes (x-posi: fowd-up, y-posi: left-fowd(clockwise),z-posi: right-down)
        if (canvas.id === "scene0") { // library
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -2);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -9);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 0, 1), DEG2RAD * 9);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(0.0, -0.25, -4.8980897);
            camera.rotation = new SPLAT.Quaternion();
        } else if (canvas.id === "scene1") { // turing
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -13);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 180);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(-0.002, -0.25, -5.5);
            camera.rotation = new SPLAT.Quaternion();
        } else if (canvas.id === "scene2") { // poster
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -4);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 15);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(-1.0, -0.25, -5.5);
            camera.rotation = new SPLAT.Quaternion();
        } else if (canvas.id === "scene3") { // art exhibition
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -167);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -4);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(-1.0, -0.25, -4.0);
            camera.rotation = new SPLAT.Quaternion();
        } else if (canvas.id === "scene4") { // 113
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -2);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 15);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 0, 1), DEG2RAD * -2);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(-1.58, 0.0, -5.54);
            camera.rotation = new SPLAT.Quaternion();
        }
        inipos = camera.position;
    };

    const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const frame = () => {
        controls.update();
        renderer.render(scene, camera);

        requestAnimationFrame(frame);
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "a") {goLeft();}
        if (event.key === "d") {goRight();}
        if (event.key === "w") {goForward();}
        if (event.key === "s") {goBackward();}
        
        // Reset position and camera view
        if (event.key === " ") {
            camera.position = inipos;
            camera.rotation = new SPLAT.Quaternion();

            posidx = -1;
            isFirstPos = true;
            leftView();
            rightView();
        }

        //////////////////// for debugging or testing////////////////////
        // 0. show position
        if (event.key === 'p') {
            console.log(camera.position);
        }
        // 1. go left or right 
        // if (event.key === "b") {
        //     let oldx = camera.position.x;
        //     let oldz = camera.position.z;
        //     let plnx = camera.position.add(camera.forward).x;
        //     let plnz = camera.position.add(camera.forward).z;
        //     let lenr = Math.sqrt(Math.pow(plnx - oldx, 2) + Math.pow(plnz - oldz, 2));
        //     let vecABx = plnx - oldx;
        //     let vecADx = plnx - oldx;
        //     let lenAD = Math.sqrt(Math.pow(vecADx, 2));
        //     let alph = Math.acos( (vecABx*vecADx) / lenr*lenAD ) / DEG2RAD;
        //     let vecACx = lenr * ( (-1) * Math.sin(DEG2RAD * alph) ); // r*cos(α+θ)
        //     let vecACz = lenr * ( Math.cos(DEG2RAD * alph) ); // r*sin(α+θ)
        //     let newx = oldx + vecACx;
        //     let newz = oldz + vecACz;

        //     camera.position = new SPLAT.Vector3(newx, -0.25, newz);

        //     // console.log(camera.position);
        // }
        // 2. turn eye to left or right
        // if (event.key === "v") {
        //     camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, -1, 0), DEG2RAD * 90); //turn left
        // } if (event.key === "n") {
        //     camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 90); //turn right
        // }
        // 3. turn 30度/次 
        // if (event.key === "t") {
        //     // camera.rotation = new SPLAT.Quaternion();
        //     // console.log(camera.rotation);
        //     // let tmpro = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.258819, 0, 0.9659258).normalize()); // 30
        //     // let tmpro = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068)); // 90
        //     // camera.rotation = new SPLAT.Quaternion(0, tmpro.y, 0, tmpro.w);

        //     // camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 180);
        //     // camera.rotation = new SPLAT.Quaternion(0, 1, 0, 0);

        //     // if(camera.rotation.toEuler().x < 10) {camera.rotation = new SPLAT.Quaternion(0.258819, camera.rotation.y, camera.rotation.z, camera.rotation.w);}
        //     // else if(camera.rotation.toEuler().z < 10) {camera.rotation = new SPLAT.Quaternion(camera.rotation.x, camera.rotation.y, 0.258819, camera.rotation.w);}

        //     // camera.rotation = new SPLAT.Quaternion(rotqua[rotidx][0], rotqua[rotidx][1], rotqua[rotidx][2], rotqua[rotidx][3]);
        //     // rotidx += 1;
        //     // rotidx %= rotqua.length;
        //     // console.log(camera.rotation.w.toFixed(5));

        //     // console.log(camera.position);
        // }

        // fix height after press any key
        camera.position = new SPLAT.Vector3(camera.position.x, inipos.y, camera.position.z);
    };

    //////////////////// Go in four directions ////////////////////
    const goLeft = () => {
        camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068));
        camera.position = camera.position.add(camera.forward);
        camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068));
    };

    const goForward = () => {
        camera.position = camera.position.add(camera.forward);
    };

    const goRight = () => {
        camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068));
        camera.position = camera.position.add(camera.forward);
        camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068));
    };

    const goBackward = () => {
        camera.position = camera.position.subtract(camera.forward);
    };

    //////////////////// Go to the left or right camera view of fixed position ////////////////////
    const leftView = () => {
        if (posidx === -1 && isFirstPos) { // first show in initial position
            posidx = camview.length-1;
            isFirstPos = false;
        }
        else if (posidx === 0) { // not first time in initial position
            posidx = camview.length;
            isFirstPos = true;
        }
        posidx -= 1;

        let tmpidx = (posidx === camview.length-1) ? 1 : posidx+2;
        sviewtxt.textContent = "Position " + tmpidx;
        camera.position = new SPLAT.Vector3(camview[posidx][0], camview[posidx][1], camview[posidx][2]);
        if (camview[posidx][4] !== 0) {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[posidx][4]);
        }
    };

    const rightView = () => {
        posidx += 1;

        let tmpidx = (posidx === camview.length-1) ? 1 : posidx+2;
        sviewtxt.textContent = "Position " + tmpidx;
        camera.position = new SPLAT.Vector3(camview[posidx][0], camview[posidx][1], camview[posidx][2]);
        if (posidx === camview.length-1) { // not first time in initial position
            camera.rotation = new SPLAT.Quaternion();
            posidx = -1;
            isFirstPos = true;
        } else if (camview[posidx][3] === 1) {
            camera.rotation = new SPLAT.Quaternion();
        } else if (camview[posidx][3] !== 0) {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[posidx][3]);
        }
    };

    //////////////////// Assign all functions to each element ////////////////////
    secneInitial();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);

    if (canvas.id !== "scene0") {
        direpen.children[0].addEventListener("click", goLeft);
        direpen.children[1].addEventListener("click", goForward);
        direpen.children[2].addEventListener("click", goRight);
        direpen.children[3].addEventListener("click", goBackward);

        lviewBut.addEventListener("click", leftView);
        rviewBut.addEventListener("click", rightView);
    }

    requestAnimationFrame(frame);
}

main();

