using System.ComponentModel.DataAnnotations;
namespace webapi.Models;
public class UserDto
{
    [Key]
    public string Username {get;set;} = string.Empty;
    public string Password {get;set;} = string.Empty;
}