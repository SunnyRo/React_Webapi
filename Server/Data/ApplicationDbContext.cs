using Microsoft.EntityFrameworkCore;
using Server.Models;
namespace Server.Data;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Role>().HasData(new Role 
        {
            Name = "Admin",
            id = Guid.NewGuid()
        });
    }
    public DbSet<User> Users{ get; set; }
    public DbSet<Role> Roles{ get; set; }
    public DbSet<UserRole> UserRoles{get;set;}
}