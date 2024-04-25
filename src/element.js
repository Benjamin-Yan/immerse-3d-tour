const infoicon = document.getElementById("infoicon")
const menuicon = document.querySelector('.menuicon');
const links = document.querySelectorAll(".menu-content img");
const list = document.querySelectorAll(".column li button");

// 創建一個映射來將其對應到相關的連結
const toLink = new Map();
// 1.title to link map
toLink.set("圖靈書房", "../turing_study_room/index.html");
toLink.set("奇萊傳響海報展", "../poster_exhibition/index.html");
toLink.set("島鏈亞太國際藝術展", "../arts_exhibition/index.html");
toLink.set("113級畢製", "../113_exhibition/index.html");
toLink.set("Home", "../../index.html");
// 2.id to link map
toLink.set("btn1", "turing_study_room");
toLink.set("btn2", "poster_exhibition");
toLink.set("btn3", "arts_exhibition");
toLink.set("btn4", "113_exhibition");

///////////////////////////////// Start of info icon /////////////////////////////////
if (infoicon) {
    infoicon.addEventListener('click', () => {
        infoicon.classList.toggle('active');
        infoicon.classList.add("hidden");
        setTimeout(function() {
            if (infoicon.classList.contains('active')) {
                infoicon.textContent = "X";
            } else {
                infoicon.textContent = "i";
            }
            infoicon.classList.remove("hidden");
        }, 500);
    })
}
///////////////////////////////// End of info icon /////////////////////////////////

///////////////////////////////// Start of menu icon /////////////////////////////////
if (menuicon) {
    const menucontent = document.querySelector('.menu-content');
    menuicon.addEventListener('click', () => {
        menuicon.classList.toggle('active');
        if (menuicon.classList.contains('active')) {
            menucontent.setAttribute("style", "right: 0px;");
        } else {
            menucontent.setAttribute("style", "right: -80px;");
        }
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

///////////////////////////////// End of menu icon /////////////////////////////////

///////////////////////////////// Start of scene selection button /////////////////////////////////
list.forEach(function(li) {
    li.addEventListener("click", function() {
        let id = li.getAttribute("id");
        let href = toLink.get(id);
        
        if (href) {window.location.href = "src/" + href + "/index.html";}
    });
});

///////////////////////////////// End of scene selection button /////////////////////////////////

