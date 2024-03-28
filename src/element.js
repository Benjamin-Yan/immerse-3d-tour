const menuicon = document.querySelector('.menuicon');
const links = document.querySelectorAll(".menu-content img");
const list = document.querySelectorAll(".column li button");

// 創建一個映射來將其對應到相關的連結
const toLink = new Map();
// 1.title to link map
toLink.set("圖靈書房", "../turing_study_room/index.html");
toLink.set("奇萊傳響海報展", "../poster_exhibition/index.html");
toLink.set("島鏈亞太國際藝術展", "../arts_exhibition/index.html");
toLink.set("Home", "../../index.html");
// 2.id to link map
toLink.set("btn1", "turing_study_room");
toLink.set("btn2", "poster_exhibition");
toLink.set("btn3", "arts_exhibition");

if (menuicon) {
    menuicon.addEventListener('click', () => {
        menuicon.classList.toggle('active');
    })
}

links.forEach(function(img) {
    img.addEventListener("click", function() {
        // 根據 img 元素的 title 屬性查找其對應的連結
        let title = img.getAttribute("title");
        let href = toLink.get(title);

        if (href) {window.location.href = href;}
    });
});

list.forEach(function(li) {
    li.addEventListener("click", function() {
        let id = li.getAttribute("id");
        let href = toLink.get(id);
        
        if (href) {window.location.href = "src/" + href + "/index.html";}
    });
});

