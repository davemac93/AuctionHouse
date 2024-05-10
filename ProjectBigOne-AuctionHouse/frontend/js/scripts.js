const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown_menu');


const toggleDropDown = () => {

    dropDownMenu.classList.toggle('open');

    const isOpen = dropDownMenu.classList.contains('open');

    toggleBtnIcon.classList = isOpen
        ? 'fa-solid fa-xmark'
        : 'fa-solid fa-bars';
}

toggleBtn.onclick = toggleDropDown;

const initSlider = () => {
    const imageList = document.querySelector('.slider_wrapper .image_list');
    const slideButtons = document.querySelectorAll('.slider_wrapper .arrows');
    const sliderScrollbar = document.querySelector('.container .slider_scrollbar');
    const scrollBarThumb = document.querySelector('.scrollbar_thumb');

    const handelResize = () => {
        maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
        updateScrollThumbPosition();
    };

    window.addEventListener('resize', handelResize);

    scrollBarThumb.addEventListener('mousedown', (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollBarThumb.offsetLeft;
        const maxThumbPostion = sliderScrollbar.getBoundingClientRect().width - scrollBarThumb.offsetWidth;

        const handelMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;

            const boundedPosition = Math.max(0, Math.min(maxThumbPostion, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPostion) * maxScrollLeft;

            scrollBarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        const handelMouseUp = () => {
            document.removeEventListener('mousemove', handelMouseMove);
            document.removeEventListener('mouseup', handelMouseUp);
        }
        document.addEventListener('mousemove', handelMouseMove);
        document.addEventListener('mouseup', handelMouseUp);
    });

    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "arrow_previous" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({left: scrollAmount, behavior: "smooth"});
        })
    })

    const handelSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? 'none' : 'block';
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? 'none' : 'block';
    }

    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollBarThumb.offsetWidth);
        scrollBarThumb.style.left = `${thumbPosition}px`;
    }

    imageList.addEventListener('scroll', () => {
        handelSlideButtons();
        updateScrollThumbPosition();
    })
}

window.addEventListener('load', initSlider);


document.getElementById('scrollDownButtonMain').addEventListener('click', function() {
    const sliderElement = document.querySelector('.slider');
    
    const offset = 80; 

    const targetScrollPosition = sliderElement.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth'
    });
});

document.getElementById('moveToLogin').addEventListener('click', function() {
    window.location.href = '/reg-log';
});


