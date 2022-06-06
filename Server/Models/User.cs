using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public string? UserName { get; set; }
        public byte[] PasswordHash {get;set;}
        public byte[] PasswordSalt {get;set;}
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}