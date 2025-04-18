import Cookies from "universal-cookie";
import UserPage from "./UserPage";
import UserEditPage from "./UserEditPage";
import getCachedLogin from "../functions/getCachedLogin";

function MyEditPage() {
  let login = getCachedLogin();
  // console.log("RET MY LOGIN");
  // console.log(
  //   (() => {
  //     return { id: login };
  //   })()
  // );
  return UserEditPage({
    get_id: () => {
      return { id: login };
    },
  });
}

export default MyEditPage;
