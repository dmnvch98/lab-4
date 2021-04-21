const searchForm = document.querySelector('.search-form')
const input = document.querySelector('.input')
const loadMore = document.querySelector('.load-more')
const table = document.querySelector('.news-cards')
const sourceList = document.querySelector('.source')

const APIKey = '3d64719634674a3898d96f75bb417e60'

searchForm.addEventListener('submit', retrieveNews)
loadMore.addEventListener('click', loadItems)
loadMore.addEventListener('submit', loadItems)

let cards = []
const sourcesArray = []

retrieveSources()

function loadItems () {
  const tr = document.createElement('tr')
  const cardsQTY = cards.length

  if (cardsQTY !== 0) {
    for (let i = 0; i < 5; i++) {
      const br = document.createElement('br')
      const th = document.createElement('th')
      const a = document.createElement('a')
      const img = document.createElement('img')
      const item = cards.shift()

      a.setAttribute('href', item.url)
      a.setAttribute('target', '_blank')
      a.textContent = item.title

      img.setAttribute('src', item.img)
      img.setAttribute('alt', 'Image is not available')
      img.setAttribute('align', 'bottom')

      th.appendChild(a)
      th.appendChild(br)
      th.appendChild(img)
      tr.appendChild(th)

      table.appendChild(tr)
    }
  } else {
    const h3 = document.createElement('h3')
    const th = document.createElement('th')

    h3.textContent = 'There are no articles matching your request'
    th.appendChild(h3)
    tr.appendChild(th)

    table.appendChild(tr)
  }
}

function loadSources () {
  const sourcesCount = sourcesArray.length
  for (let i = 0; i < sourcesCount; i++) {
    const option = document.createElement('option')
    const source = sourcesArray[i]
    const name = source.name
    const id = source.id

    option.setAttribute('value', id)
    option.textContent = name
    sourceList.appendChild(option)
  }
}

function retrieveSources () {
  const sourcesURL = `https://newsapi.org/v2/sources?apiKey=${APIKey}&language=en`

  fetch(sourcesURL).then((res) => {
    return res.json()
  }).then((data) => {
    data.sources.forEach(source => {
      sourcesArray.push({
        id: source.id,
        name: source.name
      })
    })
    loadSources()
  })
}

function retrieveNews (e) {
  table.innerHTML = ''
  cards = []

  e.preventDefault()

  const topic = input.value
  const source = sourceList.value
  const newsUrl = `https://newsapi.org/v2/top-headlines?q=${topic}&apiKey=${APIKey}&pageSize=40&sources=${source}`

  fetch(newsUrl).then((res) => {
    return res.json()
  }).then((data) => {
    data.articles.forEach(article => {
      if (article.urlToImage === null) {
        article.urlToImage = 'https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/3/3/2/7/237233-6-eng-GB/Cosmoprof-Asia-Ltd-SIC-Cosmetics-20132_news_large.jpg'
      }
      const title = article.title.substr(0, 50) + '...'
      cards.push({
        title: title,
        img: article.urlToImage,
        url: article.url
      })
    })
    loadItems()
  })
}
