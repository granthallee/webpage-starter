import countries from './countries.json' with { type: 'json' };

//needed variables
let secret_country = "";
let secret_country_info = {};
let secret_country_keys =[];
let used_hints = [];
let score = 200

function get_next_hint(data, data_keys){
  let num_possible_hints = data_keys.length; 
  let next_hint_num = Math.floor(Math.random()*num_possible_hints);
  let next_hint_title = ""
  do{
     next_hint_title = data_keys[next_hint_num] //gets the title of the first hint
  }while(next_hint_title =="url"); //makes sure its not the url item
  let next_hint_content = data[next_hint_title]
  return next_hint_title + ": " + next_hint_content
}

window.onload = function() {
  console.log("hello");
  //create list of countries
  const countries_list = Object.keys(countries);

  //game variables


  //clean up  
  document.getElementById("guess-field").value= ""
  score = 200;
  
  //pick random country 
  let num_countries = countries_list.length;
  let chosen_num = Math.floor(Math.random() * num_countries);
  secret_country = countries_list[chosen_num];
  let letter_hint = secret_country[0];
  console.log(secret_country) //gets secret country
  console.log(letter_hint) // creates first hint
  document.getElementById("first-letter").innerHTML = letter_hint //updates letter hint in DOM
  secret_country_info =countries[secret_country]; //gets data about secret country 
  secret_country_keys = Object.keys(secret_country_info); //creates list of keys to the country data
  for (const country of countries_list){ //make datalist for countries
    let optionelem = document.createElement("option");
    optionelem.value = country;
    document.getElementById("countries").appendChild(optionelem);
  }
  let hint_text = document.getElementById("hint-1").innerHTML
  let first_hint = get_next_hint(secret_country_info, secret_country_keys)
  used_hints.push(first_hint)
  document.getElementById("hint-1").innerHTML = hint_text + " " + first_hint;

  //event listener for  buttons
  document.getElementById("guess-btn").addEventListener("click", new_guess); 
  document.getElementById("reset-btn").addEventListener("click", reset); 
};
function reset(){
  window.location.reload();
}

function new_guess(){
  let guessed_country = document.getElementById("guess-field").value
  console.log(guessed_country);
  if (guessed_country == secret_country){
    let alert_text = "You win with " + score + " pts!"
    alert(alert_text)
    reset()
  }else{
    //clean up
    document.getElementById("guess-field").value= ""
    //update score
    score -= 10
    console.log(score)
    document.getElementById("score").innerHTML = score
    let next_hint = ""
    do{
      //gets a new hint
      next_hint = get_next_hint(secret_country_info, secret_country_keys);
      console.log(next_hint)
    }while(used_hints.includes(next_hint)); //tries again if hint is already in the used hints
    used_hints.push(next_hint)
    let num_hints = used_hints.length
    let next_hint_item = document.createElement("li");
    next_hint_item.id = "hint-"+num_hints
    next_hint_item.innerHTML = "Hint #" + num_hints + ": " + next_hint 
    document.getElementById("hint-list").appendChild(next_hint_item)
    if(score == 0){
      document.getElementById("secret-country").innerHTML=secret_country
      document.getElementById("guess-btn").remove()
    }
  }
}