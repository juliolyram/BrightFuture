const backBtns = document.querySelectorAll('.backBtn');

backBtns.forEach(backBtn => {
    backBtn.addEventListener("click", function() {
        window.location.href = "/index.html";
    });
});