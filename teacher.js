if (localStorage.getItem("teacherLoggedIn") !== "true") {
  alert("⚠ Access Denied! Please login first.");
  window.location.href = "teacher-login.html";
}

const uploadForm = document.getElementById("uploadForm");
const msg = document.getElementById("msg");
const tableBody = document.querySelector("#resultsTable tbody");

uploadForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const roll = document.getElementById("roll").value.trim();
  const name = document.getElementById("name").value.trim();
  const studentClass = document.getElementById("class").value.trim();
  const marks = document.getElementById("marks").value.trim();
  const grade = document.getElementById("grade").value.trim();

  if (!roll || !name || !studentClass || !marks || !grade) {
    msg.textContent = "⚠ Please fill all fields.";
    msg.style.color = "red";
    return;
  }

  let students = JSON.parse(localStorage.getItem("students")) || {};
  students[roll] = { name, class: studentClass, total: marks, grade };
  localStorage.setItem("students", JSON.stringify(students));

  msg.textContent = "✅ Result Saved Successfully!";
  msg.style.color = "green";
  uploadForm.reset();
  loadResults();
});

function loadResults() {
  tableBody.innerHTML = "";
  const students = JSON.parse(localStorage.getItem("students")) || {};

  for (let roll in students) {
    const s = students[roll];
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${roll}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.total}</td>
      <td>${s.grade}</td>
      <td><button onclick="editResult('${roll}')">Edit</button></td>
    `;
    tableBody.appendChild(row);
  }
}

function editResult(roll) {
  const students = JSON.parse(localStorage.getItem("students")) || {};
  const s = students[roll];
  document.getElementById("roll").value = roll;
  document.getElementById("name").value = s.name;
  document.getElementById("class").value = s.class;
  document.getElementById("marks").value = s.total;
  document.getElementById("grade").value = s.grade;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function logout() {
  localStorage.removeItem("teacherLoggedIn");
  window.location.href = "teacher-login.html";
}

loadResults();
