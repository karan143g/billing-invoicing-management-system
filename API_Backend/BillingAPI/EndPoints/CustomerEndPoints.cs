using AutoMapper;
using BillingAPI.Data;
using BillingAPI.DTOs;
using BillingAPI.Entities;
using Dapper;
using System.Data;

namespace BillingAPI.EndPoints
{
    public static class CustomerEndPoints
    {
        public static void MapCustomerEndpoints(this WebApplication app)
        {
            app.MapGet("/api/customers", async (
                DapperContext context,
                IMapper mapper) =>
            {
                using var connection = context.CreateConnection();

                var products = await connection.QueryAsync<Customer>(
                    "sp_GetCustomers",
                    commandType: CommandType.StoredProcedure);

                return Results.Ok(mapper.Map<IEnumerable<CustomerDto>>(products));
            });

            //app.MapGet("/api/products/{id:int}", async (
            //    int id,
            //    DapperContext context,
            //    IMapper mapper) =>
            //{
            //    using var connection = context.CreateConnection();

            //    var product = await connection.QueryFirstOrDefaultAsync<Customer>(
            //        "sp_GetProductById",
            //        new { ProductId = id },
            //        commandType: CommandType.StoredProcedure);

            //    if (product == null)
            //        return Results.NotFound();

            //    return Results.Ok(mapper.Map<CustomerDto>(product));
            //});

            app.MapPost("/api/customers", async (
                CustomerDto dto,
                DapperContext context,
                IMapper mapper) =>
            {
                using var connection = context.CreateConnection();

                var customer = mapper.Map<Customer>(dto);

                await connection.ExecuteAsync(
                    "sp_SaveCustomer",
                    new
                    {
                        customer.CustomerId,
                        customer.CustomerName,
                        customer.Mobile,
                        customer.Email,
                        customer.Address,
                        customer.IsActive,
                    },
                    commandType: CommandType.StoredProcedure);

                return Results.Ok();
            });



            app.MapDelete("/api/customers/{id:int}", async (
                int id,
                DapperContext context) =>
            {
                using var connection = context.CreateConnection();

                await connection.ExecuteAsync(
                    "sp_DeleteCustomer",
                    new { CustomerId = id },
                    commandType: CommandType.StoredProcedure);

                return Results.Ok();
            });
        }
    }
}
