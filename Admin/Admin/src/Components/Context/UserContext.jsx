    import { createContext } from "react";

    const UserContext = createContext()
    // creates a “UserContext box,” ready to hold user-related data (like name, email, token, etc.).
    // Think of it as a shared storage that all components can access if they need to.
    export default UserContext