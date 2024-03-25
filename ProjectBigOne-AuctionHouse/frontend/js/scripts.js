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


document.addEventListener("DOMContentLoaded", function () {
    const carPosts = [
        ["New Car Model", "Check out the latest car model with amazing features!", "2022-02-15", "Car News", "./img/1.jpg"],
        ["Tips for Maintenance", "Learn how to maintain your car for optimal performance.", "2022-02-18", "Maintenance Tips", "./img/2.jpg"]
        // Add more car posts as needed
    ];

    function addBlogPost(title, content, date, group, imagePath) {
        console.log("Adding new post");
        const blogPost = document.createElement("div");
        blogPost.classList.add("blog_post");
        
        // Create and set the image element
        const image = document.createElement("img");
        image.src = imagePath; // Use the provided image path
        image.alt = title;
        blogPost.appendChild(image);

        // Create and set the title element
        const titleElement = document.createElement("h3");
        titleElement.textContent = title;
        blogPost.appendChild(titleElement);

        // Create and set the content element
        const contentElement = document.createElement("p");
        contentElement.textContent = content;
        blogPost.appendChild(contentElement);

        // Create and set the date element
        const dateElement = document.createElement("p");
        dateElement.textContent = `Date: ${date}`;
        blogPost.appendChild(dateElement);

        // Create and set the group element
        const groupElement = document.createElement("p");
        groupElement.textContent = `Group: ${group}`;
        blogPost.appendChild(groupElement);

        // Add click event listener to dynamically generate details page content
        blogPost.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            // Dynamically generate details page content
            const detailsUrl = `detailsBlog.html?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&date=${encodeURIComponent(date)}&group=${encodeURIComponent(group)}&imagePath=${encodeURIComponent(imagePath)}`;
            window.open(detailsUrl, "_blank"); // Open details page in new tab
        });

        const blogContainer = document.getElementById("blogContainer");
        blogContainer.appendChild(blogPost);
    }

    // Example usage
    carPosts.forEach(carData => addBlogPost(...carData));
});

document.addEventListener("DOMContentLoaded", function () {
    const cars = [
        {
            model: "Corolla",
            make: "Toyota",
            year: 2020,
            mileage: 25000,
            auctionEnd: new Date("2024-03-28T12:00:00Z"), // Example end time for the auction (replace with your actual end time)
            startingPrice: 15000,
            imagePath: "./img/1.jpg",
            detailsPage: "./corolla-details.html" // Replace with the URL of the details page for this car
        },
        {
            model: "Civic",
            make: "Honda",
            year: 2018,
            mileage: 30000,
            auctionEnd: new Date("2024-03-27T12:00:00Z"), // Example end time for the auction (replace with your actual end time)
            startingPrice: 18000,
            imagePath: "./img/2.jpg",
            detailsPage: "./civic-details.html" // Replace with the URL of the details page for this car
        },
        {
            model: "Camry",
            make: "Toyota",
            year: 2019,
            mileage: 20000,
            auctionEnd: new Date("2024-03-26T12:00:00Z"), // Example end time for the auction (replace with your actual end time)
            startingPrice: 17000,
            imagePath: "./img/3.jpg",
            detailsPage: "./camry-details.html" // Replace with the URL of the details page for this car
        }
    ];

    function addToCollection(car) {
        console.log("Adding new car to collection");
        const collectionPost = document.createElement("div");
        collectionPost.classList.add("collection_post");
        
        // Create anchor tag for car details page
        const anchor = document.createElement("a");
        anchor.href = "#"; // Set a placeholder href
        collectionPost.appendChild(anchor);

        // Create and set the image element
        const image = document.createElement("img");
        image.src = car.imagePath; // Use the provided image path
        image.alt = `${car.make} ${car.model}`;
        anchor.appendChild(image);

        // Create and set the title element
        const titleElement = document.createElement("h3");
        titleElement.textContent = `${car.make} ${car.model}`;
        anchor.appendChild(titleElement);

        // Create and set the content elements
        const detailsList = document.createElement("ul");
        const detailsItems = [
            `Year: ${car.year}`,
            `Mileage: ${car.mileage}`,
            `Time to Auction: <span id="auctionTime_${car.model}"></span>`,
            `Starting Auction Price: $${car.startingPrice}`
        ];
        detailsItems.forEach(item => {
            const detailItem = document.createElement("li");
            detailItem.innerHTML = item;
            detailsList.appendChild(detailItem);
        });
        anchor.appendChild(detailsList);

        const collectionContainer = document.getElementById("collectionContainer");
        collectionContainer.appendChild(collectionPost);

        // Add click event listener to dynamically generate details page content
        anchor.addEventListener("click", function(event) {
            event.preventDefault(); // Prevent default link behavior
            
            // Dynamically generate details page content
            const detailsUrl = `detailsPage.html?make=${car.make}&model=${car.model}&year=${car.year}&mileage=${car.mileage}&auctionEnd=${car.auctionEnd}&startingPrice=${car.startingPrice}`;
            window.open(detailsUrl, "_blank"); // Open details page in new tab
        });

        updateAuctionTime(car);
    }

    function updateAuctionTime(car) {
        const auctionEndTime = car.auctionEnd.getTime();

        const intervalId = setInterval(function () {
            const now = new Date().getTime();
            const distance = auctionEndTime - now;

            if (distance <= 0) {
                clearInterval(intervalId);
                document.getElementById(`auctionTime_${car.model}`).textContent = "Auction Ended";
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                const timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
                document.getElementById(`auctionTime_${car.model}`).textContent = timeString;
            }
        }, 1000);
    }

    // Add cars from the array to the collection
    cars.forEach(car => addToCollection(car));
});


document.getElementById('scrollDownButtonMain').addEventListener('click', function() {
    const sliderElement = document.querySelector('.slider');
    
    const offset = 80; 

    const targetScrollPosition = sliderElement.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({
        top: targetScrollPosition,
        behavior: 'smooth'
    });
});