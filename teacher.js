// Check teacher login (same as original)
if (localStorage.getItem("teacherLoggedIn") !== "true") {
  alert("⚠ Access Denied! Please login first.");
  window.location.href = "teacher-login.html";
}

const uploadForm = document.getElementById("uploadForm");
const msg = document.getElementById("msg");
const tableBody = document.querySelector("#resultsTable tbody");

// Save or update a student record
uploadForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const roll = document.getElementById("roll").value.trim();
  const reg  = document.getElementById("reg").value.trim();
  const name = document.getElementById("name").value.trim();
  const studentClass = document.getElementById("class").value.trim();
  const marks = document.getElementById("marks").value.trim();
  const grade = document.getElementById("grade").value.trim();

  if (!roll || !reg || !name || !studentClass || !marks || !grade) {
    msg.textContent = "⚠ Please fill all fields.";
    msg.style.color = "red";
    return;
  }

  // Load existing students map (keyed by roll)
  let students = JSON.parse(localStorage.getItem("students")) || {};

  // Save – now include 'reg' in the stored object
  students[roll] = { name, reg, class: studentClass, total: marks, grade };

  localStorage.setItem("students", JSON.stringify(students));

  msg.textContent = "✅ Result Saved Successfully!";
  msg.style.color = "green";
  uploadForm.reset();
  loadResults();
});

// Populate results table
function loadResults() {
  tableBody.innerHTML = "";
  const students = JSON.parse(localStorage.getItem("students")) || {};

  // Sort by numeric roll if possible (helpful)
  const rolls = Object.keys(students).sort((a,b) => {
    const na = Number(a), nb = Number(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });

  for (let roll of rolls) {
    const s = students[roll];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${roll}</td>
      <td>${s.reg || ""}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
      <td>
        <button onclick="editResult('${roll}')">Edit</button>
        <button onclick="deleteResult('${roll}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

// Edit: fill form with stored values
function editResult(roll) {
  const students = JSON.parse(localStorage.getItem("students")) || {};
  const s = students[roll];
  if (!s) return alert("Record not found.");
  document.getElementById("roll").value = roll;
  document.getElementById("reg").value = s.reg || "";
  document.getElementById("name").value = s.name;
  document.getElementById("class").value = s.class;
  document.getElementById("marks").value = s.total;
  document.getElementById("grade").value = s.grade;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Delete record (with confirmation)
function deleteResult(roll) {
  if (!confirm("Delete result for roll " + roll + " ? This cannot be undone.")) return;
  const students = JSON.parse(localStorage.getItem("students")) || {};
  delete students[roll];
  localStorage.setItem("students", JSON.stringify(students));
  loadResults();
}

// Logout (same as original)
function logout() {
  localStorage.removeItem("teacherLoggedIn");
  window.location.href = "teacher-login.html";
}

// Initial load
loadResults();
