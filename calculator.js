const display = document.getElementById("display");
let expression = "";
let justEvaluated = false;

function appendToDisplay(value) {
  if (justEvaluated) {
    if (/[0-9.]/.test(value)) {
      expression = "";
    }
    justEvaluated = false;
  }

  if (value === "-" && (expression === "" || /[+\-×÷]$/.test(expression))) {
    expression += value;
    display.value = expression;
    adjustFontSize();
    return;
  }

  if (expression === "0" && value !== "." && value !== "-") {
    expression = value;
  } else {
    expression += value;
  }

  display.value = expression;
  adjustFontSize();
}

function appendDecimal() {
  if (justEvaluated) {
    expression = "0";
    justEvaluated = false;
  }
  const lastNumber = expression.split(/[-+×÷]/).pop();
  if (!lastNumber.includes(".")) expression += ".";
  display.value = expression;
  adjustFontSize();
}

function clearAll() {
  expression = "";
  display.value = "0";
  justEvaluated = false;
  adjustFontSize();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  display.value = expression || "0";
  adjustFontSize();
}

function evaluateExpression() {
  if (!expression) return;

  let expr = expression.replace(/×/g, "*").replace(/÷/g, "/");
  expr = expr.replace(/[-+*/]$/, "");

  try {
    let result = Function(`return ${expr}`)();
    result = parseFloat(result.toFixed(8));

    display.value =
      result.toString().length > 12
        ? result.toExponential(5)
        : result.toString();

    expression = result.toString();
    justEvaluated = true;
  } catch {
    display.value = "Error";
    expression = "";
    justEvaluated = true;
  }

  adjustFontSize();
}

function adjustFontSize() {
  display.classList.toggle("small-font", display.value.length > 12);
}

document
  .querySelectorAll(".number, .operator")
  .forEach((btn) =>
    btn.addEventListener("click", () => appendToDisplay(btn.textContent))
  );

document.querySelector(".decimal").addEventListener("click", appendDecimal);
document.querySelector(".clear").addEventListener("click", clearAll);
document.querySelector(".backspace").addEventListener("click", deleteLast);
document.querySelector(".equals").addEventListener("click", evaluateExpression);

window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") appendToDisplay(e.key);

  if (["+", "-", "*", "/"].includes(e.key)) {
    const op = e.key === "*" ? "×" : e.key === "/" ? "÷" : e.key;
    appendToDisplay(op);
  }

  if (e.key === ".") appendDecimal();
  if (e.key === "Backspace") deleteLast();
  if (e.key === "Delete") clearAll();

  if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    evaluateExpression();
  }
});
