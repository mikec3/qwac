'use client'
import styles from "./page.module.css";
export default function MyForm(props) {

    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(event.target.answer.value);

        props.onSubmit(event.target.answer.value);
    }


  return (
    <div>
    <form className={styles.answerForm} onSubmit={handleSubmit}>
    <textarea className={styles.answerInput} type="text" name="answer"></textarea>
    <button className={styles.answerButton} type="submit"> Quack! </button>
  </form>
  </div>
  );
}