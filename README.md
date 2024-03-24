- todo

- ref
github: https://github.com/huggingface/gsplat.js
ply to splat: https://jsfiddle.net/2sq3pvdt/1/
打包 https://ithelp.ithome.com.tw/articles/10303608

- file url
1. `const url = "https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.splat";`
2. `https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat`
3. `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.ply`
4. `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2.splat`

- changes
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255); //高斯外面的顏色

- run
npm run dev
