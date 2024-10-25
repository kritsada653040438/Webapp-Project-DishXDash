let foodItems = [];
let usedFoodItems = [];
let isRandomizing = false;

function displayFoodList() {
    const foodListDiv = document.getElementById("food-list");
    foodListDiv.innerHTML = '';

    foodItems.forEach((food, index) => {
        const foodItemDiv = document.createElement("div");
        foodItemDiv.classList.add("food-list-item");

        if (!food.img) {
            foodItemDiv.classList.add("no-img");
        }

        const foodNameSpan = document.createElement("span");
        foodNameSpan.textContent = food.name;

        if (usedFoodItems.includes(food.name)) {
            foodItemDiv.style.backgroundColor = '#ff8986';
        }

        foodItemDiv.addEventListener("click", function() {
            openModal(food);
        });

        const removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.textContent = "X";

        removeBtn.addEventListener("click", function(event) {
            event.stopPropagation();
            foodItems.splice(index, 1);
            displayFoodList();
        });

        foodItemDiv.appendChild(foodNameSpan);
        foodItemDiv.appendChild(removeBtn);
        foodListDiv.appendChild(foodItemDiv);
    });
}

function openModal(food) {
    document.getElementById("modal-food-name").textContent = food.name;
    document.getElementById("modal-food-img").src = food.img || "https://via.placeholder.com/300";
    document.getElementById("modal-food-info").textContent = food.info;

    document.getElementById("food-modal").style.display = "block";
}

const modal = document.getElementById("food-modal");
const closeBtn = document.querySelector(".close-btn");

closeBtn.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

document.querySelector(".plus-btn").addEventListener("click", function() {
    const foodName = document.getElementById("food-name-display").textContent;
    const foodItem = foodItems.find(f => f.name === foodName);
    if (foodItem) {
        openModal(foodItem);
    }
});

document.getElementById("add-food-btn").addEventListener("click", function() {
    const foodName = document.getElementById("food-name").value.trim();
    const foodImg = document.getElementById("food-img").files[0];
    const foodInfo = document.getElementById("food-info").value.trim();

    if (foodName && foodInfo) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const foodImgURL = foodImg ? e.target.result : "";
            foodItems.push({ name: foodName, info: foodInfo, img: foodImgURL });
            displayFoodList();
        };
        if (foodImg) {
            reader.readAsDataURL(foodImg);
        } else {
            foodItems.push({ name: foodName, info: foodInfo, img: "" });
            displayFoodList();
        }
    } else {
        alert("Please add both food name and info.");
    }

    // เคลียร์ค่าใน input หลังจากเพิ่มอาหาร
    document.getElementById("food-name").value = '';
    document.getElementById("food-info").value = '';
    document.getElementById("food-img").value = '';
});

document.getElementById("random-btn").addEventListener("click", function() {
    if (isRandomizing) return;

    const availableFoods = foodItems.filter(food => !usedFoodItems.includes(food.name));

    if (availableFoods.length > 0) {
        isRandomizing = true;
        document.getElementById("random-btn").style.backgroundColor = 'gray';
        document.getElementById("random-btn").style.cursor = 'not-allowed';

        const displayNameElement = document.getElementById("food-name-display");
        const displayImgElement = document.getElementById("food-img-preview");
        const displayInfoElement = document.getElementById("food-info-display");

        let index = 0;
        const interval = setInterval(() => {
            displayNameElement.textContent = availableFoods[index].name;
            displayImgElement.src = availableFoods[index].img || "https://via.placeholder.com/100";
            displayInfoElement.textContent = truncateText(availableFoods[index].info, 40);
            index = (index + 1) % availableFoods.length;
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            const randomFood = availableFoods[Math.floor(Math.random() * availableFoods.length)];

            displayNameElement.textContent = randomFood.name;
            displayImgElement.src = randomFood.img || "https://via.placeholder.com/100";
            displayInfoElement.textContent = truncateText(randomFood.info, 40);

            usedFoodItems.push(randomFood.name);
            isRandomizing = false;
            document.getElementById("random-btn").style.backgroundColor = '';
            document.getElementById("random-btn").style.cursor = 'pointer';
        }, 3000);
    } else {
        alert("No more available food to random.");
    }
});

document.getElementById("reset-btn").addEventListener("click", function() {
    usedFoodItems = [];
    const foodListItems = document.querySelectorAll(".food-list-item");
    foodListItems.forEach(item => {
        item.style.backgroundColor = '';
    });
});

document.getElementById("delete-all-btn").addEventListener("click", function() {
    foodItems = [];
    displayFoodList();
});