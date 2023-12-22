const btn = document.getElementById("btn");
const load = () => {
  document.getElementById("heading").innerHTML =
    "samiullah is a very nice person";
  console.log("sami");
};
btn.onclick = load;

// question no 3
const button = document.getElementById("additem");

const item = () => {
  const newItem = document.getElementById("newitem");
  const list = document.getElementById("mylist");
  const listitem = document.createElement("li");

  listitem.innerHTML = newItem.value;
  list.appendChild(listitem);
  newItem.value = "";
};
button.onclick = item;
