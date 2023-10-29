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
};

//add fragment identifier
const links = document.getElementById("menu").getElementsByTagName("a");
for (let i = 0; i < links.length; i++) {
  links[i].href = `#${links[i].children[1].textContent}`;
}

//set initial fragment identifier
location.hash = "سعر / cm";
handleHashChange();

//enable price Input when edit is clicked
const priceEdits = document.getElementsByClassName("edit-price");
for (let i = 0; i < priceEdits.length; i++) {
  priceEdits[i].addEventListener("click", handlePriceEdit);
}

//show appropriate form when the fragment changes
window.addEventListener("hashchange", handleHashChange);

//update state when any form field changes
const mainForm = document.getElementById("main-form");
console.log(mainForm);
mainForm.addEventListener("change", handleFormChange);

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

function handleFormChange(e) {
  //get state associated with current input
  const label = e.target.parentNode.getElementsByTagName("label")[0];
  const formName = e.target.closest(".nested-form").getAttribute("name");

  //assign value according to input type
  if (label) {
    if (e.target.type === "radio") {
      formsState[formName].curr = label.textContent;
    } else {
      //means that this is a price input for a given radio type
      if (
        formsState[formName].curr !== undefined &&
        label.textContent === "سعر"
      ) {
        const type = formsState[formName].curr;
        formsState[formName][label.textContent][type] = e.target.value;
      } else {
        formsState[formName][label.textContent] = e.target.value;
      }
    }
  } else {
    formsState[formName] = e.target.value;
  }

  console.log(formsState);
}

function handlePriceEdit(e) {
  console.log(e);
}
