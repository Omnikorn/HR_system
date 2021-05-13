const mysql = require("mysql")
const inquirer = require("inquirer")



// Creating the connection to the server 
const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "company",
})


// first run -  run at the begining of the programme
connection.connect((err) => {
	if (err) throw err
	main()
})




// main function 

const main = () =>{
    inquirer.prompt([{
        type:"list",
        name: "section",
        message: "What section do you want to access ?",
        choices: ["Department","Roles", "Employees"]
    }])
    .then((answer)=>{
        switch (answer.section){
            case "Department":
                whatToDo1();
                break;
        }
    })
}



// functions for the department section 
const whatToDo1 = () => {
	inquirer.prompt([

			{
				type: "list",
				name: "what1",
				message:
					"Welcome to departments, what do you want to do ?",
				choices: [
					"Add department",
					"Delete department",
					"View department employees",
					"Exit",
				],
			}])

        .then ((answer) => {
			console.log("your answer is " + answer.what1)
			switch (answer.what1) {
				case "Add department":
					console.log("add gets =" + answer.what1);
					addDepartment();
					break;

				case "Delete department":
					console.log("delet gets= " + answer.what1);
					deleteDepartment();
					break;

				case "view department employees":
					console.log(" this is the view employees ")
					runSearch();
					break;

				case "Exit":
					console.log("exit gets = " + answer.what1);
					break;

				default:
					whatToDo1();
			};
		})

};


const deleteDepartment = () =>{
	connection.query(
		`SELECT * FROM department`,
		(err, res) => {
			if (err) throw err;

			const choices = []
			res.forEach(({ id, name }) => {
				console.log(`${id} || ${name}`)
				choices.push(`${name}`)
			})
	inquirer.prompt([{
		type:"list",
		name: "whichdepartment",
		message: " which department do you want to delete ?",
		choices: choices
	}])
	.then((answers) => {
		let query=" DELETE FROM department where ?";
		connection.query(query, [{name: answers.whichdepartment}],(err,res)=>{
			if (err) throw err;
			console.log(`succefully delted ${answers.whichdepartment}`)
		})
	});
});
};


const addDepartment = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "newDepartment",
				message: "Whats the name of the new department?",
			},
		])
		.then((answers) => {
			let query = "INSERT INTO department SET ? "
			connection.query(
				query,
				[{ name: answers.newDepartment }],
				(err, res) => {
					if (err) throw err
					console.log(
						`Succesfully created ${answers.newDepartment} department`
					)
				}
			)
		})
}
