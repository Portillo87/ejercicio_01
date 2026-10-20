const API_URL = 'https://rickandmortyapi.com/api/character'

const cards = document.querySelector('#cards')
const templateCard = document.querySelector('#template-card').content
const loading = document.querySelector('#loading')
const message = document.querySelector('#message')
const btnPrev = document.querySelector('#btn-prev')
const btnNext = document.querySelector('#btn-next')
const pageInfo = document.querySelector('#page-info')

let nextPage = null
let prevPage = null
let currentPage = 1

// Consulta los personajes de la API
const fetchData = async (url = API_URL) => {
    try {
        loadingData(true)
        message.classList.add('hidden')

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('No se pudo consultar la API')
        }

        const data = await response.json()

        nextPage = data.info.next
        prevPage = data.info.prev
        currentPage = getPageNumber(url)

        showData(data.results)
        updateNavigation()
    } catch (error) {
        cards.textContent = ''
        message.textContent = 'No fue posible cargar los personajes. Verifica tu conexion a internet.'
        message.classList.remove('hidden')
        console.log(error)
    } finally {
        loadingData(false)
    }
}

// Muestra u oculta el mensaje de carga
const loadingData = (estado) => {
    if (estado) {
        loading.classList.remove('hidden')
    } else {
        loading.classList.add('hidden')
    }
}

// Crea las tarjetas con los datos recibidos
const showData = (characters) => {
    const fragment = document.createDocumentFragment()
    cards.textContent = ''
    characters.forEach((item) => {
        const clone = templateCard.cloneNode(true)

        clone.querySelector('.character-image').src = item.image
        clone.querySelector('.character-image').alt = item.name
        clone.querySelector('.name').textContent = item.name
        clone.querySelector('.status').textContent = item.status
        clone.querySelector('.species').textContent = item.species
        clone.querySelector('.gender').textContent = item.gender
        clone.querySelector('.origin').textContent = item.origin.name
        fragment.appendChild(clone)
    })

    cards.appendChild(fragment)
}

const getPageNumber = (url) => {
    if (!url || !url.includes('page=')) {
        return 1
    }
    const params = new URL(url).searchParams
    return Number(params.get('page')) || 1
}

const updateNavigation = () => {
    btnPrev.disabled = !prevPage
    btnNext.disabled = !nextPage
    pageInfo.textContent = `Pagina ${currentPage}`
}

btnPrev.addEventListener('click', () => {
    if (prevPage) {
        fetchData(prevPage)
    }
})

btnNext.addEventListener('click', () => {
    if (nextPage) {
        fetchData(nextPage)
    }
})

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})
