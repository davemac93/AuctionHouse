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


    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "arrow_previous" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({left: scrollAmount, behavior: "smooth"});
        })
    })

    const handelSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? 'none' : 'block';
    }



    imageList.addEventListener('scroll', () => {
        handelSlideButtons();
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



