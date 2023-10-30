const formsState = {
  محول: { curr: "كبير", سعر: { كبير: 0, متوسط: 0, صغير: 0 }, عدد: 0 },
  "سعر / cm": 0,
  علاقة: { سعر: 0, عدد: 0 },
  سبيسر: { سعر: 0, عدد: 0 },
  اللغة: {
    curr: "عربي",
    النسبة: { انجليزي: 0, عربي: 0, "انجليزي مشبك": 0 },
  },
  تفاصيل: { curr: "كثير", النسبة: { كثير: 0, متوسط: 0, قليل: 0 } },
  ابعاد: { طول: 0, عرض: 0 },
};

const finalPriceElement = document.querySelector("h2");

//add fragment identifier
const links = document.getElementById("menu").getElementsByTagName("a");
for (let i = 0; i < links.length; i++) {
  links[i].href = `#${links[i].children[1].textContent}`;
}

//set initial fragment identifier
location.hash = "سعر / cm";
handleHashChange();

//enable price input when edit is clicked, also disable fieldset
const priceEdits = document.getElementsByClassName("edit-price");
for (let i = 0; i < priceEdits.length; i++) {
  priceEdits[i].addEventListener("click", handleEditMode);
}

//do the opposite of edit when the price input losses focus
const priceInputs = document.getElementsByClassName("editable-price");
for (let i = 0; i < priceInputs.length; i++) {
  priceInputs[i].addEventListener("focusout", handleEditModeFinish);
}

//show appropriate form when the fragment changes
window.addEventListener("hashchange", handleHashChange);

//update state when any radio input changes
const fieldsets = document.querySelectorAll("fieldset");
for (let i = 0; i < fieldsets.length; i++) {
  fieldsets[i].addEventListener("change", handleRadioChnage);
}

//update change when number inputs chnages
const numInputs = document.querySelectorAll('input[type="number"]');
for (let i = 0; i < numInputs.length; i++) {
  numInputs[i].addEventListener("change", handleNumInputChange);
}

function handleHashChange() {
  const hash = location.hash;
  const formContainer = document.getElementById("main-form");
  const header = formContainer.getElementsByTagName("h1")[0];
  const forms = formContainer.querySelectorAll("#main-form > div");
  const decodedHash = decodeURIComponent(hash).replace("#", "");
  header.textContent = decodedHash;

  for (let i = 0; i < forms.length; i++) {
    const name = forms[i].getAttribute("name");
    if (name === decodedHash) {
      forms[i].style.display = "flex";
    } else {
      forms[i].style.display = "none";
    }
  }
}

function handleRadioChnage(e) {
  //get current input label and current form
  const label = e.target.parentNode.querySelector("label");
  const currForm = e.target.closest(".nested-form");
  const formName = currForm.getAttribute("name");
  const priceInput = currForm.querySelector(".editable-price");

  //set current option
  const type = label.textContent.trim();
  formsState[formName].curr = type;
  if (priceInput) {
    //TODO : modify to work for any editable type
    const editable =
      formsState[formName]["سعر"] || formsState[formName]["النسبة"];
    console.log(editable);
    priceInput.value = editable[type];
  }

  calculate();
}

function handleNumInputChange(e) {
  e.target.blur();
  const label = e.target.parentNode.querySelector("label");
  const formName = e.target.closest(".nested-form").getAttribute("name");

  if (e.target.value === "") {
    e.target.value = 0;
  }

  e.target.value = parseFloat(e.target.value);

  if (label) {
    if (
      e.target.classList.contains("editable-price") &&
      formsState[formName].curr !== undefined
    ) {
      //this means it's a price input
      const type = formsState[formName].curr;
      formsState[formName][label.textContent][type] = e.target.value;
    } else {
      formsState[formName][label.textContent] = e.target.value;
    }
  } else {
    formsState[formName] = e.target.value;
  }

  calculate();
}

//activate edit mode
function handleEditMode(e) {
  const currInput = e.target.parentNode.querySelector(".editable-price");
  currInput.disabled = false;
  currInput.focus();

  const currRadioInputs = e.target
    .closest(".nested-form")
    .querySelector("fieldset");

  if (currRadioInputs) {
    currRadioInputs.disabled = true;
  }
}

//deactivate edit mode
function handleEditModeFinish(e) {
  e.target.disabled = true;

  const currRadioInputs = e.target
    .closest(".nested-form")
    .querySelector("fieldset");

  if (currRadioInputs) {
    currRadioInputs.disabled = false;
  }
}

//calculate final price and show it
function calculate(e) {
  const cmPrice =
    (formsState["سعر / cm"] *
      formsState["ابعاد"]["طول"] *
      formsState["ابعاد"]["عرض"]) /
    100;

  const cmPriceWithProfit =
    cmPrice *
    (1 +
      (parseFloat(formsState["تفاصيل"]["النسبة"][formsState["تفاصيل"].curr]) +
        parseFloat(formsState["اللغة"]["النسبة"][formsState["اللغة"].curr])) /
        100);

  const transformersPrice =
    formsState["محول"]["سعر"][formsState["محول"].curr] *
    formsState["محول"]["عدد"];

  console.log(transformersPrice);

  const spacersPrice = formsState["سبيسر"]["سعر"] * formsState["سبيسر"]["عدد"];

  console.log(spacersPrice);

  const hangersPrice = formsState["علاقة"]["سعر"] * formsState["علاقة"]["عدد"];

  let finalPrice =
    cmPriceWithProfit + transformersPrice + spacersPrice + hangersPrice;

  finalPrice = Math.round(finalPrice * 10) / 10;
  finalPriceElement.textContent = `${finalPrice} : السعر النهائي`;
}

// function handleLocalStorage() {
//   const localStorageObject = localStorage.getItem("stateObject");
//   if (localStorageObject !== null) {
//     traverseStateObject(JSON.parse(localStorageObject));
//   }
// }

// // Helper function
// function traverseStateObject(obj) {
//   const copy = {}; // Create an empty object to store the copy
//   for (const prop in obj) {
//     if (obj.hasOwnProperty(prop)) {
//       if (typeof obj[prop] === "object") {
//         // If the property is an object, recursively copy it
//         copy[prop] = copyObject(obj[prop]);
//       } else {
//         // If it's not an object, copy the property to the new object
//         if (prop === "سعر" || "النسبة") {
//           copy[prop] = obj[prop];
//         }
//       }
//     }
//   }
//   return copy;
// }

// state
