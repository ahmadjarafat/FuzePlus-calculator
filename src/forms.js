const formsState = {
  محول: { curr: "كبير", سعر: { كبير: 0, متوسط: 0, صغير: 0 }, عدد: 0 },
  "سعر / cm": 0,
  علاقة: { سعر: 0, عدد: 0 },
  سبيسر: { سعر: 0, عدد: 0 },
  اللغة: {
    curr: "عربي",
    مشبك: true,
    سعر: { انجليزي: 0, عربي: 0, "انجليزي مشبك": 0 },
  },
  تفاصيل: { curr: "كثير", سعر: { كثير: 0, متوسط: 0, قليل: 0 } },
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
  priceEdits[i].addEventListener("click", handlePriceEdit);
}

//do the opposite of edit when the price input losses focus
const priceInputs = document.getElementsByClassName("price-input");
for (let i = 0; i < priceInputs.length; i++) {
  priceInputs[i].addEventListener("focusout", handlePriceEditFinish);
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
  const priceInput = currForm.querySelector(".price-input");
  console.log(priceInput);

  //set current option
  const type = label.textContent.trim();
  formsState[formName].curr = type;
  if (priceInput) {
    priceInput.value = formsState[formName]["سعر"][type];
  }
  calculate();
}

function handleNumInputChange(e) {
  e.target.blur();
  const label = e.target.parentNode.querySelector("label");
  const formName = e.target.closest(".nested-form").getAttribute("name");

  if (label) {
    if (
      label.textContent === "سعر" &&
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

// function handleFormChange(e) {
//   //get state associated with current input
//   const label = e.target.parentNode.getElementsByTagName("label")[0];
//   const formName = e.target.closest(".nested-form").getAttribute("name");

//   //assign value according to input type
//   if (label) {
//     if (e.target.type === "radio") {
//       formsState[formName].curr = label.textContent;
//     } else {
//       //means that this is a price input for a given radio type
//       if (
//         formsState[formName].curr !== undefined &&
//         label.textContent === "سعر"
//       ) {
//         const type = formsState[formName].curr;
//         formsState[formName][label.textContent][type] = e.target.value;
//       } else {
//         formsState[formName][label.textContent] = e.target.value;
//       }
//     }
//   } else {
//     formsState[formName] = e.target.value;
//   }

//   console.log(formsState);
// }

function handlePriceEdit(e) {
  const currInput = e.target.parentNode.querySelector(".price-input");
  currInput.disabled = false;
  currInput.focus();
  const currRadioInputs = e.target
    .closest(".nested-form")
    .querySelector("fieldset");

  if (currRadioInputs) {
    currRadioInputs.disabled = true;
  }
}

function handlePriceEditFinish(e) {
  e.target.disabled = true;

  const currRadioInputs = e.target
    .closest(".nested-form")
    .querySelector("fieldset");

  if (currRadioInputs) {
    currRadioInputs.disabled = false;
  }
}

function calculate(e) {
  const finalPrice =
    (formsState["سعر / cm"] *
      formsState["ابعاد"]["طول"] *
      formsState["ابعاد"]["عرض"]) /
    100;

  finalPriceElement.textContent = `${finalPrice} : السعر النهائي`;
}
