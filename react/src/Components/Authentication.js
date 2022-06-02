class AuthenticationService {
  signOut() {
    // localStorage.removeItem("user");
    localStorage.clear();
  }

  getCurrentUser() {
    return localStorage.getItem("user");
  }
}

export default new AuthenticationService();
