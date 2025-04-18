import Cookies from "universal-cookie";
import UserPage from "./UserPage";
import getCachedLogin from "../functions/getCachedLogin";

function MyPage() {
  let login = getCachedLogin();
  console.log("RET MY LOGIN");
  console.log(
    (() => {
      return { id: login };
    })()
  );
  return UserPage({
    get_id: () => {
      return { id: login };
    },
  });
}

export default MyPage;
