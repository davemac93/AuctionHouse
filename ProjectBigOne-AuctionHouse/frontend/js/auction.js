document.addEventListener('DOMContentLoaded', () => {
    const socket = io('https://auctionhouse-olvi.onrender.com');

    const updateRemainingTime = async () => {
        const remainingTimeElement = document.getElementById('remainingTime');
        if (!remainingTimeElement) {
            console.error('Element with ID "remainingTime" not found');
            return;
        }

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

    socket.on('newBid', (data) => {
        const { carId, bidAmount, user } = data;
        const currentBidElement = document.getElementById('currentBid');
        if (currentBidElement) {
            currentBidElement.innerHTML = `
            <div class="user_bet">
                <div class="userName">
                    <p>${user.name} ${user.lastname[0]}</p>
                </div>
                <div class="Price">
                    <p class="bid" id='bidAmount'>${bidAmount} $</p>
                </div>
            </div>`;
        }
    });
});


function toggleMute() {
    var video = document.getElementById('carVideo');
    var muteButton = document.getElementById('muteButton');

    if (video.muted) {
        video.muted = false;
        muteButton.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
    } else {
        video.muted = true;
        muteButton.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}