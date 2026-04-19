namespace BillingAPI.DTOs
{
    public class InvoiceViewDto
    {
        public InvoiceHeaderDto? Header { get; set; }
        public List<InvoiceItemDto> Items { get; set; } = new();
    }
}
