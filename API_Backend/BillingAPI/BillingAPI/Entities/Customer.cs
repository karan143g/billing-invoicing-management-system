namespace BillingAPI.Entities
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = "";
        public string Mobile { get; set; } = "";
        public string? Email { get; set; }
        public string? Address { get; set; }

        public bool IsActive { get; set; }
    }
}
