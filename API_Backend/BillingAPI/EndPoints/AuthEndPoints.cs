using BillingAPI.Data;
using BillingAPI.DTOs;
using Microsoft.Data.SqlClient;

namespace BillingAPI.EndPoints
{
    public static class AuthEndPoints
    {
        public static void MapAuthEndpoints(this WebApplication app)
        {
            app.MapPost("/api/login", async (
                LoginRequestDto dto,
                UserRepository userRepo,
                IJwtTokenService tokenService
            ) =>
            {
                var user = await userRepo.GetUserByUsername(dto.Username);

                if (user == null)
                    return Results.Unauthorized();

                if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                    return Results.Unauthorized();

                var token = tokenService.GenerateToken(user);

                return Results.Ok(new
                {
                    token,
                    user = new
                    {
                        user.UserId,
                        user.Username,
                        user.Role
                    }
                });
            });
        }

    }
}
