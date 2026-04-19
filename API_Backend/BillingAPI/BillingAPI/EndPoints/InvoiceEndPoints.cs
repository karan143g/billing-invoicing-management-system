using AutoMapper;
using BillingAPI.Data;
using BillingAPI.DTOs;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BillingAPI.EndPoints
{
    public static class InvoiceEndPoints
    {
        public static void MapInvoiceEndpoints(this WebApplication app)
        {
            app.MapPost("/api/invoices", async (
    InvoiceSaveDto dto,
    IConfiguration config
) =>
            {
                using var con = new SqlConnection(
                    config.GetConnectionString("DefaultConnection")
                );

                using var cmd = new SqlCommand("sp_SaveInvoice", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@InvoiceDate", dto.InvoiceDate);
                cmd.Parameters.AddWithValue("@CustomerId", dto.CustomerId);
                cmd.Parameters.AddWithValue("@SubTotal", dto.SubTotal);
                cmd.Parameters.AddWithValue("@GstTotal", dto.GstTotal);
                cmd.Parameters.AddWithValue("@GrandTotal", dto.GrandTotal);

                // TVP
                var table = new DataTable();
                table.Columns.Add("ProductId", typeof(int));
                table.Columns.Add("Qty", typeof(int));
                table.Columns.Add("Rate", typeof(decimal));
                table.Columns.Add("GstPercent", typeof(decimal));
                table.Columns.Add("Amount", typeof(decimal));
                table.Columns.Add("GstAmount", typeof(decimal));
                table.Columns.Add("Total", typeof(decimal));

                foreach (var item in dto.Items)
                {
                    table.Rows.Add(
                        item.ProductId,
                        item.Qty,
                        item.Rate,
                        item.GstPercent,
                        item.Amount,
                        item.GstAmount,
                        item.Total
                    );
                }

                var tvp = cmd.Parameters.AddWithValue("@Items", table);
                tvp.SqlDbType = SqlDbType.Structured;
                tvp.TypeName = "InvoiceItemType";

                await con.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();
                await reader.ReadAsync();

                return Results.Ok(new
                {
                    InvoiceId = reader["InvoiceId"],
                    InvoiceNo = reader["InvoiceNo"]
                });
            });

            app.MapGet("/api/invoices", async (
    string? invoiceNo,
    int? customerId,
    DateTime? fromDate,
    DateTime? toDate,
    IConfiguration config
) =>
            {
                var result = new List<InvoiceListDto>();

                using var con = new SqlConnection(
                    config.GetConnectionString("DefaultConnection")
                );

                using var cmd = new SqlCommand("sp_GetInvoices", con);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@InvoiceNo", (object?)invoiceNo ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@CustomerId", (object?)customerId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@FromDate", (object?)fromDate ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ToDate", (object?)toDate ?? DBNull.Value);

                await con.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    result.Add(new InvoiceListDto
                    {
                        InvoiceId = reader.GetInt32(0),
                        InvoiceNo = reader.GetString(1),
                        InvoiceDate = reader.GetDateTime(2),
                        CustomerName = reader.GetString(3),
                        GrandTotal = reader.GetDecimal(4)
                    });
                }

                return Results.Ok(result);
            });

            app.MapGet("/api/invoices/{invoiceId}", async (
    int invoiceId,
    IConfiguration config) =>
            {
                using var con = new SqlConnection(
                    config.GetConnectionString("DefaultConnection"));

                using var cmd = new SqlCommand("usp_GetInvoiceById", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@InvoiceId", invoiceId);

                await con.OpenAsync();

                using var reader = await cmd.ExecuteReaderAsync();

                // HEADER
                InvoiceHeaderDto header = null;

                if (await reader.ReadAsync())
                {
                    header = new InvoiceHeaderDto
                    {
                        InvoiceId = reader.GetInt32(0),
                        InvoiceNo = reader.GetString(1),
                        InvoiceDate = reader.GetDateTime(2),
                        SubTotal = reader.GetDecimal(3),
                        GstTotal = reader.GetDecimal(4),
                        GrandTotal = reader.GetDecimal(5),
                        CustomerId = reader.GetInt32(6),
                        CustomerName = reader.GetString(7),
                        Mobile = reader.IsDBNull(8) ? null : reader.GetString(8),
                        Email = reader.IsDBNull(9) ? null : reader.GetString(9),
                        Address = reader.IsDBNull(10) ? null : reader.GetString(10)
                    };
                }

                // ITEMS
                await reader.NextResultAsync();

                var items = new List<InvoiceItemDto>();

                while (await reader.ReadAsync())
                {
                    items.Add(new InvoiceItemDto
                    {
                        InvoiceItemId = reader.GetInt32(0),
                        ProductId = reader.GetInt32(1),
                        ProductName = reader.GetString(2),
                        Qty = reader.GetInt32(3),
                        Rate = reader.GetDecimal(4),
                        GstPercent = reader.GetDecimal(5),
                        Amount = reader.GetDecimal(6),
                        GstAmount = reader.GetDecimal(7),
                        Total = reader.GetDecimal(8)
                    });
                }

                if (header == null)
                    return Results.NotFound();

                return Results.Ok(new InvoiceViewDto
                {
                    Header = header,
                    Items = items
                });
            });

        }
    }
}
