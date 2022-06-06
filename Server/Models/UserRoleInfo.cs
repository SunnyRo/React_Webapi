using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class UserRoleInfo 
    {
        public string User {set;get;}=string.Empty;
        public string Role{set;get;}=string.Empty;
    }
}