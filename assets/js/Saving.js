document.getElementById("addGoal").addEventListener("click", function () {
    const goalName = document.getElementById("goalName").value;
    const targetAmount = parseFloat(document.getElementById("targetAmount").value);
    const savedAmount = parseFloat(document.getElementById("savedAmount").value);

    if (!goalName || isNaN(targetAmount) || isNaN(savedAmount)) {
      alert("Please fill in all fields correctly.");
      return;
    }

    addGoalToList(goalName, targetAmount, savedAmount);
    document.getElementById("goalName").value = "";
    document.getElementById("targetAmount").value = "";
    document.getElementById("savedAmount").value = "";
  });

  function addGoalToList(goalName, targetAmount, savedAmount) {
    const goalItems = document.getElementById("goalItems");

    const li = document.createElement("li");
    li.className = "goal-item";

    const progress = Math.min((savedAmount / targetAmount) * 100, 100);

    li.innerHTML = `
      <div class="goal-header">
        <div>
          <strong>${goalName}</strong><br />
          <small>Target: $${targetAmount.toFixed(2)}, Saved: $<span class="saved-amount">${savedAmount.toFixed(2)}</span></small>
        </div>
        <small class="progress-percentage">${progress.toFixed(1)}%</small>
      </div>
      <div class="progress-bar">
        <span style="width: ${progress}%;"></span>
      </div>
      <div class="update-form">
        <input type="number" class="update-saved" placeholder="Add Amount" />
        <button class="update-button">Update</button>
      </div>
    `;

    // Add event listener for the update button
    li.querySelector(".update-button").addEventListener("click", function () {
      const addAmount = parseFloat(li.querySelector(".update-saved").value);
      if (isNaN(addAmount) || addAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      const currentSaved = parseFloat(li.querySelector(".saved-amount").innerText);
      const newSavedAmount = currentSaved + addAmount;
      const newProgress = Math.min((newSavedAmount / targetAmount) * 100, 100);

      // Update saved amount and progress bar
      li.querySelector(".saved-amount").innerText = newSavedAmount.toFixed(2);
      li.querySelector(".progress-percentage").innerText = `${newProgress.toFixed(1)}%`;
      li.querySelector(".progress-bar span").style.width = `${newProgress}%`;

      // Clear the input field
      li.querySelector(".update-saved").value = "";
    });

    goalItems.appendChild(li);
  }
