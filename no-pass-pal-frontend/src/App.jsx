import axios from "axios";
import "./App.css";
import { useDarkMode } from "./utils/isDarkMode";
import { useState } from "react";
import ValidatedText from "./components/validatedText";

function App() {
  const isDarkMode = useDarkMode();
  const [validatedText, setValidatedText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function validatePassword(e) {
    e.preventDefault();
    try {
      setLoading(true);
      console.log(password);
      const response = await axios.post(
        "https://nopasspal-2.onrender.com/validator",
        {
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      setValidatedText(response.data.message);
    } catch (error) {
      console.error("Error validating password:", error);
      setValidatedText("I am out of funds. Please come back Later");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex relative z-0 flex-col justify-start items-center text-black dark:bg-black dark:text-white px-12">
      <img
        src={"assets/rick_roll.gif"}
        alt="never-gonna-give-you-up"
        className="h-screen opacity-5"
      />
      <div className="absolute z-10 flex flex-col items-center">
        <img
          src={isDarkMode ? "assets/logo_white.png" : "assets/logo_black.png"}
          alt="logo"
          className="my-24 px-16"
        />
        <h3 className=" text-xl md:text-2xl my-6 text-center">
          Your friendly neighbourhood{" "}
          <span className="font-bold">password rejector!</span>
        </h3>
        <form
          onSubmit={validatePassword}
          className="flex flex-col items-center px-8 text-center w-full"
        >
          <input
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            type={"text"}
            placeholder="Type your password"
            className="border focus:border-red-400 focus:outline-none focus:ring-0 border-gray-900 rounded-lg p-2 mt-4 w-full md:w-full h-16 placeholder:text-center placeholder:text-gray-500 dark:placeholder:text-gray-300 bg-inherit text-center text-black dark:text-gray-300"
          />
          {validatedText != "" ? <ValidatedText text={validatedText} /> : null}
          <button
            disabled={loading}
            className="my-8 rounded-xl bg-red-500 py-2 px-5 h-12 w-1/2 md:w-1/3 text-white"
            onClick={validatePassword}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
