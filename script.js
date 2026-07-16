import countries from './countries.json' with { type: 'json' }; //loads data from CIA factbook JSON

//needed variables
let secret_country = "";
let secret_country_info = {};
let secret_country_keys =[];
let used_hints = [];
let score = 200

//function that gets random data for a hint and returns it formatted correctly as str
function get_next_hint(data, data_keys){
  let num_possible_hints = data_keys.length; 
  let next_hint_title = ""
  let next_hint_content = ""
  do{
    let next_hint_num = Math.floor(Math.random()*num_possible_hints);
    next_hint_title = data_keys[next_hint_num] //gets the title of the first hint
    next_hint_content = data[next_hint_title] 
  }while(next_hint_content.includes(secret_country) || next_hint_title == "url"); //makes sure the hint doesnt contain the country name and is not just the url from world factbook
  return next_hint_title + ": " + next_hint_content //returns the full hint content
}

window.onload = function() {
  //create list of countries
  const countries_list = Object.keys(countries);

  //clean up  
  document.getElementById("guess-field").value= ""
  score = 200;
  
  //pick random country 
  let num_countries = countries_list.length;
  let chosen_num = Math.floor(Math.random() * num_countries);
  secret_country = countries_list[chosen_num];
  let letter_hint = secret_country[0];
  document.getElementById("first-letter").innerHTML = letter_hint //updates letter hint in DOM
  secret_country_info =countries[secret_country]; //gets data about secret country 
  secret_country_keys = Object.keys(secret_country_info); //creates list of keys to the country data
  //make datalist for countries
  for (const country of countries_list){ 
    let optionelem = document.createElement("option");
    optionelem.value = country;
    document.getElementById("countries").appendChild(optionelem);
  }
  //puts in first hint
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
//function that runs every time 'submit' button is pushed
function new_guess(){
  let guessed_country = document.getElementById("guess-field").value
  if (guessed_country == secret_country){ //if player guesses right
    let alert_text = "You win with " + score + " pts!"
    alert(alert_text)
    reset()
  }else{ //if they guess wrong
    //clean up
    document.getElementById("guess-field").value= ""
    //update score
    score -= 10
    document.getElementById("score").innerHTML = score
    let next_hint = ""
    do{ //gets a new hint
      next_hint = get_next_hint(secret_country_info, secret_country_keys);
      console.log(next_hint)
    }while(used_hints.includes(next_hint)); //tries again if hint is already in the used hints
    used_hints.push(next_hint)
    //creates tag and adds it to DOM for new hint
    let num_hints = used_hints.length
    let next_hint_item = document.createElement("li");
    next_hint_item.id = "hint-"+num_hints
    next_hint_item.innerHTML = "Hint #" + num_hints + ": " + next_hint 
    document.getElementById("hint-list").appendChild(next_hint_item)
    if(score == 0){ //if they have used their 20 questions (aka lose)
      document.getElementById("secret-country").innerHTML=secret_country //reveals secret country
      document.getElementById("guess-btn").remove() //deletes submit button from DOM
    }
  }
}