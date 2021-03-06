using Server.Models;
using Server.Services;
using Server.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JwtAuthentication.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITokenService _tokenService;

        public TokenController(ApplicationDbContext context, ITokenService tokenService)
        {
            this._context = context?? throw new ArgumentNullException(nameof(context));
            this._tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
        }

        [HttpPost]
        [Route("refresh")]
        public IActionResult Refresh(TokenApiModel tokenApiModel)
        {
            if (tokenApiModel is null)
                return BadRequest("request is wrong Invalid client request");

            // string accessToken = tokenApiModel.AccessToken;
            string refreshToken = tokenApiModel.RefreshToken;

            var principal = _tokenService.GetPrincipalFromExpiredToken(refreshToken);
            var username = principal.Identity.Name; //this is mapped to the Name claim by default

            var user = _context.Users.SingleOrDefault(u => u.UserName == username);

            // if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            //     return BadRequest("Invalid client request");

            if (user == null)
                return BadRequest("no user");
            if (user.RefreshToken != refreshToken)
                return BadRequest("something wrong with refresh token");
            if (user.RefreshTokenExpiryTime <= DateTime.Now)
                return BadRequest(user.RefreshTokenExpiryTime);

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            // var newRefreshToken = _tokenService.GenerateRefreshToken();

            // user.RefreshToken = newRefreshToken;
            _context.SaveChanges();

            return Ok(new AuthenticatedResponse()
            {
                AccessToken = newAccessToken,
                RefreshToken = refreshToken
            });
        }

        [HttpPost, Authorize]
        [Route("revoke")]
        public IActionResult Revoke()
        {
            var username = User.Identity.Name;

            var user = _context.Users.SingleOrDefault(u => u.UserName == username);
            if (user == null) return BadRequest();

            user.RefreshToken = null;

            _context.SaveChanges();

            return NoContent();
        }
    }
}