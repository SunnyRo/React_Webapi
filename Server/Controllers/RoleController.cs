using Server.Models;
using Server.Services;
using Server.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public RoleController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context= context?? throw new ArgumentNullException(nameof(context));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }
        [HttpGet,Authorize(Roles="Admin"),Route("roles")]
        public async Task<ActionResult<IEnumerable<Role>>> Roles()
        {
            
            return await _context.Roles.ToListAsync();
        }
        [HttpGet,Authorize,Route("userroles")]
        public async Task<ActionResult<IEnumerable<UserRoleInfo>>> UserRoleInfor()
        {
            var roleList = (
                from ur in _context.UserRoles
                join u in _context.Users on ur.UserId equals u.Id
                join r in _context.Roles on ur.RoleId equals r.id
                select new UserRoleInfo(){
                    User= u.UserName,
                    Role= r.Name
                }).ToListAsync(); 
            return await roleList;

        }
        [HttpPost,Authorize(Roles="Admin"),Route("createrole")]
        public async Task<ActionResult<IEnumerable<Role>>> CreateRole([FromBody] RoleDto request)
        {
            if(_context.Roles.Any(role => role.Name == request.Name))
            {
                return BadRequest("Role already exists!");
            }
            var role = new Role();
            role.Name = request.Name;
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return await _context.Roles.ToListAsync();
        }
        [HttpPost,Authorize(Roles="Admin"),Route("deleterole")]
        public async Task<ActionResult<IEnumerable<Role>>> DeleteRole([FromBody] RoleDto request)
        {
            try
            {
                var id = (_context.Roles.FirstOrDefault(role => role.Name == request.Name)).id;
                var role = await _context.Roles.FindAsync(id);
                if (role!= null)
                {
                    _context.Roles.Remove(role);
                }
                await _context.SaveChangesAsync();
                return await _context.Roles.ToListAsync();
            }
            catch
            {
                return BadRequest("Role not found!");

            }
        }
        [HttpPost,Authorize(Roles="Admin"),Route("addrole")]
        public async Task<ActionResult<IEnumerable<UserRoleInfo>>> AddUserRole([FromBody] UserRoleDto request)
        {
            try
            {
                var userId = (_context.Users.FirstOrDefault(user => user.UserName == request.UserName)).Id;
                var roleId = (_context.Roles.FirstOrDefault(role => role.Name == request.RoleName)).id;
                if(_context.UserRoles.Any(user => user.UserId== userId) && _context.UserRoles.Any(user=>user.RoleId==roleId))
                {
                    return BadRequest("User already had this role!");
                }
                var userRole = new UserRole();
                userRole.RoleId = roleId;
                userRole.UserId = userId;
                _context.UserRoles.Add(userRole);
                await _context.SaveChangesAsync();
                var roleList = (
                from ur in _context.UserRoles
                join u in _context.Users on ur.UserId equals u.Id
                join r in _context.Roles on ur.RoleId equals r.id
                select new UserRoleInfo(){
                    User= u.UserName,
                    Role= r.Name
                }).ToListAsync(); 
                return await roleList;
            }
            catch
            {
                return BadRequest("There is neither role or user in the server!");
            }
        }      
        [HttpPost,Authorize(Roles="Admin"),Route("removerole")]
        public async Task<ActionResult<IEnumerable<UserRoleInfo>>> RemoveUserRole([FromBody] UserRoleDto request)
        {
            try
            {
                var userId = (_context.Users.FirstOrDefault(user => user.UserName == request.UserName)).Id;
                var roleId = (_context.Roles.FirstOrDefault(role => role.Name == request.RoleName)).id;
                if(!(_context.UserRoles.Any(user => user.UserId== userId) && _context.UserRoles.Any(user=>user.RoleId==roleId)))
                {
                    return BadRequest("User does not have this role!");
                }
                var id = (_context.UserRoles.FirstOrDefault(role => role.UserId == userId && role.RoleId == roleId)).Id;
                var userRole = await _context.UserRoles.FindAsync(id);
                _context.UserRoles.Remove(userRole);
                await _context.SaveChangesAsync();
                var roleList = (
                from ur in _context.UserRoles
                join u in _context.Users on ur.UserId equals u.Id
                join r in _context.Roles on ur.RoleId equals r.id
                select new UserRoleInfo(){
                    User= u.UserName,
                    Role= r.Name
                }).ToListAsync(); 
                return await roleList;
            }
            catch
            {
                return BadRequest("There is neither role or user in the server!");
            }
        }  
    }
}