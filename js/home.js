import { supabase }
from './supabase.js'

const videoGrid =
document.getElementById(
'videoGrid'
)

const searchInput =
document.getElementById(
'searchInput'
)

const categoryFilter =
document.getElementById(
'categoryFilter'
)

let videos = []

async function loadVideos(){

const {
    data,
    error
} =
await supabase
.from('videos')
.select('*')
.order(
    'created_at',
    {
        ascending:false
    }
)

if(error){

    console.error(error)

    return
}

videoGrid.innerHTML = ''

if(data.length === 0){

    videoGrid.innerHTML =

    `
    <h2>
    No videos uploaded yet.
    </h2>
    `

    return
}

videos = data
renderVideos(videos)
loadCategories(videos)

}

function loadCategories(videos){

    const categories =
    [...new Set(
        videos.map(
            v=>v.category
        )
    )]

    categories.forEach(cat=>{

        if(!cat) return

        const option =
        document.createElement(
        'option'
        )

        option.value = cat

        option.textContent = cat

        categoryFilter.appendChild(
        option
        )

    })

}

function renderVideos(list){

    videoGrid.innerHTML=''

    list.forEach(video=>{

        const card =
        document.createElement('div')

        card.className =
        'video-card'

        card.innerHTML=
        `
        <img
        src="${video.thumbnail_url}"
        class="video-thumbnail">

        <div class="video-info">

            <div class="video-title">
            ${video.title}
            </div>

        </div>
        `

        card.onclick=()=>{

            window.location.href=
            `watch.html?id=${video.id}`

        }

        videoGrid.appendChild(card)

    })

}

function filterVideos(){

    const search =
    searchInput.value
    .toLowerCase()

    const category =
    categoryFilter.value

    const filtered =
    videos.filter(video=>{

        const matchesTitle =
        video.title
        .toLowerCase()
        .includes(search)

        const matchesCategory =

        !category ||

        video.category === category

        return matchesTitle
        &&
        matchesCategory

    })

    renderVideos(filtered)

}

searchInput.addEventListener(
'input',
filterVideos
)

categoryFilter.addEventListener(
'change',
filterVideos
)

loadVideos()
