const searchForm = document.querySelector(".search-form");
const input = document.querySelector(".input");
const loadMore = document.querySelector(".load-more");
const table = document.querySelector(".news-cards");
const sourceList = document.querySelector(".source");

const APIKey = "3d64719634674a3898d96f75bb417e60";

searchForm.addEventListener("submit", retrieveNews);
loadMore.addEventListener("click", loadItems);
loadMore.addEventListener("submit", loadItems);

let cards = [];
let sourcesArray = [];

retrieveSources();

function loadItems() {
    let tr = document.createElement("tr");
    let cardsQTY = cards.length;
    if (cardsQTY !== 0) {
        for (let i = 0; i < 5; i++) {
            let br = document.createElement("br");
            let th = document.createElement("th");
            let a = document.createElement("a");
            let img = document.createElement("img");
            let item = cards.shift();
            a.setAttribute("href", item.url);
            a.setAttribute("target", "_blank");
            a.textContent = item.title;
            img.setAttribute("src", item.img);
            img.setAttribute("alt", "Image is not available");
            img.setAttribute("align", "bottom");

            th.appendChild(a);
            th.appendChild(br);
            th.appendChild(img);
            tr.appendChild(th);
            table.appendChild(tr);
        }
    } else {
        let h3 = document.createElement("h3");
        let th = document.createElement("th");
        h3.textContent = "There are no articles matching your request";
        th.appendChild(h3);
        tr.appendChild(th);
        table.appendChild(tr);
    }
}

function loadSources() {
    let sourcesCount = sourcesArray.length;
    for (let i = 0; i < sourcesCount; i++) {
        let option = document.createElement("option");
        let source = sourcesArray[i];
        let name = source.name;
        let id = source.id;
        option.setAttribute("value", id);
        option.textContent = name;
        sourceList.appendChild(option);
    }
}

function retrieveSources() {
    let sourcesURL = `https://newsapi.org/v2/sources?apiKey=${APIKey}&language=en`;

    fetch(sourcesURL).then((res) => {
        return res.json();
    }).then((data) => {
        data.sources.forEach(source => {
            sourcesArray.push({
                "id": source.id,
                "name": source.name
            });
        });
        loadSources();
    });
}

function retrieveNews(e) {
    table.innerHTML = "";
    cards = [];

    e.preventDefault();

    let topic = input.value;
    let source = sourceList.value;
    let newsUrl = `https://newsapi.org/v2/top-headlines?q=${topic}&apiKey=${APIKey}&pageSize=40&sources=${source}`;

    fetch(newsUrl).then((res) => {
        return res.json();
    }).then((data) => {
        data.articles.forEach(article => {
            if (article.urlToImage === null) {
                article.urlToImage = "https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/3/3/2/7/237233-6-eng-GB/Cosmoprof-Asia-Ltd-SIC-Cosmetics-20132_news_large.jpg";
            }
            let title = article.title.substr(0, 50) + "...";
            cards.push({
                "title": title,
                "img": article.urlToImage,
                "url": article.url
            });
        });
        loadItems();
    });
}