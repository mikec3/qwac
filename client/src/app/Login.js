'use client'
import styles from "./page.module.css";
import axios from 'axios'


export default function Login() {

    // send email and password to server for Firebase Auth login
    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(event.target.email.value);
        //console.log(event.target.password.value);

        let email = event.target.email.value;
        let password = event.target.password.value;

        		//console.log(props.user);
		let data = JSON.stringify({
			"email": email,
            "password": password
		})

		let config = {
			method : 'post',
            url: 'http://localhost:3001/api/loginWithEmail',
			headers: {
				    'Content-Type': 'application/json', 
    				'Accept': 'application/json'
			},
			data : data
		};

		axios(config)
		.then((response) => {
			if (response != 'error') {
			// if user theme update is successful, set the theme here.
			console.log(response);
			} else {
			//setError('theme not found')
			}
		})
		.catch((error) => {
  		console.log(error);
		});

        
    }

  return (
    <div>
    <form className={styles.answerForm} onSubmit={handleSubmit}>
        <h3>Username</h3>
        <textarea className={styles.answerInput} type="text" name="email"></textarea>
        <h3>Password</h3>
        <textarea className={styles.answerInput} type="text" name="password"></textarea>
        <button className={styles.answerButton} type="submit"> Login </button>
    </form>
    </div>
  );
}