const menuicon = document.querySelector('.menuicon');
var links = document.querySelectorAll(".menu-content img");

// 創建一個映射來將每個 title 映射到其對應的連結
const titleToLinkMap = new Map();
titleToLinkMap.set("圖靈書房", "../turing_study_room/index.html");
titleToLinkMap.set("奇萊傳響海報展", "../poster_exhibition/index.html");
titleToLinkMap.set("島鏈亞太國際藝術展", "../arts_exhibition/index.html");
titleToLinkMap.set("Home", "../../index.html");

menuicon.addEventListener('click', () => {
    menuicon.classList.toggle('active');
})

links.forEach(function(img) {
    img.addEventListener("click", function() {
        // 根據 img 元素的 title 屬性查找其對應的連結
        var title = img.getAttribute("title");
        var href = titleToLinkMap.get(title);

        if (href) {
            window.location.href = href;
        }
    });
});

