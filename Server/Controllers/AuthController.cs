using Server.Models;
using Server.Services;
using Server.Data;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public AuthController(ApplicationDbContext context, ITokenService tokenService)
        {
            _context= context?? throw new ArgumentNullException(nameof(context));
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] UserDto request)
        {
            if (request is null)
            {
                return BadRequest("Invalid client request");
            }

            var user = _context.Users.FirstOrDefault(user => user.UserName == request.UserName);
            if (user is null)
            {
                return BadRequest("User not found");
            }
            if(!VerifyPasswordHash(request.Password,user.PasswordHash,user.PasswordSalt))
            {
                return BadRequest("Wrong password");
            }
            // Get user's roles and add it to claims
            List<string> roles = GetUserRoles(user.UserName);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Role, "User"),
                new Claim(ClaimTypes.Role, "DummyRole")
            };
            foreach (string role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role,role));
            }
            var accessToken = _tokenService.GenerateAccessToken(claims);
            var refreshToken = _tokenService.GenerateRefreshToken(claims);

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddMinutes(15);

            _context.SaveChanges();

            return Ok(new AuthenticatedResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }
        [HttpPost,Route("register")]
        public async Task<ActionResult> Register([FromBody] UserDto request)
        {
            if(_context.Users.Any(user => user.UserName == request.UserName))
            {
                return BadRequest("User already exists!");
            }
            CreatePasswordHash(request.Password,out byte[] passwordHash, out byte[] passwordSalt);
            var user = new User
            {
                UserName = request.UserName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User successfully created!");

        }
        private void CreatePasswordHash(string password, out byte[]passwordHash,out byte[]passwordSalt)
        {
            using(var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }
        private List<string> GetUserRoles(string username){
                var roleList = (
                from ur in _context.UserRoles
                join u in _context.Users on ur.UserId equals u.Id
                join r in _context.Roles on ur.RoleId equals r.id
                select new UserRoleInfo(){
                    User= u.UserName,
                    Role= r.Name
                }).ToList(); 
                List<string> list = new List<string>();
                foreach (UserRoleInfo role in roleList){
                    if(role.User == username){
                        list.Add(role.Role);
                    }
                }
                return list;
        }
    }
}