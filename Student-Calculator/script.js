const addRowBtn = document.getElementById("addRowBtn");
const calculateBtn = document.getElementById("calculateBtn");
const clearBtn = document.getElementById("clearBtn");
const gradesTable = document.getElementById("gradesTable").querySelector("tbody");
const totalMarksEl = document.getElementById("totalMarks");
const letterGradeEl = document.getElementById("letterGrade");

let rowCount = 1;
const maxRows = 6;

// Create a new assignment row
function createRow(number) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Assignment ${number} (Optional)"></td>
    <td><input type="number" min="0" max="100" step="1" placeholder="0-100"></td>
    <td><input type="number" min="1" step="1" placeholder="Weight"></td>
    <td><button class="deleteRowBtn">Delete</button></td>
  `;
  return row;
}

// Prevent decimals / non-numeric input
document.addEventListener("input", (e) => {
  if (e.target.type === "number") {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  }
});

// Add row
addRowBtn.addEventListener("click", () => {
  if (rowCount >= maxRows) {
    showError(`You can only add up to ${maxRows} assignments.`);
    return;
  }
  rowCount++;
  gradesTable.appendChild(createRow(rowCount));
});

// Delete row
gradesTable.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteRowBtn")) {
    const row = e.target.closest("tr");
    if (row === gradesTable.querySelector("tr:first-child")) {
      showError("The first assignment cannot be deleted.");
      return;
    }
    row.remove();
    rowCount--;
  }
});

// Clear table
clearBtn.addEventListener("click", () => {
  gradesTable.innerHTML = `
    <tr>
      <td><input type="text" placeholder="Assignment 1 (Optional)"></td>
      <td><input type="number" min="0" max="100" step="1" placeholder="0-100"></td>
      <td><input type="number" min="1" step="1" placeholder="Weight"></td>
      <td></td>
    </tr>
  `;
  rowCount = 1;
  totalMarksEl.textContent = "0";
  letterGradeEl.textContent = "";
  letterGradeEl.className = "";
});

// Calculate grade
calculateBtn.addEventListener("click", () => {
  let scores = [];
  let weights = [];
  let totalWeight = 0;

  const rows = gradesTable.querySelectorAll("tr");
  for (let row of rows) {
    const inputs = row.querySelectorAll("input");
    let score = parseInt(inputs[1].value, 10);
    let weight = parseInt(inputs[2].value, 10);

    if (!Number.isInteger(score) || score < 0 || score > 100) {
      showError("Please enter a valid whole number score (0-100).");
      return;
    }
    if (!Number.isInteger(weight) || weight <= 0) {
      showError("Please enter a valid whole number weight (>0).");
      return;
    }

    scores.push(score);
    weights.push(weight);
    totalWeight += weight;
  }

  if (totalWeight !== 100) {
    showError("Total weight for all assignments must equal 100%.");
    return;
  }

  const percentage = Math.ceil(calculateWeightedAverage(scores, weights));
  totalMarksEl.textContent = percentage;

  const { grade, desc, color } = getLetterGrade(percentage);
  letterGradeEl.textContent = `${grade} – ${desc}`;
  letterGradeEl.className = color;
});

// Weighted average
function calculateWeightedAverage(scores, weights) {
  let totalWeighted = 0, totalWeight = 0;
  for (let i = 0; i < scores.length; i++) {
    totalWeighted += scores[i] * weights[i];
    totalWeight += weights[i];
  }
  return totalWeighted / totalWeight;
}

// Grade mapping
function getLetterGrade(percent) {
  if (percent >= 90) return { grade: 'A', desc: 'Excellent', color: 'grade-A' };
  if (percent >= 80) return { grade: 'B', desc: 'Very Good', color: 'grade-B' };
  if (percent >= 70) return { grade: 'C', desc: 'Good', color: 'grade-C' };
  if (percent >= 60) return { grade: 'D', desc: 'Satisfactory', color: 'grade-D' };
  if (percent >= 50) return { grade: 'E', desc: 'Pass', color: 'grade-E' };
  if (percent >= 40) return { grade: 'F', desc: 'Fail', color: 'grade-F' };
  return { grade: 'U', desc: 'Ungraded (Not Achieved)', color: 'grade-U' };
}

// =============
// Popup system
// =============
function showError(message) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popupMessage");
  popupMessage.textContent = message;
  popup.style.display = "flex";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
}

// Close by button
document.getElementById("closePopup").addEventListener("click", hidePopup);

// Close by clicking outside
document.getElementById("popup").addEventListener("click", (e) => {
  if (e.target.id === "popup") hidePopup();
});

// Close by ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hidePopup();
});
