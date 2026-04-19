namespace BillingAPI.DTOs
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public decimal GSTPercent { get; set; }
        public bool IsActive { get; set; }
    }
}
