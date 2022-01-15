const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (question) => {
  return new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer)
    })
  })
}

const main = async () => {
  const username = await question('Please enter a username: ');
  const password = await question('Please enter a password: ');
  const email = await question('Please enter an email:');
  console.log("result: ", {
      "username" : username,
      "password" : password
  });
  rl.close()
}

main()