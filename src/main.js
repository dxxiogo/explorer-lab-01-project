import "./css/index.css"
import IMask from "imask";

function setCardType (type){
  const cardColor01 = document.querySelector(".cc-bg svg g:nth-child(1) > path");
  const cardColor2 = document.querySelector(".cc-bg svg g:nth-child(2) > path");
  const ccLogo = document.querySelector(".cc-logo > span:nth-child(2) > img");
  
  const colors = {
    visa: ["#2D57F2", "#436D99"],
    mastercard: ["#C69347", "#C69347"],
    default: ["black", "gray"]
  }
   const logos = {
     visa: "/cc-visa.svg",
     mastercard: "/cc-mastercard.svg",
     default:"/cc-default.svg"
   }
  cardColor01.setAttribute("fill", colors[`${type}`][0]);
  cardColor2.setAttribute("fill", colors[`${type}`][1]);
  ccLogo.setAttribute("src", logos[type]);

} ;

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");

const securityCodePattern = {
  mask: '0000'
};
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationCode = document.querySelector("#expiration-date");

const expirationCodePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
};

const expirationCodeMasked = IMask(expirationCode, expirationCodePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{1,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    }
  ],
  dispatch: function (appendend, dynamicMasked) {
    const number = (dynamicMasked.value + appendend).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function (item){
        return number.match(item.regex);
      });
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const cardHolder = document.querySelector("#card-holder");

cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
    ccHolder.innerText = cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value; 
}) 

document.querySelector("form").addEventListener('submit', (eve) => {
  eve.preventDefault();
});

document.querySelector(".add-card-btn").addEventListener('click', () => {
  alert("Cartão autenticado com sucesso!");
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCode.value);
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? 123 : code;
}


function updateCardNumber (number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}
cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-expiration .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;  

}

expirationCodeMasked.on('accept', () => {
  updateExpirationDate(expirationCodeMasked.value);
})