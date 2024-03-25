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

export default cars;