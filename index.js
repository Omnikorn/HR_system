const mysql = require("mysql")
const inquirer = require("inquirer")



// Creating the connection to the server 
const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "@Tobyleron3",
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
            
            case "Roles":
                whatToDo2();
                break;

            case "Employees":
                whatToDo3();
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
					searchDepartment();
					break;

				case "Exit":
					main();
					break;

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

const searchDepartment = () => {
	connection.query(
		`SELECT * FROM department`,
		(err, res) => {
			if (err) throw err

			const choices = []
			res.forEach(({ id, name }) => {
				console.log(`${id} || ${name}`)
				choices.push(`${name}`)
			})

			inquirer
				.prompt([
					{
						type: "list",
						name: "department",
						message: "which department do you want to view",
						choices: choices,
					},
				])
				.then((answers) => {

					let q2 = "SELECT department.name, role.title, employee.first_name, employee.last_name, employee.role_id  ";
					q2 += "from department INNER JOIN role on department.id=role.department_id ";
					q2 += "INNER JOIN employee on role.id=employee.role_id ";
					q2 += " WHERE department.name = ? ";
					connection.query(q2,[answers.department], (err, res) => {
						if (err) throw err;
						res.forEach(
							({ name,first_name, last_name, title }) => {
								console.log(
									`name= ${name} | ${first_name} | ${last_name} | ${title}`
								)
							}
						)
					})
				})
		})
	// ) ;connection.end();
}


// Functions for the Roles section 

const whatToDo2 =()=>{
    inquirer.prompt([{
        type:"list",
        name:"option",
        message:"What would you like to do",
        choices:["Add new role","Delete current role","View current roles","Exit"]
    }])
    .then((answer)=>{
        switch (answer.option) {
            case "Add new role":
                addRole();
                break;
            
            case "Delete current role":
                deleteRole();
                break;

            case "View current roles":
                viewRole();
                break;
            
            case "Exit":
                main();
                break;
        }
    })
}



const addRole = () => {
	inquirer
		.prompt([
			{
				type: "input",
				name: "newRole",
				message: "Whats the name of the new Role?",
			},
            {
                type: "input",
                name: "salary",
                message: "what salary does the new role pay ?"
            },
            {
                type:"input",
                name:"dep_id",
                message: "what departmet is this role at ? "
            }
		])
		.then((answers) => {
			let query = "INSERT INTO role SET ? "
			connection.query(
				query,
				[{ title: answers.newRole ,salary:answers.salary, department_id:answers.dep_id}],
				(err, res) => {
					if (err) throw err
					console.log(
						`Succesfully created ${answers.newRole}.`
					)
				}
			)
		})
        .then (()=>whatToDo2());
}

const deleteRole = () =>{
	connection.query(
		`SELECT * FROM role`,
		(err, res) => {
			if (err) throw err;

			const choices = []
			res.forEach(({ id, title }) => {
				console.log(`${id} || ${title}`)
				choices.push(`${title}`)
			})
	inquirer.prompt([{
		type:"list",
		name: "which_role",
		message: " which role do you want to remove ?",
		choices: choices
	}])
	.then((answers) => {
		let query=" DELETE FROM role where ?";
		connection.query(query, [{title: answers.which_role}],(err,res)=>{
			if (err) throw err;
			console.log(`succefully deleted ${answers.which_role}`)
             
		})
	});
}) .then (()=> whatToDo2()) 
};

const viewRole = () =>{
    connection.query("SELECT * FROM role",(err,res)=>{
        if(err) throw err;
        res.forEach(({id,title})=>
        console.log(`${id} | ${title}`))
        whatToDo2()
        
    }) 
}

// Functions for the Employee section

const whatToDo3 =()=>{
    inquirer.prompt([{
        type:"list",
        name:"option",
        message:"What would you like to do",
        choices:["Add new employee","Remove current employee","Edit current employee's role","Exit"]
    }])
    .then((answer)=>{
        switch (answer.option) {
            case "Add new employee":
                addEmployee();
                break;
            
            case "Remove current employee":
                deleteEmployee();
                break;

            case "View current roles":
                viewRole();
                break;
            
            case "Exit":
                main();
                break;
        }
    })
}

const addEmployee = ()=>{
    inquirer.prompt([{
        type:"input",
        name:"first_name",
        message:"Emplyee's first name"
    },{
        type:"input",
        name:"last_name",
        message:"Employee's last name?"
    },
    {
        type:"input",
        name:"role_id",
        message: " What is their role ID ?"
    },
    {
        type:"input",
        name:"manager_id",
        message:"what is their manager's ID?"
    }

])
    .then((answers)=>{
        let query = "INSERT INTO employee SET ? "
			connection.query(
				query,
				[{ first_name: answers.first_name, last_name:answers.last_name, role_id:answers.role_id, manager_id:answers.manager_id}],
				(err, res) => {
					if (err) throw err
					console.log(
						`Succesfully added ${answers.first_name}${answers.last_name}.`
					)
				}
			)
    })
.then(()=>{
    inquirer.prompt([{
        type:"list",
        name:"option",
        message:"Do you want to add another emplyee ?",
        choices:["Yes","No"]

    }])
    .then((answer)=>{
        switch (answer.option){
            case "Yes":
                addEmployee();
                break;

            case "No":
                whatToDo3();
                break;
        }
    })
})
}


const deleteEmployee =()=>{
    connection.query(
		`SELECT * FROM employee`,
		(err, res) => {
			if (err) throw err;

			const choices = []
			res.forEach(({ id, first_name,last_name }) => {
				console.log(`${id} | ${first_name} ${last_name}`)
				// choices.push(`${first_name} ${last_name}`)
			})
	inquirer.prompt([{
		type:"input",
		name: "who",
		message: " which employee do you want to remove ?",
		// choices: choices
	}])
	.then((answers) => {
		let query=" DELETE FROM employee where ?";
		connection.query(query, [{id: answers.who}],(err,res)=>{
			if (err) throw err;
			console.log(`succefully deleted`)
             
		})
	}).then(()=>{
        inquirer.prompt([{
            type:"list",
            name:"option",
            message:"Do you want to remove another emplyee ?",
            choices:["Yes","No"]
    
        }])
        .then((answer)=>{
            switch (answer.option){
                case "Yes":
                    deleteEmployee();
                    break;
    
                case "No":
                    whatToDo3();
                    break;
            }
        })
    }) 
}) 
}