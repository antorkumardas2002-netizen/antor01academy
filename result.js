const form = document.getElementById("resultForm");
const resultBox = document.getElementById("resultDisplay");

form.addEventListener("submit", function(e){
  e.preventDefault();

  const roll = document.getElementById("roll").value.trim();
  const reg = document.getElementById("reg").value.trim();
  const students = JSON.parse(localStorage.getItem("students")) || {};

  if(!students[roll]){
    alert("❌ No result found for this Roll Number."); 
    resultBox.style.display = "none";
    return;
  }

  const s = students[roll];

  if(s.reg !== reg){
    alert("❌ Registration Number does not match the Roll Number."); 
    resultBox.style.display = "none";
    return;
  }

  // Display result
  document.getElementById("studentName").textContent = s.name;
  document.getElementById("studentRoll").textContent = s.roll;
  document.getElementById("studentReg").textContent = s.reg;
  document.getElementById("studentClass").textContent = s.class;
  document.getElementById("totalMarks").textContent = s.total;
  document.getElementById("studentGrade").textContent = s.grade;
  resultBox.style.display = "block";
});
