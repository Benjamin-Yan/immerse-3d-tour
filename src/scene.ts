import * as SPLAT from "gsplat";
import {Quaternion} from "gsplat";

const DEG2RAD = Math.PI / 180; // pi/180 *theta = y (對應的弧度) -> 四元數中填上{角度*DEG2RAD}即可
// const cos45 = Math.cos(DEG2RAD*45);
// const sqrt2 = Math.SQRT2;

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
// const url4 = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/113_exhibition_C103_03_28_3_30000.splat";

// import { Engine } from "./Engine";
// const engine = new Engine(canvas);

////////////////////

/*
1.ref: https://www.youtube.com/watch?v=FPtMNDE6mLw
- Industry standard: Y(up and down), Z(deep), (in 3d coordinate system I., up is Y, right is Z, left is X)
  例外: Blender & Unreal E. -> Z for up
- Editor: https://playcanvas.com/supersplat/editor
  Red->X, Green->Y, Blue->Z (Sorry, don't work after update.)

{Position}
Art
x = [-3.5(left) ~ 4(right)], y = -0.25(eyes)(y正往下), z = [3(forward) ~ -7.05(backward)]

{Rotation} ref: https://www.youtube.com/watch?v=RxaDdVQm7Vc (Quaternion(四元數)講解)
- `q = s + v1i + v2j + v3k`: 實部的純量 + 虛部的向量 (q = s + v)
- `i^2 = j^2 = k^2 = ijk = -1`
- Versor: 長度為1的單位四元數
- Helper website: https://eater.net/quaternions/video/stereo4d
- https://www.youtube.com/watch?v=xoTqBqQtrY4
  4 parameter: `q = cos(w/2) + sin(w/2)*v`, where w is angle and v is vector
  We have original vector A, and what we want is to get new vector B, so we will get B = q*A*q^(-1)
  Identity quaternion: I = 1 + 0-vector

https://www.youtube.com/watch?v=wKvjgXYHGxs

https://github.com/jeyemwey/webxr-gsplats/blob/main/src/GSplatPrograms/prepare-scene.ts

https://stackoverflow.com/questions/9417246/quaternions-vs-axis-angle
Quaternios 和 Axis-angle 都是 3D 旋轉/方向的表示，並且都有優點和缺點。
如果您想要繞 Z 軸 (0,0,1) 旋轉 180 度，則四元數的實部將為cos(180deg/2)=0，其虛部將為sin(180deg/2)*(0,0,1)=(0,0,1)。那是q=0+0i+0j+1k。
Axis-angle 表示以角度a和旋轉軸n進行旋轉。例如，繞 Y 軸旋轉 180 度將表示為a = 180, n = {0,1,0}。這種表示法非常直觀，但為了實際應用旋轉，需要另一種表示，例如四元數或旋轉矩陣。

calculator: https://www.andre-gaschler.com/rotationconverter/ (both choose degrees)
https://quaternions.online
https://threejs.org/docs/#api/zh/math/Triangle
eg: the following are equal (= type of `SPLAT.Quaternion`)
Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * 120); & new SPLAT.Quaternion(0.8660254, 0, 0, 0.5)); (=cos(120/2)
absolute: camera.rotation = {SPLAT.Quaternion}
relative: camera.rotation = camera.rotation.multiply({SPLAT.Quaternion})

absolute position
camera.position = new SPLAT.Vector3(0,0,1);
relative position
camera.position = camera.position.add(new SPLAT.Vector3(1, 0, 0));

Scale

go forward
camera.position = camera.position.add(camera.forward);
((let forward = new Vector3(0, 0, 1);
        forward = this.rotation.apply(forward);))

---
---
Reset the camera
camera.position = new SPLAT.Vector3(); // (0,0,0)
camera.rotation = new SPLAT.Quaternion(); // (0,0,0,1)

A.Forward & backward (direction dont care)
camera.position = camera.position.add(camera.forward);
camera.position = camera.position.subtract(camera.forward);

B.move right or left (direction dont care)
right
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068));
camera.position = camera.position.add(camera.forward);
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068));
left
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068));
camera.position = camera.position.add(camera.forward);
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068));

C.Direction change (currently rotate right and left 30 degrees once)
right
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.258819, 0, 0.9659258));
left
camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.258819, 0, 0.9659258));

- console.log(camera.position.x.toFixed(7), ',', camera.position.y.toFixed(7), ',', camera.position.z.toFixed(7));


---
---

2.ref: https://blog.techbridge.cc/2020/11/07/matterjs-intro/
matter.js

3.React Three Fiber 辅助功能的 Drei 正式支持了 splat

*/

// import { AxisProgram } from "./AxisProgram";
// import { GridProgram } from "./GridProgram";

const lviewBut = document.getElementById("lview") as HTMLSpanElement;
const rviewBut = document.getElementById("rview") as HTMLSpanElement;

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

//////////////////// Initial scene by scene id. ////////////////////
let url = url0;
if (canvas.id === "scene1") url = url1;
else if (canvas.id === "scene2") url = url2;
else if (canvas.id === "scene3") url = url3;

//////////////////// Initial scene by scene id. ////////////////////
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

async function main() {
    await SPLAT.Loader.LoadAsync(url, scene, (progress) => (progressIndicator.value = progress * 100));
    progressDialog.close();

    const secneInitial = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);
        // Add debug axis and grid
        // renderer.addProgram(new AxisProgram(renderer, []));
        // renderer.addProgram(new GridProgram(renderer, []));

        scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -167);
        scene.objects[0].applyRotation();
        scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -4);
        scene.objects[0].applyRotation();
        
        camera.position = new SPLAT.Vector3(-1.0, -0.25, -4.0);
        camera.rotation = new SPLAT.Quaternion();

        
        // Add adjustment to scenes
        // if (canvas.id === "scene1") {}
        // else if (canvas.id === "scene3") { // art exhibition
        //     scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * -167);
        //     scene.objects[0].applyRotation();
        //     scene.objects[0].rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(1, 0, 0), DEG2RAD * -4);
        //     scene.objects[0].applyRotation();
        //     // initial point (in front of the door)
        //     camera.position = new SPLAT.Vector3(-1.0, -0.25, -4.0);
        //     camera.rotation = new SPLAT.Quaternion();
        // }
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
        // move (always head to z-positive)
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

        // move (don't care what direction is)
        if (event.key === "g") {
            camera.position = camera.position.add(camera.forward); //forward
        } if (event.key === "b") {
            camera.position = camera.position.subtract(camera.forward); //backward
        } if (event.key === "v") {
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
        } if (event.key === "n") {
            camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, 0.7071068, 0, 0.7071068)); //move right
            camera.position = camera.position.add(camera.forward);
            camera.rotation = camera.rotation.multiply(new SPLAT.Quaternion(0, -0.7071068, 0, 0.7071068));
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

            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * 180);
            // camera.rotation = new SPLAT.Quaternion(0, 1, 0, 0);

            // if(camera.rotation.toEuler().x < 10) {camera.rotation = new SPLAT.Quaternion(0.258819, camera.rotation.y, camera.rotation.z, camera.rotation.w);}
            // else if(camera.rotation.toEuler().z < 10) {camera.rotation = new SPLAT.Quaternion(camera.rotation.x, camera.rotation.y, 0.258819, camera.rotation.w);}
            

            // camera.rotation = new SPLAT.Quaternion(rotqua[rotidx][0], rotqua[rotidx][1], rotqua[rotidx][2], rotqua[rotidx][3]);
            // rotidx += 1;
            // rotidx %= rotqua.length;
            // console.log(camera.rotation.w.toFixed(5));
        }

        // Reset
        if (event.key === " ") {
            camera.position = new SPLAT.Vector3(-1, -0.25, -4);
            camera.rotation = new SPLAT.Quaternion();
        }
        camera.position = new SPLAT.Vector3(camera.position.x, -0.25, camera.position.z);
    };

    //////////////////// Go to left camera view. ////////////////////
    lviewBut.addEventListener("click", function() {
        if (countArt === -1 && isFirstArt) { // in initial position
            countArt = camview.length-1; //countArt = 17; //18
            isFirstArt = false;
        }
        else if (countArt === 0) {
            countArt = camview.length; //countArt = 18;
            isFirstArt = true; // reset
        }
        countArt -= 1;

        camera.position = new SPLAT.Vector3(camview[countArt][0], camview[countArt][1], camview[countArt][2]);
        if (camview[countArt][4] !== 0) {
            camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[countArt][4]);
        }
    });

    //////////////////// Go to right camera view. ////////////////////
    rviewBut.addEventListener("click", function() {
        countArt += 1;
        camera.position = new SPLAT.Vector3(camview[countArt][0], camview[countArt][1], camview[countArt][2]);
        if (countArt === camview.length-1) { //17) {
            camera.rotation = new SPLAT.Quaternion();
            countArt = -1;
        } else if (camview[countArt][3] === 1) {camera.rotation = new SPLAT.Quaternion();}
        else if (camview[countArt][3] !== 0) {camera.rotation = Quaternion.FromAxisAngle(new SPLAT.Vector3(0, 1, 0), DEG2RAD * camview[countArt][3]);}
    });

    secneInitial();
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", onKeyDown);

    requestAnimationFrame(frame);
}

main();

