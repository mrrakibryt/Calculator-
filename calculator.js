// Reset body style
document.body.style.cssText = `
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

// Calculator container (responsive width)
const calculator = document.createElement("div");
calculator.style.cssText = `
  background:rgb(36, 175, 230);
  padding: 25px;
  border-radius: 25px;
  border: 2px solid #444;
  box-shadow: 8px 8px 20pxrgb(156, 194, 216), -8px -8px 20px #3a3a4a;
  width: 340px;
  max-width: 90vw;
  box-sizing: border-box;
`;
document.body.appendChild(calculator);

// Display input
const display = document.createElement("input");
display.disabled = true;
display.placeholder = "0";
display.style.cssText = `
  width: 100%;
  height: 60px;
  font-size: 26px;
  padding: 10px;
  margin-bottom: 15px;
  border: none;
  border-radius: 15px;
  background:rgb(156, 192, 216);
  color: #fff;
  text-align: right;
  box-shadow: inset -2px -2px 5px #4a4a6a, inset 2px 2px 5px #1e1e2f;
`;
calculator.appendChild(display);

// Button layout and labels
const buttons = [
  "AC", "", "", "⌫",
  "7", "8", "9", "÷",
  "4", "5", "6", "×",
  "1", "2", "3", "-",
  "0", ".", "=", "+"
];

const layout = document.createElement("div");
layout.style.cssText = `
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`;
calculator.appendChild(layout);

// Button colors
const operatorColor = "#ff7675";     // light red
const equalColor = "#74b9ff";        // light blue
const clearColor = "#d63031";        // red
const numberColor = "#00b894";       // emerald green
const specialColor = "#636e72";      // gray

// Helper functions
function isOperator(char) {
  return ["+", "-", "×", "÷"].includes(char);
}

function getLastNumber(str) {
  const match = str.match(/(\d+\.?\d*)$/);
  return match ? match[0] : "";
}

function insertValue(val) {
  const lastChar = display.value.slice(-1);

  // Prevent multiple decimals in one number
  if (val === ".") {
    const lastNumber = getLastNumber(display.value);
    if (lastNumber.includes(".")) return;
    if (display.value === "" || isOperator(lastChar)) {
      // Add leading 0 if decimal pressed first or after operator
      display.value += "0";
    }
  }

  // Operator logic
  if (isOperator(val)) {
    if (display.value === "") {
      if (val === "-") {
        display.value += val; // allow starting with minus
      }
      return;
    }
    if (isOperator(lastChar)) {
      // Replace last operator with new one
      display.value = display.value.slice(0, -1) + val;
    } else {
      display.value += val;
    }
    return;
  }

  // Normal input
  display.value += val;
}

function calculate() {
  if (!display.value) return;

  let expr = display.value
    .replace(/÷/g, "/")
    .replace(/×/g, "*");

  // Remove trailing operator if any
  if (isOperator(expr.slice(-1))) expr = expr.slice(0, -1);

  try {
    const result = eval(expr);
    display.value = result === undefined ? "" : result;
  } catch {
    display.value = "Error";
  }
}

function getButtonColor(text) {
  if (text === "AC") return clearColor;
  if (text === "=") return equalColor;
  if (text === "⌫") return specialColor;
  if (isOperator(text)) return operatorColor;
  return numberColor;
}

function createButton(text) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.style.cssText = `
    height: 60px;
    font-size: 22px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    color: white;
    cursor: pointer;
    box-shadow: 3px 3px 6px #000;
    transition: 0.2s;
    background: ${getButtonColor(text)};
  `;

  if (text === "") {
    btn.style.visibility = "hidden";
    btn.disabled = true;
    layout.appendChild(btn);
    return;
  }

  btn.onmouseover = () => {
    btn.style.transform = "scale(1.05)";
    btn.style.opacity = "0.95";
    btn.style.boxShadow = "0 0 10px rgba(255,255,255,0.2)";
  };
  btn.onmouseleave = () => {
    btn.style.transform = "scale(1)";
    btn.style.opacity = "1";
    btn.style.boxShadow = "3px 3px 6px #000";
  };

  btn.onclick = () => {
    if (text === "AC") {
      display.value = "";
    } else if (text === "⌫") {
      display.value = display.value.slice(0, -1);
    } else if (text === "=") {
      calculate();
    } else {
      insertValue(text);
    }
  };

  layout.appendChild(btn);
}

// Create buttons
buttons.forEach(createButton);

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    insertValue(key);
  } else if (["+", "-", "*", "/", "."].includes(key)) {
    const symbol = key === "*" ? "×" : key === "/" ? "÷" : key;
    insertValue(symbol);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    display.value = display.value.slice(0, -1);
  } else if (key === "Escape") {
    display.value = "";
  }
});

// Responsive display and button sizing
function updateDisplayStyle() {
  if (window.innerWidth < 400) {
    display.style.fontSize = "20px";
    display.style.height = "50px";
  } else {
    display.style.fontSize = "26px";
    display.style.height = "60px";
  }
}
updateDisplayStyle();
window.addEventListener("resize", updateDisplayStyle);

function updateButtonSize() {
  const btns = layout.querySelectorAll("button");
  btns.forEach(btn => {
    if (window.innerWidth < 400) {
      btn.style.height = "50px";
      btn.style.fontSize = "18px";
    } else {
      btn.style.height = "60px";
      btn.style.fontSize = "22px";
    }
  });
}
updateButtonSize();
window.addEventListener("resize", updateButtonSize);
