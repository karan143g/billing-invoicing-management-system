namespace BillingAPI.DTOs
{
    public class InvoiceListDto
    {
        public int InvoiceId { get; set; }
        public string? InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string? CustomerName { get; set; }
        public decimal GrandTotal { get; set; }

    }
}
