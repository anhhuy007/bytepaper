document.querySelectorAll('.goTo').forEach((button) => {
  button.addEventListener('click', function (event) {
    event.preventDefault()

    const btn = event.currentTarget
    const carousel = btn.closest('.carousel')

    const href = btn.getAttribute('href')
    const target = carousel.querySelector(href)

    const left = target.offsetLeft
    carousel.scrollTo({ left: left, behavior: 'smooth' })
  })
})

let autoScrollInterval
let autoScrollDelay = 5000

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('carousel')
  const slides = carousel.querySelectorAll('.carousel-item')
  let currentSlideIndex = 0

  function scrollToSlide(index) {
    const targetSlide = slides[index]
    const left = targetSlide.offsetLeft

    carousel.scrollTo({
      left: left,
      behavior: 'smooth',
    })

    currentSlideIndex = index
  }

  function scrollToNextSlide() {
    const nextSlideIndex = (currentSlideIndex + 1) % slides.length
    scrollToSlide(nextSlideIndex)
  }

  function scrollToPrevSlide() {
    const prevSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length
    scrollToSlide(prevSlideIndex)
  }

  function startAutoScroll() {
    autoScrollInterval = setInterval(scrollToNextSlide, 4000)
  }

  function stopAutoScroll() {
    clearInterval(autoScrollInterval)
  }

  startAutoScroll()

  document.querySelectorAll('.goTo').forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault()

      const direction = event.target.textContent.trim()
      if (direction === '❮') {
        scrollToPrevSlide()
      } else {
        scrollToNextSlide()
      }

      stopAutoScroll()

      setTimeout(startAutoScroll, autoScrollDelay)
    })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const lottieContainers = document.querySelectorAll('.premium-animation') // Lấy tất cả các container có class .lottie-animation

  lottieContainers.forEach((container) => {
    lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/animations/premium.json',
    })
  })
})
