import inquirer from "inquirer";
// Define a mapping for courses and their prices
const coursePrices = {
    "MS OFFICE": 1000,
    "Web Development": 2000,
    "App Development": 3000,
    "Python Programming": 1500,
};
// Define the Student class
class Student {
    static counter = 2027001;
    id;
    name;
    courses;
    balance;
    feeDueDates;
    constructor(name) {
        this.id = Student.counter++;
        this.name = name;
        this.courses = [];
        this.balance = 0;
        this.feeDueDates = {};
    }
    // Method to enroll a student in a course
    enroll_course(course) {
        if (!this.courses.includes(course)) {
            const price = coursePrices[course];
            if (this.balance >= price) {
                this.courses.push(course);
                console.log(`${this.name} enrolled in ${course} successfully.`);
            }
            else {
                console.log(`${this.name} does not have enough balance to enroll in ${course}.`);
            }
        }
        else {
            console.log(`${this.name} is already enrolled in ${course}.`);
        }
    }
    // Method to view a student balance
    view_balance() {
        console.log(`Balance for ${this.name}: Rs. ${this.balance}`);
    }
    // Method to add balance to student account
    add_balance(amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Rs. ${amount} added successfully to ${this.name}'s account.`);
            console.log(`New Balance: Rs. ${this.balance}`);
        }
        else {
            console.log(`Invalid amount. Please enter a valid amount to add.`);
        }
    }
    // Method to pay student fees
    pay_fees(amount, month) {
        if (amount > 0) {
            this.balance -= amount;
            console.log(`Rs. ${amount} fees paid successfully for ${this.name} for ${month}.`);
            console.log(`New Balance: Rs. ${this.balance}`);
            this.feeDueDates[month] = amount; // Record fee payment for the month
        }
        else {
            console.log(`Invalid amount. Please enter a valid fee amount.`);
        }
    }
    // Method to display student status
    show_status() {
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Courses: ${this.courses.join(", ")}`);
        console.log(`Balance: Rs. ${this.balance}`);
    }
}
// Defining a Student manager class to manage students
class Student_manager {
    students;
    feeCollection;
    dueDates;
    constructor() {
        this.students = [];
        this.feeCollection = {};
        this.dueDates = {};
        this.initialize_due_dates();
    }
    // Method to initialize due dates starting from August
    initialize_due_dates() {
        const months = ["August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June", "July"];
        const year = new Date().getFullYear();
        months.forEach((month, index) => {
            const monthIndex = index >= 5 ? index - 5 : index + 7; // Adjust for year-end wrap-around
            const date = new Date(year, monthIndex, 1);
            this.dueDates[month] = new Date(date.setMonth(date.getMonth() + 1) - 1); // Last day of the month
        });
    }
    // Method to add a new Student
    add_student(name) {
        let student = new Student(name);
        this.students.push(student);
        console.log(`Student: ${name} added successfully. Student ID: ${student.id}`);
    }
    // Method to enroll a student in a course
    enroll_student(student_id, course) {
        let student = this.find_student(student_id);
        if (student) {
            student.enroll_course(course);
        }
        else {
            console.log("Student not found. Please enter a correct student ID.");
        }
    }
    // Method to view a student balance
    view_student_balance(student_id) {
        let student = this.find_student(student_id);
        if (student) {
            student.view_balance();
        }
        else {
            console.log("Student not found. Please enter a correct student ID.");
        }
    }
    // Method to add balance to student account
    add_student_balance(student_id, amount) {
        let student = this.find_student(student_id);
        if (student) {
            student.add_balance(amount);
        }
        else {
            console.log("Student not found. Please enter a correct student ID.");
        }
    }
    // Method to pay student fees
    pay_student_fees(student_id, amount, month) {
        let student = this.find_student(student_id);
        if (student) {
            student.pay_fees(amount, month);
            this.record_fee_collection(amount, month);
        }
        else {
            console.log("Student not found. Please enter a correct student ID.");
        }
    }
    // Method to record fee collection by month
    record_fee_collection(amount, month) {
        if (this.feeCollection[month]) {
            this.feeCollection[month] += amount;
        }
        else {
            this.feeCollection[month] = amount;
        }
    }
    // Method to display month-wise fee collection
    show_fee_collection() {
        console.log("Month-wise Fee Collection:");
        for (const month in this.feeCollection) {
            console.log(`${month}: Rs. ${this.feeCollection[month]}`);
        }
    }
    // Method to display unpaid fees for the current month
    show_unpaid_fees() {
        const today = new Date();
        const currentMonth = today.toLocaleString('default', { month: 'long', year: 'numeric' });
        console.log(`Unpaid Fees for ${currentMonth}:`);
        this.students.forEach(student => {
            if (!student.feeDueDates[currentMonth]) {
                console.log(`Student ID: ${student.id}, Name: ${student.name}, Balance: Rs. ${student.balance}`);
            }
        });
    }
    // Method to display student status
    show_student_status(student_id) {
        let student = this.find_student(student_id);
        if (student) {
            student.show_status();
        }
        else {
            console.log("Student not found. Please enter a correct student ID.");
        }
    }
    // Method to find a student by a student id
    find_student(student_id) {
        return this.students.find(std => std.id === student_id);
    }
}
// Main Function to run the program
async function main() {
    console.log("Welcome to Student Management System");
    console.log("-".repeat(50));
    let student_manager = new Student_manager();
    // While loop to keep program running
    while (true) {
        let choice = await inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Select an option",
                choices: [
                    "Add Student",
                    "Enroll Student",
                    "View Student Balance",
                    "Add Balance",
                    "Pay Fees",
                    "Show Status",
                    "Show Fee Collection",
                    "Show Unpaid Fees",
                    "Exit"
                ],
            }
        ]);
        // Using Switch Case to Handle user choices
        switch (choice.choice) {
            case "Add Student":
                let name_input = await inquirer.prompt([
                    {
                        name: "name",
                        type: "input",
                        message: "Enter a Student Name",
                    }
                ]);
                student_manager.add_student(name_input.name);
                break;
            case "Enroll Student":
                let course_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid Student ID.";
                        }
                    },
                    {
                        name: "course",
                        type: "list",
                        message: "Select a course",
                        choices: [
                            "MS OFFICE",
                            "Web Development",
                            "App Development",
                            "Python Programming",
                        ]
                    }
                ]);
                student_manager.enroll_student(course_input.student_id, course_input.course);
                break;
            case "View Student Balance":
                let balance_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid Student ID.";
                        }
                    }
                ]);
                student_manager.view_student_balance(balance_input.student_id);
                break;
            case "Add Balance":
                let add_balance_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid Student ID.";
                        }
                    },
                    {
                        name: "amount",
                        type: "number",
                        message: "Enter the amount to add",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid amount.";
                        }
                    }
                ]);
                student_manager.add_student_balance(add_balance_input.student_id, add_balance_input.amount);
                break;
            case "Pay Fees":
                let fees_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid Student ID.";
                        }
                    },
                    {
                        name: "amount",
                        type: "number",
                        message: "Enter the amount to pay",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid amount.";
                        }
                    },
                    {
                        name: "month",
                        type: "list",
                        message: "Select the month for fee payment",
                        choices: [
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July"
                        ]
                    }
                ]);
                student_manager.pay_student_fees(fees_input.student_id, fees_input.amount, fees_input.month);
                break;
            case "Show Status":
                let status_input = await inquirer.prompt([
                    {
                        name: "student_id",
                        type: "number",
                        message: "Enter a Student ID",
                        validate: (input) => {
                            return input > 0 ? true : "Please enter a valid Student ID.";
                        }
                    }
                ]);
                student_manager.show_student_status(status_input.student_id);
                break;
            case "Show Fee Collection":
                student_manager.show_fee_collection();
                break;
            case "Show Unpaid Fees":
                student_manager.show_unpaid_fees();
                break;
            case "Exit":
                console.log("Exiting...");
                process.exit();
        }
    }
}
// Calling the main function
main();
