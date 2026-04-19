namespace BillingAPI.DTOs
{
    public class InvoiceSaveDto
    {
        public DateTime InvoiceDate { get; set; }
        public int CustomerId { get; set; }
        public decimal SubTotal { get; set; }
        public decimal GstTotal { get; set; }
        public decimal GrandTotal { get; set; }
        public List<InvoiceItemDto> Items { get; set; }
    }
}
