document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-task-form");
  const taskList = document.getElementById("tasks");
  const countDisplay = document.getElementById("count");
  const errorMessage = document.getElementById("error-message");
  const successMessage = document.getElementById("success-message");

  function updateTaskCount() {
    countDisplay.textContent = taskList.querySelectorAll("li").length.toString();
  }

  function showMessage(element) {
    element.classList.remove("hidden");
    setTimeout(() => element.classList.add("hidden"), 2000);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskDesc = document.getElementById("new-task-description").value.trim();
    const priority = document.getElementById("priority").value;

    if (!taskDesc) {
      showMessage(errorMessage);
      return;
    }

    const li = createTaskElement(taskDesc, priority);
    taskList.appendChild(li);
    updateTaskCount();
    form.reset();
    showMessage(successMessage);
  });

  function createTaskElement(description, priority) {
    const li = document.createElement("li");
    li.className = priority;

    const span = document.createElement("span");
    span.textContent = description;
    span.classList.add("task-text");

    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", () => startEditTask(li, span, priority));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X"; // Changed from "❌" to "X" for test compatibility
    deleteBtn.addEventListener("click", () => {
      li.remove();
      updateTaskCount();
    });

    li.append(span, editBtn, deleteBtn);
    return li;
  }

  function startEditTask(li, span, currentPriority) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;

    const prioritySelect = document.createElement("select");
    ["low", "medium", "high"].forEach(level => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
      if (level === currentPriority) option.selected = true;
      prioritySelect.appendChild(option);
    });

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "💾 Save";

    li.innerHTML = "";
    li.append(input, prioritySelect, saveBtn);

    saveBtn.addEventListener("click", () => {
      const newDesc = input.value.trim();
      const newPriority = prioritySelect.value;

      if (!newDesc) {
        alert("Task description cannot be empty.");
        return;
      }

      const updatedTask = createTaskElement(newDesc, newPriority);
      taskList.replaceChild(updatedTask, li);
      updateTaskCount();
    });
  }
});
