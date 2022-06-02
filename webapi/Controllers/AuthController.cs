using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using webapi.Data;
namespace webapi.Models;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    public static User user = new User();
    private readonly IConfiguration _configuration;
    private readonly ApplicationDbContext _context;
    public AuthController(IConfiguration configuration,ApplicationDbContext context)
    {
        _context = context;
        _configuration = configuration;
    }
    [HttpPost("register")]
    public async Task<ActionResult> Register(UserDto request)
    {
        if(_context.Users.Any(user => user.Username == request.Username))
        {
            return BadRequest("User already exists!");
        }
        CreatePasswordHash(request.Password,out byte[] passwordHash, out byte[] passwordSalt);
        var user = new User
        {
            Username = request.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok("User successfully created!");

    }
    [HttpPost("login")]
    public async Task<ActionResult> Login(UserDto request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(user => user.Username == request.Username);
        if(user == null)
        {
            return BadRequest("User not found");
        }
        if(!VerifyPasswordHash(request.Password,user.PasswordHash,user.PasswordSalt))
        {
            return BadRequest("Wrong password");
        }
        string token = CreateToken(user);
        return Ok(token);
    }
    private string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name,user.Username)
        };
        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value));
        var credential = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken
        (
            claims:claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials:credential
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
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
}