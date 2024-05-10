const updateRemainingTime = () => {
    const remainingTimeElement = document.getElementById('remainingTime');
    const auctionEndString = remainingTimeElement.getAttribute('data-auction-end');
    const auctionEnd = new Date(auctionEndString); // Parse the auction end date from the data attribute

    const now = new Date();
    const remainingTime = auctionEnd - now;

    if (remainingTime > 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

        remainingTimeElement.innerText = `Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        remainingTimeElement.innerText = 'Auction ended';
    }
};

// Initial update
updateRemainingTime();

// Update remaining time every second
setInterval(updateRemainingTime, 1000);