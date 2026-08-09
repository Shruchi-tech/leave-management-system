import useAuthStore from "../store/authStore";

const Navbar = () => {

    const user = useAuthStore(
        (state) => state.user
    );

    const logout = useAuthStore(
        (state) => state.logout
    );

    return (
        <header className="navbar">

            <div className="brand">
                <div className="brand-logo">📖</div>
    
               <div>
                    <h2>Leave Management System</h2>
                    <span>Employee Portal</span>
               </div>
           </div>

           <div className="navbar-user">
               <span>{user?.fullName}</span>

               <button onClick={logout}>
                    Logout
               </button>
            </div>

        </header>
    );
};

export default Navbar;