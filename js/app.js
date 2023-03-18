class UI {
  constructor() {
    this.budgetFeedback = document.querySelector(".budget-feedback");
    this.expenseFeedback = document.querySelector(".expense-feedback");
    this.budgetForm = document.getElementById("budget-form");
    this.budgetInput = document.getElementById("budget-input");
    this.budgetAmount = document.getElementById("budget-amount");
    this.expenseAmount = document.getElementById("expense-amount");
    this.balance = document.getElementById("balance");
    this.balanceAmount = document.getElementById("balance-amount");
    this.expenseForm = document.getElementById("expense-form");
    this.expenseInput = document.getElementById("expense-input");
    this.amountInput = document.getElementById("amount-input");
    this.expenseList = document.getElementById("expense-list");
    this.itemList = JSON.parse(localStorage.getItem('budget'))
    this.itemID = 0
    if(this.itemList === null || this.itemList.length < 0) {
      this.itemList = [];
    }
  }

  render() {
    const x = JSON.parse(localStorage.getItem('budget'));
    if(localStorage.getItem('budget').length > 0) this.budgetAmount.textContent = JSON.parse(localStorage.getItem('total'));
    x.forEach(x => this.addExpense(x));
    this.showBalance();
  }

  // * submit budget method
  submitBudgetMethod() {
    console.log("hello from ESC6");
    let value = this.budgetInput.value;
    console.log(value);
    if (!value) {
      this.showAlert("budgetFeedback");
      this.budgetAmount.textContent = "0";
    } else {
      this.budgetAmount.textContent = value;
      this.save()
      this.budgetInput.value = "";
      this.showBalance();

    }
  }

  // * priority method
  // * calcula el balance obtiniendo todos nuestro expenses y restandolos de budget
  showBalance() {
    const expense = this.totalExpense();
    const budget = parseInt(this.budgetAmount.textContent);
    const total = budget - expense;
    this.balanceAmount.textContent = total;
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    } else if (total > 0) {
      this.balance.classList.remove("showRed", "ShowBlack");
      this.balance.classList.add("showGreen");
    } else if (total === 0) {
      this.balance.classList.remove("showRed", "ShowGreen");
      this.balance.classList.add("showBlack");
    }
  }

  submitExpenseForm() {
    let expenseValue = this.expenseInput.value;
    let amountValue = this.amountInput.value;
    if (!expenseValue || !amountValue) {
      
      this.showAlert("expenseFeedback");
    } else {
      const amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      // const budget = parseInt(this.budgetAmount.textContent);
      // const total = budget - amount
      // console.log(amount)
      // this.balanceAmount.textContent = total ;
      // this.expenseAmount.textContent = amount;
      let expense = {
        id: this.itemID++,
        title: expenseValue,
        amount: amount,
      };
      this.itemList.push(expense);
      this.addExpense(expense)
      this.save();
      this.showBalance()
    }
  }

  save() {
    localStorage.setItem("budget", JSON.stringify(this.itemList));
    localStorage.setItem("total", JSON.stringify(parseInt(this.budgetAmount.textContent)));
  }

  removeExpense(id) {
    const item = this.itemList.find(item => item.id === id);
    console.log('aqui', item)
    console.log('todos los xd', this.itemList)
    this.expenseAmount.textContent = parseInt(this.expenseAmount.textContent) - item.amount;
    this.itemList = this.itemList.filter(i => i.id !== item.id)
    this.save();
    return item;
  }

  editExpense(e) {
    let id = parseInt(e.dataset.id);
    let parent = e.parentElement.parentElement.parentElement;
    // * remove from dom
    this.expenseList.removeChild(parent);
    const item = this.removeExpense(id);
    this.expenseInput.value = item.title;
    this.amountInput.value = item.amount;
  }

  deleteExpense(e) {
    let id = parseInt(e.dataset.id);
    let parent = e.parentElement.parentElement.parentElement;
    // * remove from dom
    this.expenseList.removeChild(parent);
    const item = this.removeExpense(id);
  }

  addExpense(expense) {
    const div = document.createElement("div");
    div.classList.add("expense");
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">
      <h6 class="expense-title mb-0 text-uppercase list-item">${expense.title}</h6>
      <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
      <div class="expense-icons list-item">
      <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
        <i class="fas fa-edit"></i>
      </a>
      <a href="#" class="delete-icon" data-id="${expense.id}">
       <i class="fas fa-trash"></i>
      </a>
      </div>
    </div>
    `;
    this.expenseList.appendChild(div)
  }

  // * priority method
  // * la clave
  totalExpense() {

    let total = 0;
    if(this.itemList.length > 0) {
      total = this.itemList.reduce(function(acc, curr) {
        acc += curr.amount;
        return acc
      }, 0)
    } else {
      total = parseInt(this.expenseAmount.textContent);
    }
    this.expenseAmount.textContent = total;
    return total;

    
    return expenses;
  }

  showAlert(id) {
    this[id].classList.add("showItem");
    this[id].innerHTML = `<p>value cannot be empty or negative</p>`;
    setTimeout(() => {
      this[id].classList.remove("showItem");
    }, 1500);
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");

  // * new instance of UI CLASS
  const ui = new UI();
  ui.render()

  // * expense form
  budgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.submitBudgetMethod();
  });

  // * expense for submit
  expenseForm.addEventListener("submit", function (e) {
    e.preventDefault();
    ui.submitExpenseForm();
  });

  // * expense click
  expenseList.addEventListener("click", function (e) {
    console.log("xd")
    if(e.target.parentElement.classList.contains('edit-icon')) {
      console.log("Xd")
      ui.editExpense(e.target.parentElement)
    }
    if(e.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(e.target.parentElement)
      console.log(e.target.parentElement)
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
});
