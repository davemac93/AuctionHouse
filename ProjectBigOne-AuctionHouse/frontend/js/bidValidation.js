document.addEventListener('DOMContentLoaded', function () {
    const bidForm = document.getElementById('bidForm');
    const bidErrorElement = document.querySelector('.bet_invalid');

    bidForm.addEventListener('submit', function (event) {
        if (!validateBid()) {
            event.preventDefault();
        }
    });

    function validateBid() {
        const bidAmountInput = document.getElementById('bidAmountInput');
        const currentBidElement = document.querySelector('#currentBid .bid');
        const currentBidAmount = currentBidElement ? parseFloat(currentBidElement.textContent.replace('$', '')) : 0;
        const bidAmount = parseFloat(bidAmountInput.value);

        if (isNaN(bidAmount) || bidAmount <= currentBidAmount) {
            if (bidErrorElement) {
                bidErrorElement.style.display = 'block';
            }
            return false;
        }
        
        if (bidErrorElement) {
            bidErrorElement.style.display = 'none';
        }
        return true;
    }
});