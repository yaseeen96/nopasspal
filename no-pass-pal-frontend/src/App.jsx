import axios from "axios";
import "./App.css";
import { useDarkMode } from "./utils/isDarkMode";
import { useRef, useState } from "react";
import ValidatedText from "./components/validatedText";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";

function App() {
  const isDarkMode = useDarkMode();
  const [validatedText, setValidatedText] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);

  async function validatePassword(e) {
    e.preventDefault();
    try {
      setLoading(true);
      if (email.includes("yaseen@st")) {
        setValidatedText("Copy cat! You can't use my email. Try your own!");
        return;
      } else if (!email.includes("@")) {
        setValidatedText("You need to add a valid email buddy!");
        return;
      } else if (password === "") {
        setValidatedText("You gotta add a password buddy!");
        return;
      }

      console.log(password);
      const response = await axios.post(
        "https://nopasspal-2.onrender.com/validator",
        {
          email: email,
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
        <h3 className="text-xl md:text-2xl my-6 text-center text-gray-700 dark:text-gray-400">
          Your friendly neighbourhood{" "}
          <span className="font-bold text-black dark:text-white">
            password rejector!
          </span>
        </h3>
        <form
          onSubmit={validatePassword}
          className="flex flex-col items-center px-8 text-center w-full"
        >
          <input
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                passwordRef.current.focus();
              }
            }}
            type="text"
            placeholder="yaseen@standardtouch.com"
            className="border focus:border-red-400 focus:outline-none focus:ring-0 border-gray-500 rounded-none p-2 mt-4 w-full md:w-full h-16 placeholder:text-center placeholder:text-gray-400 dark:placeholder:text-gray-700 bg-inherit text-center text-black dark:text-gray-300"
          />

          <div className="relative w-full">
            <input
              ref={passwordRef}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Type your password"
              className="border focus:border-red-400 focus:outline-none focus:ring-0 border-gray-500 rounded-none p-2 mt-4 w-full md:w-full h-16 placeholder:text-center placeholder:text-gray-400 dark:placeholder:text-gray-700 bg-inherit text-center text-black dark:text-gray-300"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 bottom-1/2  text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={24} />
              ) : (
                <AiOutlineEye size={24} />
              )}
            </button>
          </div>
          {validatedText != "" ? <ValidatedText text={validatedText} /> : null}
          <button
            disabled={loading}
            className="my-8 rounded-none bg-[#ec0000] py-2 px-5 text-lg  w-full border-[3px] border-black h-16  text-black font-bold "
            onClick={validatePassword}
          >
            Sign in
          </button>
        </form>
      </div>

      <div className="absolute bottom-8 text-gray-500 ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center items-center gap-2">
            <p>Designed with ❤️ by Ven</p>
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <p>Developed by Yaseen</p>
            <a href="https://www.linkedin.com/in/syedyaseeen/">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/_port_20_/">
              <FaInstagram />
            </a>
            <a href="https://github.com/yaseeen96">
              <FaGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
