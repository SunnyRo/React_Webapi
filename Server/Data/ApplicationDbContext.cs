using Microsoft.EntityFrameworkCore;
using Server.Models;
namespace Server.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users{ get; set; }
    public DbSet<Role> Roles{ get; set; }
    public DbSet<UserRole> UserRoles{get;set;}
}