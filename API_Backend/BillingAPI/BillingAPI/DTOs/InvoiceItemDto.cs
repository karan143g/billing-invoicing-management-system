namespace BillingAPI.DTOs
{
    public class InvoiceItemDto
    {
        public int? InvoiceItemId { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public int Qty { get; set; }
        public decimal Rate { get; set; }
        public decimal GstPercent { get; set; }
        public decimal Amount { get; set; }
        public decimal GstAmount { get; set; }
        public decimal Total { get; set; }
    }
}
