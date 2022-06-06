using System.ComponentModel.DataAnnotations;

namespace Server.Models
{
    public class Role
    {
        [Key]
        public Guid id {get;set;}
        public string? Name { get; set; }
    }
}