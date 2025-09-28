const inputs = Array.from(document.querySelectorAll(".form-control"));
const bookMarkForm = document.querySelector(".bookMarkForm");
const removeAllBtn = document.querySelector(".removeall");
const searchInput = document.querySelector(".search-input")
const textDanger = document.querySelectorAll(".text-danger")
const addBtn = document.querySelector(".add");
let mode = "Add";
let editIndex = 0;

let sites = JSON.parse(localStorage.getItem("sites")) || [];



const validateSiteName = () => {

    const regex = /^[A-Z][a-zA-Z]{2,}$/;

    if (!regex.test(inputs[0].value)) {
        inputs[0].classList.remove('is-valid');
        inputs[0].classList.add('is-invalid');
        textDanger[0].textContent = "Site Name must start with capital and have at least 3 letters";
    } else {
        inputs[0].classList.remove('is-invalid');
        inputs[0].classList.add('is-valid');
        textDanger[0].textContent = "";
        return true;
    }

}


const validateEmail = () => {

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(inputs[2].value)) {
        inputs[2].classList.remove('is-valid');
        inputs[2].classList.add('is-invalid');
        textDanger[1].textContent = "Please enter a valid email address (example@domain.com)";
        return false;
    } else {
        inputs[2].classList.remove('is-invalid');
        inputs[2].classList.add('is-valid');
        textDanger[1].textContent = "";
        return true;
    }
}

const validatePassword = () => {

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!regex.test(inputs[3].value)) {
        inputs[3].classList.remove('is-valid');
        inputs[3].classList.add('is-invalid');
        textDanger[2].textContent = "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character (!@#$%^&*).";
        return false;
    } else {
        inputs[3].classList.remove('is-invalid');
        inputs[3].classList.add('is-valid');
        textDanger[2].textContent = "";
        return true;
    }
};




bookMarkForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;


    if (!validateSiteName() || !validateEmail() || !validatePassword()) {
        isValid = false;
    }



    if (isValid == false) return;


    if (mode == "Update") {


        const site = sites[editIndex];
        site.siteName = inputs[0].value,
            site.siteUrl = inputs[1].value,
            site.userEmail = inputs[2].value,
            site.userPassword = inputs[3].value


        localStorage.setItem("sites", JSON.stringify(sites));


        changeMode("Add");


        Swal.fire({
            title: "Updated Successfuly!",
            icon: "success",
            draggable: true
        });


    }


    else {

        const site = {
            siteName: inputs[0].value,
            siteUrl: inputs[1].value,
            userEmail: inputs[2].value,
            userPassword: inputs[3].value
        }

        sites.push(site);
        localStorage.setItem("sites", JSON.stringify(sites));

        Swal.fire({
            title: "Added Successfuly!",
            icon: "success",
            draggable: true
        });



    }



    bookMarkForm.reset();
    displaySites(sites);



});





inputs[0].addEventListener("blur", validateSiteName);
inputs[2].addEventListener("blur", validateEmail);
inputs[3].addEventListener("blur", validatePassword);


const displaySites = (arr) => {

    const result = arr.map((site, index) => {
        return `<tr>
        <td>${index}</td>
        <td>${site.siteName}</td>
        <td>${site.siteUrl}</td>
        <td>${site.userEmail}</td>
        <td>${site.userPassword}</td>
        <td><button class="btn btn-outline-danger" onclick ='removeBookMark(${index})' >Delete</button></td>
        <td><button class="btn btn-outline-primary" onclick="startEdit(${index})">Edit</button></td>


        </tr>`
    }).join("");

    document.querySelector(".sites-data").innerHTML = result;

}



const startEdit = (index) => {
    changeMode("Update");
    setEditIndex(index);
    editBookMark(index);
};

const setEditIndex = (index) => {

    editIndex = index;

}

const changeMode = (modechange) => {

    mode = modechange;

    addBtn.textContent = modechange;



}
const editBookMark = (index) => {


    const site = sites[index];
    inputs[0].value = site.siteName;
    inputs[1].value = site.siteUrl;
    inputs[2].value = site.userEmail;
    inputs[3].value = site.userPassword;

}


const removeBookMark = (index) => {

    Swal.fire({
        title: "Are you sure you want to delete this site?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            sites.splice(index, 1);
            localStorage.setItem("sites", JSON.stringify(sites));
            displaySites(sites);
            Swal.fire({
                title: "Deleted!",
                text: "the site has been deleted.",
                icon: "success"
            });
        }
    });




}

removeAllBtn.addEventListener("click", function () {
    Swal.fire({
        title: "Are you sure you want to delete all sites?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("sites");
            sites = [];
            displaySites(sites);
            Swal.fire({
                title: "Deleted!",
                text: "all sites have been deleted.",
                icon: "success"
            });
        }
    });


});


searchInput.addEventListener("input", () => {

    const filterText = searchInput.value.toLowerCase();
    const filterdSites = sites.filter((site) => {
        return site.siteName.toLowerCase().includes(filterText);
    })

    displaySites(filterdSites);


});
displaySites(sites);


