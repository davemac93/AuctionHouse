document.addEventListener("DOMContentLoaded", function () {
    // Extract car data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const make = urlParams.get('make');
    const model = urlParams.get('model');
    const year = urlParams.get('year');
    const mileage = urlParams.get('mileage');
    const auctionEnd = urlParams.get('auctionEnd');
    const startingPrice = urlParams.get('startingPrice');

    // Populate the car title
    const carTitle = document.getElementById("carTitle");
    carTitle.textContent = `${make} ${model} - ${year}`;

    // Populate the car details
    const carDetailsContainer = document.getElementById("carDetails");
    carDetailsContainer.innerHTML = `
        <h2>Specifications</h2>
        <ul>
            <li>Make: ${make}</li>
            <li>Model: ${model}</li>
            <li>Year: ${year}</li>
            <li>Mileage: ${mileage} miles</li>
        </ul>
        
        <h2>Auction Information</h2>
        <p>Auction End: ${auctionEnd}</p>
        <p>Starting Price: $${startingPrice}</p>
        
        <!-- Add more details as needed -->
    `;
});