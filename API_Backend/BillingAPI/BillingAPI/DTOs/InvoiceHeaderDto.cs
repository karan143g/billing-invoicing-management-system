namespace BillingAPI.DTOs
{
    public class InvoiceHeaderDto
    {
        public int InvoiceId { get; set; }
        public string? InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }

        public decimal SubTotal { get; set; }
        public decimal GstTotal { get; set; }
        public decimal GrandTotal { get; set; }

        public int CustomerId { get; set; }
        public string? CustomerName { get; set; }

        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
    }
}
