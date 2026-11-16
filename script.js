const btn_parents = document.getElementById("parents");
const btn_psycos = document.getElementById("psycos")
const btn_secretary = document.getElementById("secretary")
const btn_teachers = document.getElementById("teachers")


btn_parents.addEventListener("click", function() {
    window.location.href = "/pages/parents/parents.html";
});

btn_psycos.addEventListener("click", function() {
    window.location.href = "/pages/psyco/psyco.html";
});

btn_secretary.addEventListener("click", function() {
    window.location.href = "/pages/secretary/secretary.html";
});

btn_teachers.addEventListener("click", function() {
    window.location.href = "/pages/teacher/teacher.html";
});