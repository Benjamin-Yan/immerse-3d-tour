import * as SPLAT from "gsplat";
import {Quaternion} from "gsplat";
// import { AxisProgram } from "./AxisProgram";
// import { GridProgram } from "./GridProgram";

const DEG2RAD = Math.PI / 180; // pi/180 *theta = y (對應的弧度) -> 四元數中填上{角度*DEG2RAD}即可

const canvas = document.getElementsByClassName("canvas")[0] as HTMLCanvasElement;
const progressDialog = document.getElementById("progress-dialog") as HTMLDialogElement;
const progressIndicator = document.getElementById("progress-indicator") as HTMLProgressElement;

const lviewBut = document.getElementById("lview") as HTMLSpanElement;
const sviewtxt = document.getElementById("sview") as HTMLSpanElement;
const rviewBut = document.getElementById("rview") as HTMLSpanElement;

const direpen = document.getElementById("stewhe") as HTMLDivElement;

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
]; // https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat

let url = splaturl[+canvas.id.slice(-1)];

////////////////////  ////////////////////
let countArt = -1;
let isFirstArt:boolean = true;

//////////////////// Define camera view of specific position. ////////////////////
/* 
 - [Position(x, y, z), Rotation(counterclockwise, clockwise)]
 - `1` for original rotation
*/
// const camviewTuring: [number, number, number, number, number][] = [];
// const camviewPoster: [number, number, number, number, number][] = [];
const camviewArt: [number, number, number, number, number][] = [
    [1.9699041,-0.0385681, -3.2842760, 180, 180],
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
// const camview113: [number, number, number, number, number][] = [];

let camview = camviewArt;
// if (canvas.id === "scene1") camview = camviewTuring;
// else if (canvas.id === "scene2") camview = camviewPoster;
// else if (canvas.id === "scene3") camview = camviewArt;


//////////////////// Define rotation quaternion ////////////////////
let rotidx = 0;
const rotqua: [number, number, number, number][] = [ //rotate [30, 60, 90, 120, ...]
    [ 0, 0.258819, 0, 0.9659258 ],
    [ 0, 0.5, 0, 0.8660254 ],
    [ 0, 0.7071068, 0, -0.7071068 ],
    [ 0, 0.8660254, 0, -0.5 ],
    [ 0, 0.9659258, 0, -0.258819 ],
    [ 0, 1, 0, 0 ], //180
    [ 0, 0.9659258, 0, 0.258819 ],
    [ 0, 0.8660254, 0, 0.5 ],
    [ 0, 0.7071068, 0, 0.7071068 ],
    [ 0, 0.5, 0, -0.8660254 ],
    [ 0, 0.258819, 0, -0.9659258 ],
    [ 0, 0, 0, 1 ]
    // [ 0, 1, 0, 0 ], //180
    // [ 0, 0.7071068, 0, -0.7071068 ],
    // [ 0, 0.7071068, 0, 0.7071068 ],
    // [ 0, 0, 0, 1 ]
]

//////////////////// Start the main function ////////////////////
async function main() {
    await SPLAT.Loader.LoadAsync(url, scene, (progress) => (progressIndicator.value = progress * 100));
    progressDialog.close();

    //////////////////// Define all functions ////////////////////
    const secneInitial = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);
        // Add debug axis and grid
        // renderer.addProgram(new AxisProgram(renderer, []));
        // renderer.addProgram(new GridProgram(renderer, []));

        // Add adjustment to scenes
        if (canvas.id === "scene0") { // library
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -2);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -9);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 0, 1), DEG2RAD * 8);
            scene.objects[0].applyRotation();
            
            camera.position = new SPLAT.Vector3(0.0, -0.25, -4.8980897);
            camera.rotation = new SPLAT.Quaternion();
        } else if (canvas.id === "scene3") { // art exhibition
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -167);
            scene.objects[0].applyRotation();
            scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -4);
            scene.objects[0].applyRotation();
            // initial point (in front of the door)
            camera.position = new SPLAT.Vector3(-1.0, -0.25, -4.0);
            camera.rotation = new SPLAT.Quaternion();
        } else {
            camera.position = new SPLAT.Vector3();
            camera.rotation = new SPLAT.Quaternion();
        }
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
        // move (always head to z-positive)
        // let translation = new SPLAT.Vector3();
        // if (event.key === "a") {
        //     translation = translation.add(new SPLAT.Vector3(-1, 0, 0));
        // }
        // if (event.key === "d") {
        //     translation = translation.add(new SPLAT.Vector3(1, 0, 0));
        // }
        // if (event.key === "w") {
        //     translation = translation.add(new SPLAT.Vector3(0, 0, 1));
        // }
        // if (event.key === "s") {
        //     translation = translation.add(new SPLAT.Vector3(0, 0, -1));
        // }
        // if (event.key === "q") { // decrease the height
        //     translation = translation.add(new SPLAT.Vector3(0, 1, 0));
        // }
        // if (event.key === "e") {
        //     translation = translation.add(new SPLAT.Vector3(0, -1, 0));
        // }
        // camera.position = camera.position.add(translation);

        // move (don't care what direction is)
        if (event.key === "v") {
            // camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068)); //move left
            // camera.position = camera.position.add(camera.forward);
            // camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068));

            // let xpln = camera.position.add(camera.forward).x;
            // let zpln = camera.position.add(camera.forward).z;
            // let newx = (sqrt2 * camera.position.x + (cos45-sqrt2) * xpln) / cos45;
            // let newz = (sqrt2 * camera.position.z + (cos45-sqrt2) * zpln) / cos45;

            let oldx = camera.position.x;
            let oldz = camera.position.z;
            let plnx = camera.position.add(camera.forward).x;
            let plnz = camera.position.add(camera.forward).z;
            let lenr = Math.sqrt(Math.pow(plnx - oldx, 2) + Math.pow(plnz - oldz, 2));
            let vecABx = plnx - oldx;
            let vecADx = plnx - oldx;
            let lenAD = Math.sqrt(Math.pow(vecADx, 2));
            let alph = Math.acos( (vecABx*vecADx) / lenr*lenAD ) / DEG2RAD;
            let vecACx = lenr * ( (-1) * Math.sin(DEG2RAD * alph) ); // r*cos(α+θ)
            let vecACz = lenr * ( Math.cos(DEG2RAD * alph) ); // r*sin(α+θ)
            let newx = oldx + vecACx;
            let newz = oldz + vecACz;

            camera.position = new SPLAT.Vector3(newx, -0.25, newz);

            // console.log(camera.position);
        } if (event.key === "f") {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, -1, 0), DEG2RAD * 90); //turn left
        } if (event.key === "h") {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 90); //turn right
        } if (event.key === "t") {
            // camera.rotation = new SPLAT.Quaternion();
            // console.log(camera.rotation);
            // let tmpro = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.258819, 0, 0.9659258).normalize()); // 30
            // let tmpro = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068)); // 90
            // camera.rotation = new SPLAT.Quaternion(0, tmpro.y, 0, tmpro.w);

            // camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 180);
            // camera.rotation = new SPLAT.Quaternion(0, 1, 0, 0);

            // if(camera.rotation.toEuler().x < 10) {camera.rotation = new SPLAT.Quaternion(0.258819, camera.rotation.y, camera.rotation.z, camera.rotation.w);}
            // else if(camera.rotation.toEuler().z < 10) {camera.rotation = new SPLAT.Quaternion(camera.rotation.x, camera.rotation.y, 0.258819, camera.rotation.w);}

            camera.rotation = new SPLAT.Quaternion(rotqua[rotidx][0], rotqua[rotidx][1], rotqua[rotidx][2], rotqua[rotidx][3]);
            rotidx += 1;
            rotidx %= rotqua.length;
            // console.log(camera.rotation.w.toFixed(5));

            // console.log(camera.position);
        }

        // Reset
        if (event.key === " ") {
            camera.position = new SPLAT.Vector3(-1, -0.25, -4);
            camera.rotation = new SPLAT.Quaternion();
        }
        camera.position = new SPLAT.Vector3(camera.position.x, -0.25, camera.position.z);
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

    //////////////////// Go to the left or right camera view ////////////////////
    const leftView = () => {
        if (countArt === -1 && isFirstArt) { // in initial position
            countArt = camview.length-1; //countArt = 17; //18
            isFirstArt = false;
        }
        else if (countArt === 0) {
            countArt = camview.length; //countArt = 18;
            isFirstArt = true; // reset
        }
        countArt -= 1;

        let tmpidx = (countArt === camview.length-1) ? 1 : countArt+2;
        sviewtxt.textContent = "Position " + tmpidx;
        camera.position = new SPLAT.Vector3(camview[countArt][0], camview[countArt][1], camview[countArt][2]);
        if (camview[countArt][4] !== 0) {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[countArt][4]);
        }
    };

    const rightView = () => {
        countArt += 1;

        let tmpidx = (countArt === camview.length-1) ? 1 : countArt+2;
        sviewtxt.textContent = "Position " + tmpidx;
        camera.position = new SPLAT.Vector3(camview[countArt][0], camview[countArt][1], camview[countArt][2]);
        if (countArt === camview.length-1) { //17) {
            camera.rotation = new SPLAT.Quaternion();
            countArt = -1;
        } else if (camview[countArt][3] === 1) {camera.rotation = new SPLAT.Quaternion();}
        else if (camview[countArt][3] !== 0) {camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[countArt][3]);}
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

