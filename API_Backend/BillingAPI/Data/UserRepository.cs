using Microsoft.Data.SqlClient;
using System.Data.SqlClient;
using Dapper;
using BillingAPI.DTOs;

namespace BillingAPI.Data
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection")!;
        }

        public async Task<UserDto?> GetUserByUsername(string username)
        {
            using var conn = new SqlConnection(_connectionString);

            return await conn.QueryFirstOrDefaultAsync<UserDto>(
                @"SELECT UserId, Username, PasswordHash, Role, IsActive
              FROM Users
              WHERE Username = @Username AND IsActive = 1",
                new { Username = username }
            );
        }
    }
}
