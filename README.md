### Name
`Immerse VR tour`

### File url
Default: `https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat`

Scenes (Can use both `.ply` or `.splat`)
1. Turing study room: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.splat`
2. Poster exhibition: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2_1_50000.splat`
3. Arts exhibition: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Arts_exhibition_A103_03_21_6_local_1_50000.splat`

### What you can change (Not just these)
1. `renderer.setSize(window.innerWidth, window.innerHeight);`
2. `renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);` //高斯外面的顏色

### Run
- Developing: `npm run dev`
- Before deployment: `npm run build` and `npm run preview`

### Ref
- **gsplat**: [github](https://github.com/huggingface/gsplat.js)
- convert ply to splat: [jsfiddle](https://jsfiddle.net/2sq3pvdt/1/)

### Todo
- [ ] 移動搖桿
- [ ] 鎖高度
- [ ] 鎖視角
- [ ] 相機視角切換
- [ ] file 整理

