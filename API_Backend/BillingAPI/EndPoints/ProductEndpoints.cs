using AutoMapper;
using BillingAPI.Data;
using BillingAPI.DTOs;
using BillingAPI.Entities;
using Dapper;
using System.Data;

namespace BillingAPI.EndPoints
{
    public static class ProductEndpoints
    {
        public static void MapProductEndpoints(this WebApplication app)
        {
            app.MapGet("/api/products", async (
                DapperContext context,
                IMapper mapper) =>
            {
                using var connection = context.CreateConnection();

                var products = await connection.QueryAsync<Product>(
                    "sp_GetProducts",
                    commandType: CommandType.StoredProcedure);

                return Results.Ok(mapper.Map<IEnumerable<ProductDto>>(products));
            });

            app.MapGet("/api/products/{id:int}", async (
                int id,
                DapperContext context,
                IMapper mapper) =>
            {
                using var connection = context.CreateConnection();

                var product = await connection.QueryFirstOrDefaultAsync<Product>(
                    "sp_GetProductById",
                    new { ProductId = id },
                    commandType: CommandType.StoredProcedure);

                if (product == null)
                    return Results.NotFound();

                return Results.Ok(mapper.Map<ProductDto>(product));
            });

            app.MapPost("/api/products", async (
                ProductDto dto,
                DapperContext context,
                IMapper mapper) =>
            {
                using var connection = context.CreateConnection();

                var product = mapper.Map<Product>(dto);

                await connection.ExecuteAsync(
                    "sp_SaveProduct",
                    new
                    {
                        product.ProductId,
                        product.ProductName,
                        product.Price,
                        product.GSTPercent,
                        product.IsActive
                    },
                    commandType: CommandType.StoredProcedure);

                return Results.Ok();
            });



            app.MapDelete("/api/products/{id:int}", async (
                int id,
                DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                await connection.ExecuteAsync(
                    "sp_DeleteProduct",
                    new { ProductId = id },
                    commandType: CommandType.StoredProcedure);

                return Results.Ok();
            });
        }
    }
}
