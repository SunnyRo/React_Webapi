using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models
{
    public class UserRole 
    {
        [Key]
        public int Id {get;set;}
        public Guid UserId{get;set;}
        public Guid RoleId{get;set;}
        public User User{get;set;}
        public Role Role{get;set;}
    }
}