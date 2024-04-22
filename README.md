### Name
`Immerse VR tour`

### File url
Default: `https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat`

Scenes (Can use both `.ply` or `.splat`)
1. Turing study room: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Turing_study_room_03_02_3_30000.splat`
2. Poster exhibition: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Poster_exhibition_C103_03_08_2_1_50000.splat`
3. Arts exhibition: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/Arts_exhibition_A103_03_21_6_local_1_50000.splat`
4. 113 exhibition: `https://huggingface.co/datasets/sun-cake/3dGS-js-source/resolve/main/113_exhibition_C103_03_28_3_30000.splat`

### What you can change (Not just these)
1. `renderer.setSize(window.innerWidth, window.innerHeight);`
2. `renderer.backgroundColor = new SPLAT.Color32(64, 64, 64, 255);` //高斯外面的顏色

### Run
- Developing: `npm run dev`
- Before deployment: `npm run build` and `npm run preview`
- Additional: `npm run dev -- --host`

### Ref
- **gsplat**: [github](https://github.com/huggingface/gsplat.js)
- convert ply to splat: [jsfiddle](https://jsfiddle.net/2sq3pvdt/1/)

### Todo
- [ ] 移動搖桿 (wasd from 4 to 8 to inf. if time promise.)(方便手機使用者在場景中移動)
- [ ] 鎖高度(讓使用者不要飛到空中或淺入地底)
- [ ] 鎖視角(限制抬低頭的角度)
- [ ] 鎖場景邊界防止跑入虛空
- [ ] 相機視角切換 (功能完成, 把場景補齊即可)
- [ ] 主畫面製作(讓使用者選擇觀看那個場景)
- [ ] 彈出物品特寫及文字說明框 (no time)
- [ ] 已知 bug (no time) (切換場景的按鈕在手機板型跑版問題)

