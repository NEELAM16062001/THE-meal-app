// Helps to store favourite meals in local storage without any loss of data when the user refreshes the page.
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}
async function fetchMealsFromApi(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
}
// This function helps to display the meal card list in main body when the user searches for a particular meal.
function showMealList() {
  let inputName = document.getElementById("my-search").value;
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s="; //api url
  let html = "";
  let meals = fetchMealsFromApi(url, inputName);
  //Meal search from api
  meals.then((data) => {
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        //if meal is in favourite list then it shows red heart button
        if (isFav) {
          html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${element.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                    <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%;color:white; background-color:red;"><i class="fa-solid fa-heart"></i></button>
                    </div>
                    </div>
                    </div>
                    `;
          //if meal is not in favourite list then it shows white heart button
        } else {
          html += `
                    <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <h5 class="card-title">${element.strMeal}</h5>
                    <div class="d-flex justify-content-between mt-5">
                    <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                    <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                    </div>
                    </div>
                    </div>
                    `;
        }
      });
      //if no meal found then it shows 404 error
    } else {
      html += `
            <div class="page-wrap d-flex flex-row align-items-center">
            <div class="container">
            <div class="row justify-content-center">
            <div class="col-md-12 text-center">
            <span class="display-1 d-block">404 Error</span>
            <div class="mb-4 lead">
            SORRY! No meal found.
            </div>
            </div>
            </div>
            </div>
            </div>
            `;
    }
    // Displays the meal card list in main body
    document.getElementById("main").innerHTML = html;
  });
}
//Fecting meal details from api including the instructions and video link of the meal provided
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  await fetchMealsFromApi(url, id).then((data) => {
    html += `
        <div id="meal-details" class="mb-5">
        <div id="meal-header" class="d-flex justify-content-around flex-wrap">
        <div id="meal-thumbail">
        <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
        </div>
        <div id="details">
        <h3>${data.meals[0].strMeal}</h3>
        <h6>Category : ${data.meals[0].strCategory}</h6>
        <h6>Area : ${data.meals[0].strArea}</h6>
        </div>
        </div>
        <div id="meal-instruction" class="mt-3">
        <h5 class="text-center text-primary">INSTRUCTIONS</h5>
        <p>${data.meals[0].strInstructions}</p>  
        </div>
        <div class="text-center">
        <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-success mt-3">Watch Video</a>    
        </div>
        </div>
        `;
  });
  document.getElementById("main").innerHTML = html; //displays the meal details
}
//Shows your favourite meal list added by you in the favourite list
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  //if no meal is added in favourite list then it shows 404 error
  if (arr.length == 0) {
    html += `
        <div class="page-wrap d-flex flex-row align-items-center">
        <div class="container">
        <div class="row justify-content-center">
        <div class="col-md-12 text-center">
        <span class="display-1 d-block">404 Error</span>
        <div class="mb-4 lead">
        Add your favourite food here...
        </div>
        </div>
        </div>
        </div>
        </div>
        `;
    //if meal is added in favourite list then it shows the meal card list in favourite list
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then((data) => {
        html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                <div class="card-body">
                <h5 class="card-title">${data.meals[0].strMeal}</h5>
                <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%; color:white; background-color:red;"><i class="fa-solid fa-heart"></i></button>
                </div>
                </div>
                </div>
                `;
      });
    }
  }
  document.getElementById("favourites-body").innerHTML = html; //displays the favourite meal list
}
//This function helps user to add to or remove meals from favourites list
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = false;
  for (let index = 0; index < arr.length; index++) {
    if (id == arr[index]) {
      contain = true;
    }
  }
  //if meal is already added in favourite list then it removes the meal from favourite list
  if (contain) {
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("Removed your food from favourites list");
  }
  //if meal is not added in favourite list then it adds the meal to favourite list
  else {
    arr.push(id);
    alert("Added your food to favourites list");
  }
  localStorage.setItem("favouritesList", JSON.stringify(arr));
  showMealList(); //displays the meal list
  showFavMealList(); //displays the favourite meal list
}
