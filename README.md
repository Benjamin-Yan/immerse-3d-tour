### Immerse 3D tour
此網頁是一種利用 3D gaussian splatting 來創建場景的沉浸式導覽系統，該系統在虛擬環境中將帶來新層次的真實性和互動性。

### Features
- `網站渲染高斯場景`: 透過 `gsplat.js` 專案渲染高斯場景，該專案由 Hugging Face 研發，專門用於渲染高斯場景的 Javascript 程式庫。
- `手機搖桿移動功能`: 為了方便使用者在手機上瀏覽網頁時能夠更方便地移動，我們開發了一個搖桿移動功能。<br/>使用者可以點擊頁面左下角的搖桿，透過搖桿上的四個方向按鈕來進行前後左右的移動，讓瀏覽體驗更加流暢和直觀。
- `相機視角切換`: 我們加入了視角切換功能，使使用者能快速移動到理想的位置。點擊下方按鈕的左右兩側即可在預設位置間切換。同時，螢幕中間顯示目前視角的編號，讓使用者了解自己所在的位置。這一功能使得觀看和探索場景更加便利和高效。
- `場景說明文字框`: 在每個場景中，我們都設置了說明文字框。使用者只需點擊右上角的圖示，就能瀏覽場景的資訊、地點和操作說明。若要關閉說明文字框，再按一次該圖示即可。
- `場景跳轉選單`: 點擊右下角選單可看到四個場景圖示，當滑鼠移至圖示上時，會顯示場景名稱。這使得使用者能更自由地探索和體驗各種不同的場景。

### Reference
- `gsplat.js`: [github](//github.com/huggingface/gsplat.js)
- 專題成果 Canva 簡報[連結](https://www.canva.com/design/DAGEQPcNdpc/pl9HuSUc2ehr4o8XUz4QFA/view?utm_content=DAGEQPcNdpc&utm_campaign=designshare&utm_medium=link&utm_source=viewer)

#### Future work
- [ ] 為場景加上邊界，防止跑入虛空。 (gsplat.js 不支援 three.js，且目前無快速有效的解法，可能要換成 mkkellogg / [GaussianSplats3D](//github.com/mkkellogg/GaussianSplats3D) 才行。)
- [ ] 彈出物品特寫及說明框 (同上原因，且在 gspla.js 中要定位物體的位置有點小花時間，所以目前作罷。)
- [ ] 無方向限制的無限移動 (成果參考: Yulei He 大大幫 LABORATORIO 31 建立的[網站](//current-exhibition.com/laboratorio31/))
- [ ] 鎖定視角 (限制抬低頭的角度，若達成，即可鎖定人物在場景中的視野高度。)

