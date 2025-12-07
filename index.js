// blueprint to create objects
class Transaction{
    constructor(description, type, amount){
        this.description = description;
        this.type = type;
        this.amount = parseFloat(amount);
        this.id = Date.now();
    }
    getFormattedAmount(){
        return `$${this.amount.toFixed(2)}`;
    }
}

// manages all calculations
class BudgetCalculator{
    constructor(){
        this.incomes = [];
        this.expenses = [];
    }

    addIncome(description, amount){
        const errorEl = document.getElementById('incomeError');
        errorEl.textContent = '';

        if (!description || !amount || amount <=0){
            errorEl.textContent = 'Please enter a valid description and a number greater than 0.';
            return;
        }
        const income = new Transaction(description, 'income', amount);
        this.incomes.push(income);
        this.render();
    }

    addExpense(description, amount){
        const errorEl =document.getElementById('expenseError');
        errorEl.textContent = '';

        if (!description || !amount || amount <=0){
            errorEl.textContent = 'Please enter a valid description and a number greater than 0.'
            return;
        }

       const expense = new Transaction(description, 'expense', amount);
       this.expenses.push(expense);
       this.render();
    }

    deleteTransaction(id, type){
        if (type === 'income'){
            this.incomes = this.incomes.filter(t => t.id !== id); //keep all income except the one with matching ID
        } else{
            this.expenses = this.expenses.filter(t => t.id !== id); 
        } this.render ();
    }

    getTotalIncome(){
        return this.incomes.reduce((total, income) => {
            return total + income.amount;
        }, 0);
    }

    getTotalExpenses(){
        return this.expenses.reduce((total, expense) => {
            return total + expense.amount;
        }, 0);
    }

    getBalance(){
        return this.getTotalIncome() - this.getTotalExpenses();
    }

    //updates and shows income list and expense list
    render(){
        document.getElementById('totalIncome').textContent = `$${this.getTotalIncome().toFixed(2)}`;
        document.getElementById('totalExpenses').textContent = `$${this.getTotalExpenses().toFixed(2)}`;
        document.getElementById('balance').textContent = `$${this.getBalance().toFixed(2)}`;

        this.renderIncomeList();
        this.renderExpenseList();
    }

    renderIncomeList(){
        const list = document.getElementById('incomeList');


        if (this.incomes.length === 0){
            list.innerHTML = '<div class="empty">No income yet</div>';
            return;
        }
        //build the html for every income
        list.innerHTML = this.incomes.map(income => `
            <div class="transaction-item">
            <span class ="transaction-description">${income.description}</span>
            <span class="transaction-amount income-amount">
                ${income.getFormattedAmount()}
            </span>
            <button class="delete-button"
            onclick="app.deleteTransaction(${income.id},'income')"> Delete </button>
            </div>
            `).join('');
    }

    renderExpenseList(){
        const list= document.getElementById('expenseList');

        if (this.expenses.length === 0){
            list.innerHTML = '<div class= "empty"> No expenses yet </div>';
            return;
        }
        //build the html for every expense
        list.innerHTML = this.expenses.map(expense =>`
            <div class="transaction-item">
            <span class="transaction-description">${expense.description}</span>
            <span class="transaction-amount expense-amount">
                ${expense.getFormattedAmount()}
            </span>
            <button class="delete-button"
                onclick="app.deleteTransaction(${expense.id}, 'expense')">Delete</button>
            </div>
        `).join('');
    }
}

const app = new BudgetCalculator();

//clear input fields after getting input
app.addIncomeFromForm = function(){
    const description = document.getElementById('incomeDescription').value;
    const amount = document.getElementById('incomeAmount').value;

    this.addIncome(description, amount);

    document.getElementById('incomeDescription').value = '';
    document.getElementById('incomeAmount').value = '';
};

//clear input fields after getting input
app.addExpenseFromForm = function(){
    const description = document.getElementById('expenseDescription').value;
    const amount = document.getElementById('expenseAmount').value;

    this.addExpense(description, amount);

    document.getElementById('expenseDescription').value = '';
    document.getElementById('expenseAmount').value = '';
};

// load DOM for methods 
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('.income-button').addEventListener('click', function(){
        app.addIncomeFromForm();
    });
    document.querySelector('.expense-button').addEventListener('click', function(){
        app.addExpenseFromForm();
    });
});