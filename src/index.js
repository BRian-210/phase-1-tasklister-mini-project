document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("create-task-form");
  const taskList = document.getElementById("tasks");
  const countDisplay = document.getElementById("count");

  const updateTaskCount = () => {
    countDisplay.textContent = taskList.querySelectorAll("li").length.toString();
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const taskDesc = document.getElementById("new-task-description").value;
    const priority = document.getElementById("priority").value;

    if (taskDesc.trim() === "") return;

    const li = document.createElement("li");
    li.textContent = taskDesc;
    li.className = priority;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", () => {
      li.remove();
      updateTaskCount();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    updateTaskCount();
    form.reset();
  });
});
//     formInput.value = 'Buy groceries';
// 
//     const event = new dom.window.Event('submit', {
//       bubbles: true,
//       cancelable: true
//     });
//     event.preventDefault = () => {};