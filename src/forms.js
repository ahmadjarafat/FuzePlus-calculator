let formsState = {
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

//handle local storage if the app has been visited before
handleLocalStorage();

//set initial fragment identifier
location.hash = "ابعاد";
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

//update state when number inputs chnage
const numInputs = document.querySelectorAll('input[type="number"]');
for (let i = 0; i < numInputs.length; i++) {
  numInputs[i].addEventListener("change", handleNumInputChange);
}

//handle focus and unfocus of number inputs
for (let i = 0; i < numInputs.length; i++) {
  numInputs[i].addEventListener("focus", handleNumInputFocus);
  numInputs[i].addEventListener("blur", handleNumInputBlur);
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

    priceInput.value = editable[type];
  }

  calculate();
  localStorage.setItem("stateObject", JSON.stringify(formsState));
}

function handleNumInputChange(e) {
  e.target.blur();
  const label = e.target.parentNode.querySelector("label");
  const formName = e.target.closest(".nested-form").getAttribute("name");

  if (e.target.value === "") {
    e.target.value = 0;
  }
  e.target.value = parseFloat(e.target.value);
  if (e.target.value < 0) {
    e.target.value = 0;
  }

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
  localStorage.setItem("stateObject", JSON.stringify(formsState));
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

function handleNumInputFocus(e) {
  if (e.target.value === "0") {
    e.target.value = "";
  }
}

function handleNumInputBlur(e) {
  if (e.target.value === "") {
    e.target.value = 0;
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

  const spacersPrice = formsState["سبيسر"]["سعر"] * formsState["سبيسر"]["عدد"];

  const hangersPrice = formsState["علاقة"]["سعر"] * formsState["علاقة"]["عدد"];

  let finalPrice =
    cmPriceWithProfit + transformersPrice + spacersPrice + hangersPrice;

  finalPrice = Math.round(finalPrice * 10) / 10;
  finalPriceElement.textContent = `${finalPrice} : السعر النهائي`;
}

// populate editable inputs with corresponding values from the state object
function populateEditableInputs() {
  const editableElements = document.querySelectorAll(".editable-price");
  console.log(editableElements);

  editableElements.forEach((element) => {
    const nestedFormElement = element.closest(".nested-form");
    const formName = nestedFormElement.getAttribute("name");

    if (typeof formsState[formName] === "object") {
      const editable =
        formsState[formName]["سعر"] || formsState[formName]["النسبة"] || 0;

      if (typeof editable === "object") {
        element.value = editable[formsState[formName].curr];
      } else {
        element.value = editable;
      }
    } else if (formsState[formName] !== undefined) {
      element.value = formsState[formName];
    }

    //set the current radio input on the UI
    const fieldset = nestedFormElement.querySelector("fieldset");

    if (fieldset) {
      const controls = fieldset.querySelectorAll("div");
      controls.forEach((control) => {
        const name = control.querySelector("label").textContent.trim();
        console.log(name, formsState[formName].curr);
        if (name === formsState[formName].curr) {
          control.querySelector("input").checked = true;
        } else {
          control.querySelector("input").checked = false;
        }
      });
    }
  });
}

function handleLocalStorage() {
  const localStorageObject = localStorage.getItem("stateObject");
  if (localStorageObject !== null) {
    formsState = traverseStateObject(JSON.parse(localStorageObject));
    populateEditableInputs();
    calculate();
  }
}

// Helper function
function traverseStateObject(obj) {
  const copy = {}; // Create an empty object to store the copy
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === "object") {
        // If the property is an object, recursively copy it
        copy[prop] = traverseStateObject(obj[prop]);
      } else {
        // If it's not an object, copy the property to the new object
        if (prop === "عرض" || prop === "عدد" || prop === "طول") {
          copy[prop] = 0;
        } else {
          copy[prop] = obj[prop];
        }
      }
    }
  }
  return copy;
}
