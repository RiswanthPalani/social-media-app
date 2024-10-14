import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

    // useEffect(() => {

    //   if (!currentUser) return;

    //   const checkLogin = async () => {
    //     try {
    //       const response = await axios.get('http://localhost:8800/api/auth/validate', {
    //         params: { userid: currentUser?.id },  // Pass the user ID as query param if needed
    //         withCredentials: true
    //       });
    //       if (!response.data.valid) {
    //         navigate("/login");
    //       }
    //     } catch (error) {
    //       if (error.response && !error.response.data.valid) {
    //         console.log("User is not logged in, navigating to login...");
    //         navigate("/login");
    //       } else {
    //         console.log("An unexpected error occurred: ", error);
    //       }
    //     }
    //   };

    //   // Call checkLogin on component mount
    //   checkLogin();
    // }, [currentUser, navigate]);

  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
    </div>
  );
}

export default Home;
